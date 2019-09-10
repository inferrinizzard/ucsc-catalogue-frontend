import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import { Filter, CourseType } from '../../store/course';

export interface FilterMenuProps {
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  category: CourseType;
  activeFilters: Filter[];
  filterList: string[];
  toolTips: string[];
}
export interface FilterMenuState {
  anchor: HTMLElement | null;
}

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  state = {
    anchor: null,
  };

  ITEM_HEIGHT = 48;

  render() {
    return (
      <React.Fragment>
        <Button
          fullWidth
          aria-owns={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          onClick={e => this.setState({ anchor: e.currentTarget })}
        >
          {this.props.category}
        </Button>
        <Menu
          id="fade-menu"
          open={Boolean(this.state.anchor)}
          anchorEl={this.state.anchor}
          TransitionComponent={Fade}
          onBackdropClick={e => this.setState({ anchor: null })}
          PaperProps={{
            style: {
              maxHeight: this.ITEM_HEIGHT * 7.5,
            },
          }}
        >
          {this.props.filterList
            // filter out active elements
            .filter(f => !this.props.activeFilters.map(x => x.name).includes(f))
            .map((f, k) => (
              <Tooltip
                key={k}
                title={this.props.toolTips[this.props.filterList.indexOf(f)]}
                placement="right"
              >
                <MenuItem
                  onClick={e => {
                    this.props.addFilter({
                      type: this.props.category,
                      name: f,
                    });
                    this.setState({ anchor: null });
                  }}
                >
                  {f}
                </MenuItem>
              </Tooltip>
            ))}
        </Menu>
        <div style={{ maxWidth: '210px' }}>
          {this.props.activeFilters.map(af => (
            <Chip
              key={af.name}
              label={af.name}
              onDelete={e => this.props.removeFilter(af)}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
