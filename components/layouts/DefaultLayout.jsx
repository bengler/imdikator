import React from 'react'

/**
 * Only for development
 */
export default class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge"/>
        <title>IMDI Testbed</title>
        <link rel="stylesheet" href="/build/stylesheets/main.css"/>
        <link rel="icon" type="image/x-icon" href="/_themes/design/img/favicon.ico"/>
      </head>
      <body>
      <header id="header" className="header" data-toggle-menu="header--overlay" data-toggle-search="header--search">
        <div className="wrapper">
          <div className="row">
            <div className="col--main-wide header__row">
              <a href="/" className="ident header__ident">
                <div className="ident__symbol"/>
                <div className="ident__textmark">
                  <span className="ident__textmark-primary">IMDi</span>

                  <p className="ident__textmark-secondary">Integrerings- og <br />mangfoldsdirektoratet</p>
                </div>
              </a>
              <a href="#footer" data-behaviour="main-menu-toggle" className="button header__button header__button--menu"
                 aria-expanded="false"><span className="header__button-text--open">Meny</span><span
                className="header__button-text--close">Lukk</span> <i className="header__menu-icon"><span
                className="header__menu-icon-bar"/><span className="header__menu-icon-bar"/><span
                className="header__menu-icon-bar"/></i></a>
              <a href="#footer-search" data-behaviour="main-search-toggle"
                 className="button header__button header__button--search" aria-expanded="false"><span
                className="header__button-text">Søk</span> <i className="icon__search header__search-icon"/></a>

              <div className="header__search">
                <div className="search search--header">
                  <form action="/sok" method="get" role="search">
                    <label htmlFor="header-search" className="t-only-screenreaders">Søk nettstedet</label>
                    <input id="header-search" className="input search__input" type="text" name="query" defaultValue
                           placeholder="Søk nettstedet"/>
                    <button id="header-search-button" type="submit" className="button search__button">Søk <i
                      className="icon__search search__button-icon"/></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div id="page-content" className="page__master">
        <main className="wrapper page">
          <div data-imdikator="site"/>
        </main>
      </div>
      <footer id="footer" className="footer" tabIndex={-1} data-toggle-menu="footer--overlay">
        <div className="wrapper">
          <div className="row">
            <div className="col--main-wide">
              <div id="footer__bg" className="footer__bg">
                <div className="footer__row">
                  <div className="footer__main">
                    <nav role="navigation" className="navigation navigation--footer">
                      <h2 className="t-only-screenreaders">Hovedmeny</h2>
                      <ul className="t-no-list-styles">
                        <li><a href="/planlegging-og-bosetting" className="navigation__link navigation__link--primary">Planlegging
                          og bosetting</a></li>
                        <li><a href="/opplaering-og-utdanning" className="navigation__link navigation__link--primary">Opplæring
                          og utdanning</a></li>
                        <li><a href="/sysselsetting-og-arbeidsliv"
                               className="navigation__link navigation__link--primary">Sysselsetting og arbeidsliv</a>
                        </li>
                        <li><a href="/fakta-om-integrering" className="navigation__link navigation__link--primary">Om
                          integrering i Norge</a></li>
                        <li><a href="/tilskudd" className="navigation__link navigation__link--primary">Tilskudd</a></li>
                        <li><a href="/om-oss" className="navigation__link navigation__link--primary">Om IMDi</a></li>
                      </ul>
                    </nav>
                  </div>
                  <div className="footer__global">
                    <div className="footer__search">
                      <form action="/sok" method="get" role="search">
                        <h2 className="t-only-screenreaders">Søk</h2>
                        <label htmlFor="footer-search" className="t-only-screenreaders">Søk nettstedet</label>

                        <div className="search search--footer">
                          <input id="footer-search" className="input search__input" type="text" name="query"
                                 defaultValue placeholder="Søk nettstedet"/>
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
                          <li><a href="/om-oss/kontakt-oss" className="navigation__link">Kontakt oss</a></li>
                          <li><a href="/om-oss/arrangementer" className="navigation__link">Kurs og arrangementer</a>
                          </li>
                          <li><a href="/om-oss/rapporter" className="navigation__link">Rapporter</a></li>
                          <li><a href="#" className="navigation__link">Ledige stillinger</a></li>
                          <li><a href="#" className="navigation__link">Ord og begreper</a></li>
                        </ul>
                      </div>
                      <div className="footer__submenu">
                        <h2 className="t-only-screenreaders">Portaler</h2>
                        <ul className="t-no-list-styles footer__submenu">
                          <li><a href="#" className="navigation__link">Ny i Norge <i
                            className="icon__external icon--white navigation__link-icon"><span
                            className="t-only-screenreaders">(ekstern lenke)</span></i></a></li>
                          <li><a href="#" className="navigation__link">Tolkeportalen <i
                            className="icon__external icon--white navigation__link-icon"><span
                            className="t-only-screenreaders">(ekstern lenke)</span></i></a></li>
                          <li><a href="#" className="navigation__link">Mangfoldsportalen <i
                            className="icon__external icon--white navigation__link-icon"><span
                            className="t-only-screenreaders">(ekstern lenke)</span></i></a></li>
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
      <script src="/build/js/bundles/main.js" async defer/>
      </body>
      </html>
    )
  }
}
