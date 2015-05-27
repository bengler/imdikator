const React = require("react");

var Menu = require('react-menu');

Menu.injectCSS();

var MenuTrigger = Menu.MenuTrigger;
var MenuOptions = Menu.MenuOptions;
var MenuOption = Menu.MenuOption;

module.exports = React.createClass({
  displayName: 'StatNavigation',

  getOptions(items) {
    return items.map((item) => {
      return (
        <MenuOption className="foo_bar">
          {item.title}
        </MenuOption>
      )
    });
  },

  render() {
    return (
      <div className='imdikator-navigation imdikator-navigation--fixed'>
        <div className="wrapper">
        {
          this.props.groupData.map((group)=> {
            return <Menu className="imdikator-navigation__menu">
              <MenuTrigger>
                {group.title}&nbsp;
                <span className="icon icon-chevron-down responsive-accordion-plus fa-fw" >
                </span>

              </MenuTrigger>
              <MenuOptions>
                { this.getOptions(group.items) }
              </MenuOptions>
            </Menu>
          })
        }
        </div>
      </div>

    )
  }
});
