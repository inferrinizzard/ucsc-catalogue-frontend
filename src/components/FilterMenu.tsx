import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import RootRef from '@material-ui/core/RootRef';

import { Course, Filter } from '../models/course.model';

export interface FilterMenuProps {
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  category: keyof Course;
  activeFilters: Filter[];
  filterList: string[];
}
export interface FilterMenuState {
  anchorEl: HTMLElement | null;
  widthRef: React.RefObject<HTMLElement>;
  width: number;
}

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  state = {
    anchorEl: null,
    widthRef: React.createRef<HTMLElement>(),
    width: 0,
  };

  handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ ...this.state, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ ...this.state, anchorEl: null });
  };

  ITEM_HEIGHT = 48;

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
          <Button
            fullWidth
            aria-owns={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            onClick={event => this.handleClick(event)}
          >
            {this.props.category}
          </Button>
        </RootRef>
        <Menu
          id="fade-menu"
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          TransitionComponent={Fade}
          onBackdropClick={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: this.ITEM_HEIGHT * 4.5,
              width: this.state.width !== 0 ? this.state.width : 'auto',
            },
          }}
        >
          {this.props.filterList.map((f, index) => (
            <MenuItem
              key={index}
              // selected={}
              onClick={event =>
                this.props.addFilter({ type: this.props.category, filter: f })
              }
            >
              {f}
            </MenuItem>
          ))}
        </Menu>
        <div>
          {this.props.activeFilters
            .filter(f => f.type === this.props.category)
            .map((af, index) => (
              <Chip
                key={af.filter}
                label={af.filter}
                onDelete={event => this.props.removeFilter(af)}
              />
            ))}
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
