import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import RootRef from '@material-ui/core/RootRef';
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

  addFilterAndClose = (filt: Filter) => {
    this.props.addFilter(filt);
    this.handleClose();
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
              maxHeight: this.ITEM_HEIGHT * 7.5,
              width: this.state.width !== 0 ? this.state.width : 'auto',
            },
          }}
        >
          {this.props.filterList
            // filter out active elements
            .filter(f => {
              if (this.props.activeFilters.map(x => x.name).includes(f)) {
                return false; // if it is already active, omit it
              } else {
                return true;
              }
            })
            .map((f, index) => (
              <Tooltip
                key={index}
                title={this.props.toolTips[this.props.filterList.indexOf(f)]}
                placement="right"
              >
                <MenuItem
                  onClick={event =>
                    this.addFilterAndClose({
                      type: this.props.category,
                      name: f,
                    })
                  }
                >
                  {f}
                </MenuItem>
              </Tooltip>
            ))}
        </Menu>
        <div>
          {this.props.activeFilters.map((af, index) => (
            <Chip
              key={af.name}
              label={af.name}
              onDelete={event => this.props.removeFilter(af)}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default FilterMenu;
