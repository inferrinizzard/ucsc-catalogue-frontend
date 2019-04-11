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
import quarterData from '../Data/quarters.json';

export interface QuarterMenuProps {
  changeQuarter: (n: number) => void;
}
export interface QuarterMenuState {
  anchor: HTMLElement | null;
  widthRef: React.RefObject<HTMLElement>;
  width: number;
  active: string;
}

const quarters: Term[] = quarterData;

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
    active: quarters[1].name,
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
          <List component="nav" style={{ padding: 0 }}>
            <ListItem
              button
              aria-owns={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-controls="lock-menu"
              onClick={event => this.handleOpen(event)}
              style={{ padding: '8px' }}
            >
              <ListItemText
                primary={this.state.active}
                style={{ padding: 0 }}
                primaryTypographyProps={{
                  style: {
                    font: 'Roboto',
                    width: '100%',
                    lineHeight: 1.75,
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    color: 'rgba(0, 0, 0, 0.87)',
                    textAlign: 'center',
                  },
                }}
              />
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
