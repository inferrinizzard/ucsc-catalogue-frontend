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
  'Spring Quarter 2018': 2182,
  'Winter Quarter 2018': 2180,
  'Fall Quarter 2017': 2178,
  'Summer Quarter 2017': 2174,
  'Spring Quarter 2017': 2172,
  'Winter Quarter 2017': 2170,
  'Fall Quarter 2016': 2168,
  'Summer Quarter 2016': 2164,
  'Spring Quarter 2016': 2162,
  'Winter Quarter 2016': 2160,
  'Fall Quarter 2015': 2158,
  'Summer Quarter 2015': 2154,
  'Spring Quarter 2015': 2152,
  'Winter Quarter 2015': 2150,
  'Fall Quarter 2014': 2148,
  'Summer Quarter 2014': 2144,
  'Spring Quarter 2014': 2142,
  'Winter Quarter 2014': 2140,
  'Fall Quarter 2013': 2138,
  'Summer Quarter 2013': 2134,
  'Spring Quarter 2013': 2132,
  'Winter Quarter 2013': 2130,
  'Fall Quarter 2012': 2128,
  'Summer Quarter 2012': 2124,
  'Spring Quarter 2012': 2122,
  'Winter Quarter 2012': 2120,
  'Fall Quarter 2011': 2118,
  'Summer Quarter 2011': 2114,
  'Spring Quarter 2011': 2112,
  'Winter Quarter 2011': 2110,
  // 'Fall Quarter 2010': 2108,
  // 'Summer Quarter 2010': 2104,
  // 'Spring Quarter 2010': 2102,
  // 'Winter Quarter 2010': 2100,
  // 'Fall Quarter 2009': 2098,
  // 'Summer Quarter 2009': 2094,
  // 'Spring Quarter 2009': 2092,
  // 'Winter Quarter 2009': 2090,
  // 'Fall Quarter 2008': 2088,
  // 'Summer Quarter 2008': 2084,
  // 'Spring Quarter 2008': 2082,
  // 'Winter Quarter 2008': 2080,
  // 'Fall Quarter 2007': 2078,
  // 'Summer Quarter 2007': 2074,
  // 'Spring Quarter 2007': 2072,
  // 'Winter Quarter 2007': 2070,
  // 'Fall Quarter 2006': 2068,
  // 'Summer Quarter 2006': 2064,
  // 'Spring Quarter 2006': 2062,
  // 'Winter Quarter 2006': 2060,
  // 'Fall Quarter 2005': 2058,
  // 'Summer Quarter 2005': 2054,
  // 'Spring Quarter 2005': 2052,
  // 'Winter Quarter 2005': 2050,
  // 'Fall Quarter 2004': 2048,
};

class QuarterMenu extends React.Component<QuarterMenuProps, QuarterMenuState> {
  handleOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ anchor: event.currentTarget });
  };
  handleClose = (
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.SyntheticEvent<{}, Event>
  ) => {
    this.setState({ anchor: null });
  };
  changeQuarterAndClose(
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.SyntheticEvent<{}, Event>,
    q: string
  ) {
    this.props.changeQuarter(quarters[q]);
    this.setState({
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
