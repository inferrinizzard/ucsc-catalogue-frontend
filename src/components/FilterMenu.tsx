import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import RootRef from '@material-ui/core/RootRef';

import { Course, Filter } from '../models/course.model';

export interface FilterMenuProps {
  filter: (f: Filter) => void;
  category: keyof Course | string;
}
export interface FilterMenuState {
  anchorEl: HTMLElement | null;
  filters: Filter[];
  activeFilters: Filter[];
  widthRef: React.RefObject<HTMLElement>;
  width: number;
}

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  state = {
    anchorEl: null,
    filters: [],
    activeFilters: [],
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
          {this.state.filters.map((filter, index) => (
            <MenuItem
              key={filter}
              // selected={}
              onClick={event => this.handleAddActiveFilter}
            >
              {filter}
            </MenuItem>
          ))}
        </Menu>
        <div>
          {this.state.activeFilters.map((activeFilter, index) => (
            <Chip
              key={activeFilter.filter}
              label={activeFilter.filter}
              onDelete={event => this.handleRemoveActiveFilter(activeFilter)}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
