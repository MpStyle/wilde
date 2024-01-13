# Wilde

__!!!WORK IN PROGRESS PROJECT!!!__

![Wilde logo](docs/images/wilde-logo.png)

Wilde is a web integrated local desktop environment. \
Last version of Wilde is deployed [here](https://mpstyle.github.io/wilde/);

![Wilde screenshot](docs/images/wilde-instance.png)

## About logo

**Font**: antre \
**Colors**: from left to right, #3D44FF and #6CB5FF.

## Libraries

Wilde uses:
- [React](https://react.dev/): for UI
- [Redux Toolkit](https://redux-toolkit.js.org/): for app state
- [MUI](https://mui.com/): for UI component
- [vscode-icons](https://github.com/vscode-icons/vscode-icons): for icons files

## Techniques:
- [Lazy loading](https://en.wikipedia.org/wiki/Lazy_loading): used to load into the app state only the folders opened by the user.
- [Windowing](https://www.patterns.dev/vanilla/virtual-lists/): used to render only the visible tree items in the DOM

## TODO list (not in priority order):
- Color highlight on monaco editor
- Add capability to resize sidebar
- Add capability to open a file
- Add shortcut open a folder
- Add shortcut open a file
- Add confimation dialog when try to close an modified editor
- Add hamburger menu to use as window menu
- Add git color highlight on filenames
- Add search in project
- Add search in file
- Add replace in project
- Add replace in file
- Load custom shortcut from local storage or IndexDB
- Add check to verify compatibility of browser
- Load theme using system preference
- Load custom theme from local storage or IndexDB
- Add welcome editor