import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export interface SelectMenuProps {
  sort: (type: number) => void;
}
export interface SelectMenuState {
  open: boolean;
  selectedIndex: number;
}

const options = [
  'Course Name',
  'Number Enrolled',
  'Grade Average',
  'Prof Rating',
];

class SelectMenu extends React.Component<SelectMenuProps, SelectMenuState> {
  handleOpen = () => {
    this.setState({ ...this.state, open: true });
  };
  handleClose = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    index: number
  ) => {
    this.setState({ open: false, selectedIndex: index });
    this.props.sort(index);
  };

  state = {
    open: false,
    selectedIndex: 0,
  };

  render() {
    return (
      <React.Fragment>
        <List component="nav">
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={this.handleOpen}
          >
            <ListItemText primary={options[this.state.selectedIndex]} />
          </ListItem>
        </List>
        <Menu open={this.state.open}>
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index == this.state.selectedIndex}
              onClick={event => this.handleClose(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

export default SelectMenu;
