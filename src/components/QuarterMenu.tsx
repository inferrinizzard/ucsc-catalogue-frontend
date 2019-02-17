import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RootRef from '@material-ui/core/RootRef';
import { CourseType } from '../store/course';
import { keyframes } from 'styled-components';

export interface QuarterMenuProps {
  changeQuarter: (n: number) => void;
}
export interface QuarterMenuState {
  anchor: HTMLElement | null;
  widthRef: React.RefObject<HTMLElement>;
  width: number;
  active: string;
}

const quarters: { [quarter: string]: number } = {
  'Winter Quarter 2019': 2190,
  'Fall Quarter 2018': 2188,
  'Summer Quarter 2018': 2184,
};

class QuarterMenu extends React.Component<QuarterMenuProps, QuarterMenuState> {
  handleOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ ...this.state, anchor: event.currentTarget });
  };
  handleClose = (
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.SyntheticEvent<{}, Event>
  ) => {
    this.setState({ ...this.state, anchor: null });
  };
  changeQuarterAndClose(
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.SyntheticEvent<{}, Event>,
    q: string
  ) {
    this.props.changeQuarter(quarters[q]);
    this.setState({
      ...this.state,
      active: q,
    });
    this.handleClose(event);
  }

  state = {
    anchor: null,
    widthRef: React.createRef<HTMLElement>(),
    width: 0,
    active: 'Winter Quarter 2019',
  };

  componentDidMount() {
    this.setState({
      ...this.state,
      width: this.state.widthRef.current!.offsetWidth,
    });
  }
  ITEM_HEIGHT = 48;

  render() {
    return (
      <React.Fragment>
        <RootRef rootRef={this.state.widthRef}>
          <List component="nav">
            <ListItem
              button
              aria-owns={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-controls="lock-menu"
              onClick={event => this.handleOpen(event)}
            >
              <ListItemText primary={this.state.active} />
            </ListItem>
          </List>
        </RootRef>
        <Menu
          id="fade-menu"
          open={Boolean(this.state.anchor)}
          anchorEl={this.state.anchor}
          TransitionComponent={Fade}
          onBackdropClick={event => this.handleClose(event)}
          PaperProps={{
            style: {
              maxHeight: this.ITEM_HEIGHT * 4.5,
              width: this.state.width !== 0 ? this.state.width : 'auto',
            },
          }}
        >
          {Object.keys(quarters).map(key => (
            <MenuItem
              key={key}
              selected={key === this.state.active}
              onClick={event => this.changeQuarterAndClose(event, key)}
            >
              {key}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

export default QuarterMenu;
