import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RootRef from '@material-ui/core/RootRef';
import { Course } from '../models/course.model';

export interface SelectMenuProps {
  sort: (type: keyof Course) => void;
  sortKey: keyof Course;
}
export interface SelectMenuState {
  selectedIndex: number;
  anchor: HTMLElement | null;
  widthRef: React.RefObject<HTMLElement>;
  width: number;
}

const keyNameMap: { [K in keyof Course]?: string } = {
  subjectCode: 'Course Name',
  capacity: 'Capacity',
  type: 'Type',
};

class SelectMenu extends React.Component<SelectMenuProps, SelectMenuState> {
  handleOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ ...this.state, anchor: event.currentTarget });
  };
  handleClose = (
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.SyntheticEvent<{}, Event>,
    key: keyof Course
  ) => {
    if (key !== this.props.sortKey) this.props.sort(key);
    this.setState({ ...this.state, anchor: null });
  };

  state = {
    selectedIndex: 0,
    anchor: null,
    widthRef: React.createRef<HTMLElement>(),
    width: 0,
  };

  componentDidMount() {
    this.setState({
      ...this.state,
      width: this.state.widthRef.current!.offsetWidth,
    });
  }

  render() {
    return (
      <React.Fragment>
        <RootRef rootRef={this.state.widthRef}>
          <List component="nav">
            <ListItem
              button
              aria-haspopup="true"
              aria-controls="lock-menu"
              onClick={event => this.handleOpen(event)}
            >
              <ListItemText
                primary={
                  keyNameMap[this.props.sortKey]
                    ? keyNameMap[this.props.sortKey]
                    : 'Course Name'
                }
              />
            </ListItem>
          </List>
        </RootRef>
        <Menu
          open={Boolean(this.state.anchor)}
          anchorEl={this.state.anchor}
          onBackdropClick={event => this.handleClose(event, this.props.sortKey)}
          PaperProps={{
            style: {
              width: this.state.width !== 0 ? this.state.width : 'auto',
            },
          }}
        >
          {(Object.keys(keyNameMap) as (keyof Course)[]).map((key, index) => (
            <MenuItem
              key={key}
              selected={key === this.props.sortKey}
              onClick={event => this.handleClose(event, key)}
            >
              {keyNameMap[key]}
              {/* {key} */}
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
