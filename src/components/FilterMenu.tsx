import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';

export interface FilterMenuProps {
  // filters: string[];
}
export interface FilterMenuState {
  name: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: string[];
  activeFilters: string[];
}

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  state = {
    name: 'Letter',
    anchorEl: null,
    open: false,
    filters: ['test'],
    activeFilters: ['A', 'B', 'C', 'D'],
  };

  handleRemoveActiveFilter = (activeFilter: string) => {
    this.setState({
      ...this.state,
      activeFilters: this.state.activeFilters.filter(c => c !== activeFilter),
    });
  };

  handleAddActiveFilter = (filter: string) => {
    this.setState({
      ...this.state,
      activeFilters: this.state.activeFilters.concat([filter]),
    });
    this.handleClose();
  };

  handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ ...this.state, anchorEl: event.currentTarget, open: true });
  };

  handleClose = () => {
    this.setState({ ...this.state, anchorEl: null, open: false });
  };

  render() {
    return (
      <React.Fragment>
        <Button
          aria-owns={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          onClick={event => this.handleClick(event)}
        >
          {this.state.name}
        </Button>
        <Menu
          id="fade-menu"
          open={this.state.open}
          onClose={this.handleClose}
          anchorEl={this.state.anchorEl}
          TransitionComponent={Fade}
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
              key={activeFilter}
              label={activeFilter}
              onDelete={event => this.handleRemoveActiveFilter(activeFilter)}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
