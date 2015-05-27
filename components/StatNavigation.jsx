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
        <MenuOption>
          {item.title}
        </MenuOption>
      )
    });
  },

  render() {
    return (
      <div className='topNavigationFixed'>
        {
          this.props.groupData.map((group)=> {
            return <Menu className='myMenu'>
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

    )
  }
});
