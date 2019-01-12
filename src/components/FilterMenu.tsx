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
  anchorEl: object;
  filters: string[];
  activeFilters: string[];
}

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  state = {
    anchorEl: null,
    filters: ['test'],
    activeFilters: ['chip', 'snask'],
  };

  handleRemoveActiveFilter = (index: int) => {
    this.setState({
      ...this.state,
      activeFilters: this.state.activeFilters.slice(index, 1),
    });
  };

  handleClick = () => {
    this.setState({ ...this.state, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ ...this.state, anchorEl: null });
  };

  render() {
    return (
      <React.Fragment>
        <Button
          aria-owns={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Button Name
        </Button>
        <Menu
          open={false}
          anchorEl={this.state.anchorEl}
          TransitionComponent={Fade}
        >
          {/* map to major list/other options in state */}
          {this.state.filters.map((filter, index) => {
            <MenuItem
              // onClick={this.handleCloseAndChip}
              onClick={this.handleClose}
            >
              {filter}
            </MenuItem>;
          })}
        </Menu>
        <div>
          {this.state.activeFilters.map((activeFilter, index) => {
            <Chip
              label={activeFilter}
              onDelete={event => this.handleRemoveActiveFilter(index)}
            />;
          })}
          <Chip label="Test" />
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
