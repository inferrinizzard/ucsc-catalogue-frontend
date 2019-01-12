import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';

export interface FilterMenuProps {}
export interface FilterMenuState {}

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  render() {
    return (
      <React.Fragment>
        <Button>Button Name</Button>
        <Menu open={false} TransitionComponent={Fade}>
          {/* map to major list/other options in state */}
          <MenuItem>Art&Design: Games&Playable Media</MenuItem>
          <MenuItem>Spanish/Latin Amer/Latino Literature</MenuItem>
          <MenuItem>Biology: Microbiology and Development</MenuItem>
        </Menu>
        <div>
          <Chip label="Test" />
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
