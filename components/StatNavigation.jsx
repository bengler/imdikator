const React = require("react");

var Menu = require('react-menu');
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




    console.info(this.props.groupData)

    return (
      <div className='navigation'>
        {
          this.props.groupData.map((group)=> {
            return <Menu className='myMenu'>
              <MenuTrigger>
                {group.title}
              </MenuTrigger>
              <MenuOptions>

                { this.getOptions(group.items) }

              </MenuOptions>
              {

                // <MenuOption onSelect={this.someHandler}>
                //   2nd Option
                // </MenuOption>

                // <div className='a-non-interactive-menu-item'>
                //   non-selectable item
                // </div>

                // <MenuOption disabled={true} onDisabledSelect={this.otherHanlder}>
                //   diabled option
                // </MenuOption>
              }
            </Menu>
          })
        }
      </div>

    )
  }
});
