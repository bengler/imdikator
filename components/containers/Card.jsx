//  addValuesToTransform, moveElementsIntoSVG and addDescriptionAndSourceBelowDiagram
//  are horrible and could break if some classname or other detail changes (e.g. h3 becomes h4)
//  unfortunately the alternative is to refactor the architecture around d3
//  (because d3 hijacks the 'this' keyword), which produces a tremendous amount of pains and would take crazy hours to fix.
//  if the diagram is buggy or not behaving properly - inspect this function, it's probably the cause.

//  to better understand how d3 is used throughout this code: http://alignedleft.com/tutorials/d3/binding-data

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import d3_save_svg from 'd3-save-svg';
import SvgText from 'svg-text';
import includes from 'lodash.includes';

import { CHARTS } from '../../config/chartTypes';
import { TABS } from '../../config/tabs';
import { findHeaderGroupForQuery } from '../../lib/queryUtil';
import UrlQuery from '../../lib/UrlQuery';
import { queryResultPresenter } from '../../lib/queryResultPresenter';
import TabBar from '../elements/TabBar';

// untoggle to toggle the vis/skjul tall
// import ToggleView from '../elements/ToggleView'
import ChartViewModeSelect from '../elements/ChartViewModeSelect';

import { queryToOptions, describeChart } from '../../lib/chartDescriber';
import { getHeaderKey } from '../../lib/regionUtil';

import FilterBarContainer from './FilterBarContainer';
import CardMetadata from './CardMetadata';
import DownloadWidget from './DownloadWidget';

import '../../lib/element-closest.js';

import {
  trackCronologicalTabOpen,
  trackBenchmarkTabOpen
} from '../../actions/tracking';
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes';

class Card extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    card: ImdiPropTypes.card.isRequired,
    region: ImdiPropTypes.region.isRequired,
    query: PropTypes.object,
    queryResult: PropTypes.array,
    cardsPage: PropTypes.object,
    currentTabName: PropTypes.string,
    headerGroups: PropTypes.array,
    table: PropTypes.object,
    cardsPageName: PropTypes.string.isRequired,
    activeTab: PropTypes.object,
    printable: PropTypes.bool,
    description: PropTypes.string,
    printView: PropTypes.bool,

    // really confusing; thisCard is 'this' for this class (Card).
    // access it by calling this.props.thisCard (from children)
    // why? Because d3 hijacks 'this' in child scope after mount.
    // so if we want to use 'this' for Card, we must use this.props.thisCard (in child components)
    thisCard: PropTypes.any
  };

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func,
    navigate: PropTypes.func
  };

  constructor(props) {
    super();
    this.state = {
      chartViewMode: 'chart',
      screenshot: null,
      explicitView: true,
      description: null,
      printView: false,
      initialLoadComplete: false
    };

    this.offset = this.offset.bind(this);
    this.getUrlToTab = this.getUrlToTab.bind(this);
    this.getShareUrl = this.getShareUrl.bind(this);
    this.findAncestor = this.findAncestor.bind(this);
    this.setExplicitView = this.setExplicitView.bind(this);
    this.moveElementsIntoSVG = this.moveElementsIntoSVG.bind(this);
    this.addValuesToTransform = this.addValuesToTransform.bind(this);
    this.addDescriptionAndSourceBelowDiagram = this.addDescriptionAndSourceBelowDiagram.bind(
      this
    );
  }

  componentDidUpdate(prevProps, prevState) {
    this.moveElementsIntoSVG();
    this.addDescriptionAndSourceBelowDiagram();
  }

  componentDidMount() {
    this.moveElementsIntoSVG();
  }

  // takes a css transform: translate(500, 250) and adds to the X or/and Y value.
  // element is an element containing a transform attribute.
  // X and Y are the values you'd want to add to the existing X and Y.
  addValuesToTransform(element, addX, addY) {
    const transform = element.getAttribute('transform');
    let transformValues;

    if (!transform.includes(',')) {
      // IE11 excludes all existing commas from the transform property of obvious reasons (no reason).
      // So we'll split on space instead
      transformValues = transform.split(' ');
    } else {
      transformValues = transform.split(',');
    }

    // before ["translate(0", "-2.34)"]
    // after ["0", "-2.34"]
    const values = [
      transformValues[0].split('(')[1],
      transformValues[1].split(')')[0]
    ];

    // before ["0", "-2.34"]
    // after (ie: if x and y has the value 10) [10, 7.66]
    if (addX) values[0] = parseInt(values[0], 10) + addX;
    if (addY) values[1] = parseInt(values[1], 10) + addY;

    element.setAttribute(
      'transform',
      `translate(${values[0].toString()}, ${values[1].toString()})`
    );
  }

  moveElementsIntoSVG() {
    let svg = this.toggleList;
    if (!svg) return;
    svg = svg.querySelector('.chart__svg');
    if (!svg) return;

    // extra height for the svg diagram
    const extraHeightDiagram = 80;
    const extraHeightDiagramPyramid = 20;
    const maxNumberOfCharacters = 40;

    //  if this chart is pyramidchart - use different padding for colored boxes below chart
    const pyramid = this.props.activeTab.chartKind == 'pyramid';

    //  get all svg elements
    const chart = svg.querySelector('.chart__d3-points');
    const colorExplanation = svg.querySelector('.chart__legend-wrapper');

    //  move chart and colored squares lower
    this.addValuesToTransform(chart, null, extraHeightDiagram);

    if (colorExplanation) {
    this.addValuesToTransform(
      colorExplanation,
      null,
      pyramid ? extraHeightDiagramPyramid : extraHeightDiagram
      );
    }

    //  get the title
    const title = this.findAncestor(
      this.toggleList,
      '.toggle-list'
    ).querySelector('[data-graph-title]');

    //  add height
    const height =
      parseInt(svg.getAttribute('height'), 10) + extraHeightDiagram;
    svg.setAttribute('height', height);

    const unit = this.props.query.unit[0];

    //  adds title above diagam
    const numberOfCharacters = String(title.textContent).length;

    let counter = maxNumberOfCharacters;

    const textContent = new SvgText({
      text: `${title.textContent} (${unit})`,
      element: svg,
      maxWidth: 2,
      textOverflow: 'ellipsis',
      className: 'svg-text title'
    });
  }

  // type of polyfill for .closest()
  findAncestor(el, sel) {
    if (typeof el.closest === 'function') {
      return el.closest(sel) || null;
    }
    while (el) {
      if (el.matches(sel)) {
        return el;
      }
      el = el.parentElement;
    }

    return null;
  }

  offset(element) {
    const rect = element.getBoundingClientRect();

    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }

  //  use refs from each card component that toggles the height.
  //  every class like this is a card. use refs.
  addDescriptionAndSourceBelowDiagram() {
    let svg = this.toggleList;
    if (!svg) return;
    svg = svg.querySelector('.chart__svg');
    if (!svg) return;

    // space between the chart and description below
    const spaceBetweenGraphAndDescription = 100;

    // //  extra height for the svg diagram
    let extraHeightSVG = 240;
    const paddingBottom = 105;
    const spaceBetween = 30;

    const parent = this.findAncestor(this.toggleList, '[data-card]');
    const chart = svg.querySelector('.chart__d3-points');
    const originalHeight =
      chart.getBoundingClientRect().height || chart.getAttribute('height');

    // get number of descriptions below chart
    const descriptions = Array.prototype.slice.call(
      parent.querySelectorAll('.chart__legend')
    );

    // does the description squares below the chart flow horizontally?
    const descriptionsFlowVertically = descriptions.map((description, i) => {
      if (i === 0) return false;
      return (
        Number(
          description
            .querySelector('g')
            .getAttribute('transform')
            .split(',')[0]
            .split('translate(')[1]
        ) === 0
      );
    });

    // add extra height to chart if there are many descriptions / squares below chart while on mobile
    const width = window.innerWidth || 650;
    if (descriptionsFlowVertically.includes(true)) {
      const spacing = width <= 650 ? 40 : 20;
      extraHeightSVG += spacing * descriptions.length - spacing;
    }

    //  add extra height to svg
    const height = parseInt(originalHeight || 0, 10) + extraHeightSVG;
    svg.setAttribute('height', height);

    const viewBox = svg.getAttribute('viewBox').split(' ');
    const newViewBox = `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${height}`;
    svg.setAttribute('viewBox', newViewBox);

    const description = parent.querySelector('[data-chart-description]');
    const source = parent.querySelector('[data-chart-source]');

    if (!description.textContent) return;

    const descriptionSVGText = new SvgText({
      text: description.textContent,
      element: svg,
      maxWidth: svg.clientWidth || 0,
      textOverflow: 'ellipsis',
      className: 'svg-text text__description',
      verticalAlign: 'bottom'
    });

    const textDescription = svg.querySelector('.text__description');
    const newDescriptionHeight =
      svg.clientHeight - (spaceBetween + paddingBottom);
    this.addValuesToTransform(
      textDescription,
      null,
      newDescriptionHeight + spaceBetweenGraphAndDescription
    );

    if (!source.textContent) return;
    //  adds source below diagram
    // eslint-disable-next-line no-unused-vars
    const sourceSVGText = new SvgText({
      text: source.textContent,
      element: svg,
      maxWidth: svg.clientWidth || 0,
      textOverflow: 'ellipsis',
      className: 'svg-text text__source',
      verticalAlign: 'bottom'
    });

    const textSource = svg.querySelector('.text__source');
    const newSourceHeight = svg.clientHeight - paddingBottom;
    this.addValuesToTransform(
      textSource,
      null,
      newSourceHeight + spaceBetweenGraphAndDescription
    );
  }

  getUrlToTab(tab) {
    return this.context.linkTo(
      '/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName',
      {
        cardName: this.props.card.name,
        cardsPageName: this.props.cardsPageName,
        tabName: tab.urlName
      }
    );
  }

  onTabLinkClick(tab) {
    switch (tab.name) {
      case 'chronological':
        this.props.dispatch(trackCronologicalTabOpen());
        break;
      case 'benchmark':
        this.props.dispatch(trackBenchmarkTabOpen());
        break;
      default:
        break;
    }
  }

  getHeaderGroupForQuery(query) {
    const { headerGroups } = this.props;
    return findHeaderGroupForQuery(query, headerGroups);
  }

  handleFilterChange(newQuery) {
    const newQ = this.getUrlForQuery(newQuery);
    return this.context.navigate(this.getUrlForQuery(newQuery), {
      replace: true,
      keepScrollPosition: true
    });
  }

  getChartKind() {
    const { activeTab } = this.props;
    const { chartViewMode } = this.state;
    return chartViewMode === 'table' ? 'table' : activeTab.chartKind;
  }

  getUrlForQuery(query) {
    const { card, region, cardsPageName, activeTab } = this.props;

    const params = {
      region: region.prefixedCode,
      cardName: card.name,
      cardsPageName: cardsPageName,
      tabName: activeTab.urlName,
      query: `@${UrlQuery.stringify(query)}`
    };
    return this.context.linkTo(
      '/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName/:query',
      params
    );
  }

  getShareUrl() {
    const { query } = this.props;
    const protocol = window.location.protocol;
    const host = window.location.host;
    const path = this.getUrlForQuery(query);
    return `${protocol}//${host}${path}`;
  }

  takeScreenshot(svg) {
    const config = {
      filename: 'imdi-diagram'
    };

    d3_save_svg.save(svg, config); // eslint-disable-line
  }

  setExplicitView(event) {
    this.moveElementsIntoSVG();
    this.setState({ explicitView: true });
  }

  render() {
    const {
      loading,
      card,
      activeTab,
      query,
      queryResult,
      region,
      headerGroups,
      printable,
      description
    } = this.props;
    const { chartViewMode } = this.state;
    const explicitView = true;
    if (!activeTab) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded">
          <i className="loading-indicator" />
          Laster…
        </div>
      );
    }

    // headerGroup links query from cardPages.json to the actual data that will be shown.
    const headerGroup = this.getHeaderGroupForQuery(query);

    const disabledTabs = [];
    if (headerGroup.aar.length < 2) {
      disabledTabs.push('chronological');
    }

    const chartKind = this.getChartKind();

    const chart = CHARTS[chartKind];
    const ChartComponent = chart.component;
    const showExternalLinkBosatte = this.props.card.name == 'bosatt_anmodede'; // TODO: Needs to be dynamic

    if (!ChartComponent) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded">
          Error: No chart component for {JSON.stringify(chartKind)}
        </div>
      );
    }

    const data = queryResultPresenter(query, queryResult, {
      chartKind: chartKind,
      dimensions: card.config.dimensions
    });

    if (chart.name == 'benchmark') {
      data.highlight = {
        dimensionName: 'region',
        value: [region.prefixedCode]
      };
    }

    // if the user is watching the "over tid" tab in the card "befolkning opprinnelsesland", we should by default compare the region to itself.
    if (
      card.name === 'befolkning_opprinnelsesland' &&
      activeTab.chartKind === 'line' &&
      !query.comparisonRegions.length
    ) {
      query.comparisonRegions[0] = region.prefixedCode;
    }

    return (
      <section
        data-card
        className="toggle-list__section toggle-list__section--expanded"
        aria-hidden="false"
        style={{ display: 'block' }}
        ref={toggleList => {
          this.toggleList = toggleList;
        }}
        crossOrigin="anonymous"
      >
        {!printable && (
          <TabBar
            activeTab={activeTab}
            disabledTabs={disabledTabs}
            region={region}
            tabs={TABS}
            handleTabLinkClick={this.onTabLinkClick.bind(this)}
            makeLinkToTab={tab => this.getUrlToTab(tab)}
          />
        )}

        {!printable && (
          <FilterBarContainer
            query={query}
            region={region}
            card={card}
            headerGroups={headerGroups}
            tab={activeTab}
            chart={CHARTS[activeTab.chartKind]}
            config={card.config}
            onChange={this.handleFilterChange.bind(this)}
          />
        )}

        {loading && (
          <span>
            <i className="loading-indicator" /> Laster…
          </span>
        )}

        {!printable && (
          <ChartViewModeSelect
            activeTab={activeTab}
            embedded={false}
            setExplicitView={this.setExplicitView}
            explicitView={explicitView}
            mode={chartViewMode}
            onChange={newMode => this.setState({ chartViewMode: newMode })}
          />
        )}

        <div className="graph">
          {data && (
            <ChartComponent
              data={data}
              explicitView={explicitView}
              activeTab={activeTab}
              title={card.title}
              source={card.metadata.source}
              measuredAt={card.metadata.measuredAt}
              printView={this.state.printView}
              thisCard={this}
              description={description}
              sortDirection={chartKind === 'benchmark' && 'ascending'}
            />
          )}
        </div>

        <div data-chart-description className="graph__description">
          {description}
        </div>

        <div className="graph__actions">
          {!printable && (
            <div className="graph__functions">
              <DownloadWidget
                downloadScreenshot={this.takeScreenshot}
                downloadPNG={this.downloadPNG}
                region={region}
                query={query}
                headerGroups={headerGroups}
                chartKind={chartKind}
                setExplicitView={isExplicit =>
                  this.setState({ explicitView: isExplicit })
                }
              />
            </div>
          )}

          {!printable && (
            <CardMetadata
              dimensions={query.dimensions}
              metadata={card.metadata}
            />
          )}
        </div>
      </section>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const cardState = (state.cardState[ownProps.region.prefixedCode] || {})[
    ownProps.card.name
  ];
  if (!cardState || cardState.initializing) {
    return { loading: true };
  }
  const { region, card } = ownProps;
  // Find query from cardState.tabs[activeTab.name]
  const { activeTab, tabs } = cardState;

  const tabState = tabs[activeTab.name];

  if (tabState.initializing) {
    return { loading: true };
  }

  const cardsPage = state.allCardsPages.find(
    cp => cp.name === ownProps.cardsPageName
  );

  const { loading, query, queryResult, headerGroups } = tabState;

  const { allRegions } = state;
  const regionHeaderKey = getHeaderKey(region);
  const headerGroup = headerGroups.find(group => {
    return (
      group.hasOwnProperty(regionHeaderKey) &&
      query.dimensions.every(dim => group.hasOwnProperty(dim.name))
    );
  });

  const graphDescription = describeChart(
    queryToOptions(query, card, headerGroup, allRegions)
  );

  return {
    loading,
    cardsPage,
    region: state.currentRegion,
    activeTab,
    headerGroups,
    allRegions: state.allRegions,
    queryResult: queryResult,
    query,
    description: graphDescription
  };
}

export default connect(mapStateToProps)(Card);
