import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RootRef from '@material-ui/core/RootRef';
import { CourseType } from '../../store/course';
import { Term } from '../../models/course.model';

export interface QuarterMenuProps {
  changeQuarter: (n: number) => void;
}
export interface QuarterMenuState {
  anchor: HTMLElement | null;
  widthRef: React.RefObject<HTMLElement>;
  width: number;
  active: string;
}

const quarters: Term[] = [
  // { name: 'Summer Quarter 2019', code: 2194 },
  { name: 'Spring Quarter 2019', code: 2192 },
  { name: 'Winter Quarter 2019', code: 2190 },
  { name: 'Fall Quarter 2018', code: 2188 },
  { name: 'Summer Quarter 2018', code: 2184 },
  { name: 'Spring Quarter 2018', code: 2182 },
  { name: 'Winter Quarter 2018', code: 2180 },
  { name: 'Fall Quarter 2017', code: 2178 },
  { name: 'Summer Quarter 2017', code: 2174 },
  { name: 'Spring Quarter 2017', code: 2172 },
  { name: 'Winter Quarter 2017', code: 2170 },
  { name: 'Fall Quarter 2016', code: 2168 },
  { name: 'Summer Quarter 2016', code: 2164 },
  { name: 'Spring Quarter 2016', code: 2162 },
  { name: 'Winter Quarter 2016', code: 2160 },
  { name: 'Fall Quarter 2015', code: 2158 },
  { name: 'Summer Quarter 2015', code: 2154 },
  { name: 'Spring Quarter 2015', code: 2152 },
  { name: 'Winter Quarter 2015', code: 2150 },
  { name: 'Fall Quarter 2014', code: 2148 },
  { name: 'Summer Quarter 2014', code: 2144 },
  { name: 'Spring Quarter 2014', code: 2142 },
  { name: 'Winter Quarter 2014', code: 2140 },
  { name: 'Fall Quarter 2013', code: 2138 },
  { name: 'Summer Quarter 2013', code: 2134 },
  { name: 'Spring Quarter 2013', code: 2132 },
  { name: 'Winter Quarter 2013', code: 2130 },
  { name: 'Fall Quarter 2012', code: 2128 },
  { name: 'Summer Quarter 2012', code: 2124 },
  { name: 'Spring Quarter 2012', code: 2122 },
  { name: 'Winter Quarter 2012', code: 2120 },
  { name: 'Fall Quarter 2011', code: 2118 },
  { name: 'Summer Quarter 2011', code: 2114 },
  { name: 'Spring Quarter 2011', code: 2112 },
  { name: 'Winter Quarter 2011', code: 2110 },
  { name: 'Fall Quarter 2010', code: 2108 },
  { name: 'Summer Quarter 2010', code: 2104 },
  { name: 'Spring Quarter 2010', code: 2102 },
  { name: 'Winter Quarter 2010', code: 2100 },
  { name: 'Fall Quarter 2009', code: 2098 },
  { name: 'Summer Quarter 2009', code: 2094 },
  { name: 'Spring Quarter 2009', code: 2092 },
  { name: 'Winter Quarter 2009', code: 2090 },
  { name: 'Fall Quarter 2008', code: 2088 },
  { name: 'Summer Quarter 2008', code: 2084 },
  { name: 'Spring Quarter 2008', code: 2082 },
  { name: 'Winter Quarter 2008', code: 2080 },
  { name: 'Fall Quarter 2007', code: 2078 },
  { name: 'Summer Quarter 2007', code: 2074 },
  { name: 'Spring Quarter 2007', code: 2072 },
  { name: 'Winter Quarter 2007', code: 2070 },
  { name: 'Fall Quarter 2006', code: 2068 },
  { name: 'Summer Quarter 2006', code: 2064 },
  { name: 'Spring Quarter 2006', code: 2062 },
  { name: 'Winter Quarter 2006', code: 2060 },
  { name: 'Fall Quarter 2005', code: 2058 },
  { name: 'Summer Quarter 2005', code: 2054 },
  { name: 'Spring Quarter 2005', code: 2052 },
  { name: 'Winter Quarter 2005', code: 2050 },
  { name: 'Fall Quarter 2004', code: 2048 },
];

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
    t: Term
  ) {
    this.props.changeQuarter(t.code);
    this.setState({
      active: t.name,
    });
    this.handleClose(event);
  }

  state = {
    anchor: null,
    widthRef: React.createRef<HTMLElement>(),
    width: 0,
    active: quarters[0].name,
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
          {quarters.map((t, index) => (
            <MenuItem
              key={index}
              selected={t.name === this.state.active}
              onClick={event => this.changeQuarterAndClose(event, t)}
            >
              {t.name}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

export default QuarterMenu;
