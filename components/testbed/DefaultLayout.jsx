import React, {Component, PropTypes} from 'react'

/**
 * Only for development
 */
export default class DefaultLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    extraHead: PropTypes.node
  }
  render() {
    const {children, extraHead} = this.props
    return (
      <html>
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge"/>
        <title>IMDI Testbed</title>
        <link rel="stylesheet" href="/build/stylesheets/main.css"/>
        <link rel="icon" type="image/x-icon" href="/_themes/design/img/favicon.ico"/>
        {extraHead}
      </head>
      <body>
        <svg height="0" width="0" className="t-only-screenreaders">
          <defs>
            <clipPath id="clip-diamond" clipPathUnits="objectBoundingBox">
              <polygon points="0.5 0, 1 0.5, 0.5 1, 0 0.5" />
            </clipPath>
            <clipPath id="clip-feature-image" clipPathUnits="objectBoundingBox">
              <polygon points="0.2 0, 1 0, 1 1, 0 1" />
            </clipPath>
          </defs>
        </svg>
        <header className="header" data-toggle-menu="header--overlay" data-toggle-search="header--search">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide header__row">
                <a href="http://imdi-no.protolife.no/" className="ident header__ident">
                  <div className="ident__symbol">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212">
                      <switch>
                        <g>
                          <polygon className="ident__triangle" fill="#F05641" points="87,0 0,87 87,87 " />
                          <polygon fill="#0DAC4B" points="105,105 105,192 192,105 " />
                          <polygon fill="#5CBA5B" points="18,105 105,192 105,105 " />
                          <polygon fill="#FFD666" points="192,105 192,105 105,18 105,105 " />
                        </g>
                        <foreignObject>
                          <img alt="" height="128" width="128"
                            src={
                              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABfCAMAAAC5kuvHAAAAMFBMVEX///8d'
                              + 'rkvwVUFau1v+1mYdrkvwVUEvsVB5uFAdrkstsU9au1twt1B3ulLwVUH+1mazBh7uAAAACXRSTlMAEBCgoNDQ3NwID'
                              + 'yB5AAABUUlEQVR4Ae3Nu1HEYBgEQQHHgwWk/LPFlKOi/7qtD+smgJ5tqee3rcn8Pszvw/w+zO/D/D7M78P8Psuf/m'
                              + '2EP/3jNsKfPgZ38qfvwTp/5XOwzl/7Hqzz174H6/y17wH5P3wPzMPHgDx8DMjDx4A8fAzIw8eAPHwMyMPHgLx8DMTTxw'
                              + 'C8fQzA28cAvH0MwNvHALx9DMDbxwC8fQzI2/fAvH0PzNv3ADx8D8DD90A8fA/Ws98PjuHBMTw4hgfH8OAYHhxDA/gevHw'
                              + 't9fO90sd27yCfC70+bR7AB88BfPAcwAfPAXzwxSAV70HMV4OQ7wYRXw4Cvh0EfDsI+HYQ8O0g4NtBwLeDgG8HAd8OAr4d'
                              + 'BHw7CPh2EPDtIODbQcC3g4BvBwHfDgK+HQR8Owj4dhDw7SDg20HAt4OAbwcB3w4Cvh0EfDsI+HYQ8O3gHfz/9ejRo1+OV'
                              + 'ZGj1UP9lQAAAABJRU5ErkJggg=='
                            }
                          />
                        </foreignObject>
                      </switch>
                    </svg>
                  </div>
                  <span className="ident__textmark">
                    <span className="ident__textmark-primary">IMDi</span>
                    <span className="ident__textmark-secondary">Integrerings- og <br />mangfoldsdirektoratet</span>
                  </span>
                </a>
                <a href="#footer" data-behaviour="main-menu-toggle" className="button header__button header__button--menu"
                  aria-expanded="false"><span className="header__button-text--open">Meny</span>
                  <span className="header__button-text--close">Lukk</span>
                  <i className="header__menu-icon">
                    <span className="header__menu-icon-bar"/>
                    <span className="header__menu-icon-bar"/>
                    <span className="header__menu-icon-bar"/>
                  </i>
                </a>
                <a href="#footer-search" data-behaviour="main-search-toggle"
                  className="button header__button header__button--search" aria-expanded="false">
                  <span className="header__button-text">Søk</span> <i className="icon__search header__search-icon"/>
                </a>
                <div className="header__search">
                  <div className="search search--header">
                    <form action="/sok" method="get" role="search">
                      <label htmlFor="header-search" className="t-only-screenreaders">Søk nettstedet</label>
                      <input className="input search__input" type="text" name="query" defaultValue
                        placeholder="Søk nettstedet"/>
                      <button type="submit" className="button search__button">Søk <i
                        className="icon__search search__button-icon"/></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="page__master">
          {children}
        </div>
        <footer className="footer" tabIndex={-1} data-toggle-menu="footer--overlay">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <div className="footer__bg">
                  <div className="footer__row">
                    <div className="footer__main">
                      <nav role="navigation" className="navigation navigation--footer">
                        <h2 className="t-only-screenreaders">Hovedmeny</h2>
                        <ul className="t-no-list-styles">
                          <li>
                            <a
                              href="http://imdi-no.protolife.no/planlegging-og-bosetting"
                              className="navigation__link navigation__link--primary">
                              Planlegging og bosetting</a></li>
                          <li>
                            <a
                              href="http://imdi-no.protolife.no/opplaering-og-utdanning"
                              className="navigation__link navigation__link--primary">
                              Opplæring og utdanning</a></li>
                          <li>
                            <a href="http://imdi-no.protolife.no/sysselsetting-og-arbeidsliv" className="navigation__link navigation__link--primary">
                              Sysselsetting og arbeidsliv
                            </a>
                          </li>
                          <li><a href="http://imdi-no.protolife.no/fakta-om-integrering" className="navigation__link navigation__link--primary">Om
                            integrering i Norge</a></li>
                          <li><a href="http://imdi-no.protolife.no/tilskudd" className="navigation__link navigation__link--primary">Tilskudd</a></li>
                          <li><a href="http://imdi-no.protolife.no/om-oss" className="navigation__link navigation__link--primary">Om IMDi</a></li>
                        </ul>
                      </nav>
                    </div>
                    <div className="footer__global">
                      <div className="footer__search">
                        <form action="/sok" method="get" role="search">
                          <h2 className="t-only-screenreaders">Søk</h2>
                          <label htmlFor="footer-search" className="t-only-screenreaders">Søk nettstedet</label>

                          <div className="search search--footer">
                            <input className="input search__input" type="text" name="query" placeholder="Søk nettstedet"/>
                            <button type="submit" className="button search__button"><i
                              className="icon__search icon--white"/><span className="t-only-screenreaders">Søk</span>
                            </button>
                          </div>
                        </form>
                      </div>
                      <nav role="navigation" className="navigation navigation--footer footer__submenues">
                        <h2 className="t-only-screenreaders">Global meny</h2>

                        <div className="footer__submenu">
                          <ul className="t-no-list-styles">
                            <li><a href="http://imdi-no.protolife.no/om-oss/kontakt-oss" className="navigation__link">Kontakt oss</a></li>
                            <li><a href="http://imdi-no.protolife.no/om-oss/arrangementer" className="navigation__link">Kurs og arrangementer</a>
                            </li>
                            <li><a href="http://imdi-no.protolife.no/om-oss/rapporter" className="navigation__link">Rapporter</a></li>
                            <li><a href="http://imdi-no.protolife.no" className="navigation__link">Ledige stillinger</a></li>
                            <li><a href="http://imdi-no.protolife.no" className="navigation__link">Ord og begreper</a></li>
                          </ul>
                        </div>
                        <div className="footer__submenu">
                          <h2 className="t-only-screenreaders">Portaler</h2>
                          <ul className="t-no-list-styles footer__submenu">
                            <li><a href="http://imdi-no.protolife.no" className="navigation__link">Ny i Norge <i
                              className="icon__external icon--white navigation__link-icon">
                              <span className="t-only-screenreaders">(ekstern lenke)</span></i></a></li>
                            <li><a href="http://imdi-no.protolife.no" className="navigation__link">Tolkeportalen
                              <i className="icon__external icon--white navigation__link-icon">
                              <span className="t-only-screenreaders">(ekstern lenke)</span></i></a></li>
                            <li><a href="http://imdi-no.protolife.no" className="navigation__link">Mangfoldsportalen
                              <i className="icon__external icon--white navigation__link-icon">
                              <span className="t-only-screenreaders">(ekstern lenke)</span></i></a></li>
                          </ul>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
      </html>
    )
  }
}
