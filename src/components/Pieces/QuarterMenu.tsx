import * as React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';

import MenuItem from '@material-ui/core/MenuItem';

import { CourseType } from '../../store/course';
import { Term } from '../../models/course.model';
import quarterData from '../Data/quarters.json';

export interface QuarterMenuProps {
  changeQuarter: (n: number) => void;
}
export interface QuarterMenuState {
  anchor: HTMLElement | null;
  active: string;
}

const quarters: Term[] = quarterData;

class QuarterMenu extends React.Component<QuarterMenuProps, QuarterMenuState> {
  state = {
    anchor: null,
    active: quarters[0].name,
  };

  ITEM_HEIGHT = 48;

  render() {
    return (
      <React.Fragment>
        <List component="nav" style={{ padding: 0 }}>
          <ListItem
            button
            aria-owns={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={e => this.setState({ anchor: e.currentTarget })}
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
        <Menu
          id="fade-menu"
          open={Boolean(this.state.anchor)}
          anchorEl={this.state.anchor}
          TransitionComponent={Fade}
          onBackdropClick={e => this.setState({ anchor: null })}
          PaperProps={{
            style: {
              maxHeight: this.ITEM_HEIGHT * 4.5,
            },
          }}
        >
          {quarters.map(q => (
            <MenuItem
              key={q.name}
              selected={q.name === this.state.active}
              onClick={e => {
                this.props.changeQuarter(q.code);
                this.setState({
                  active: q.name,
                  anchor: null,
                });
              }}
            >
              {q.name}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

export default QuarterMenu;
