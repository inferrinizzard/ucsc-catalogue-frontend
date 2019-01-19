import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Course } from '../models/course.model';

export interface SelectMenuProps {
  sort: (type: keyof Course) => void;
  sortKey: keyof Course;
}
export interface SelectMenuState {
  open: boolean;
}

const keyNameMap: { [K in keyof Course]?: string } = {
  name: 'Course Name',
  capacity: 'Capacity',
  type: 'Type',
};

class SelectMenu extends React.Component<SelectMenuProps, SelectMenuState> {
  handleOpen = () => {
    this.setState({ ...this.state, open: true });
  };
  handleClose = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    key: keyof Course
  ) => {
    this.props.sort(key);
    this.setState({ ...this.state, open: false });
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
            {
              //<ListItemText primary={options[this.state.selectedIndex]} />}
            }
          </ListItem>
        </List>
        {this.props.sortKey}
        <Menu open={this.state.open}>
          {(Object.keys(keyNameMap) as (keyof Course)[]).map((key, index) => (
            <MenuItem
              key={key}
              selected={key === this.props.sortKey}
              onClick={event => this.handleClose(event, key)}
            >
              {keyNameMap[key]} {key}
            </MenuItem>
          ))}
          {/*}
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index == this.state.selectedIndex}
              onClick={event => this.handleClose(event, index)}
            >
              {option}
            </MenuItem>
          ))}*/}
        </Menu>
      </React.Fragment>
    );
  }
}

export default SelectMenu;
