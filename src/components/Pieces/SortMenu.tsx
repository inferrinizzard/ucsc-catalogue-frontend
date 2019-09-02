import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RootRef from '@material-ui/core/RootRef';
import { CourseType } from '../../store/course';

export interface SelectMenuProps {
  sort: (type: CourseType) => void;
  sortKey: CourseType;
}
export interface SelectMenuState {
  anchor: HTMLElement | null;
  widthRef: React.RefObject<HTMLElement>;
  width: number;
}

const keyNameMap: { [K in CourseType]?: string } = {
  subjectCode: 'Course Name',
  capacity: 'Capacity (WIP)',
  type: 'Class Type',
};

class SelectMenu extends React.Component<SelectMenuProps, SelectMenuState> {
  state = {
    anchor: null,
    widthRef: React.createRef<HTMLElement>(),
    width: 0,
  };

  componentDidMount() {
    this.setState({ width: this.state.widthRef.current!.offsetWidth });
  }

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
              onClick={e => this.setState({ anchor: e.currentTarget })}
              style={{ padding: '8px' }}
            >
              <ListItemText
                primary={
                  keyNameMap[this.props.sortKey]
                    ? keyNameMap[this.props.sortKey]
                    : 'Course Name'
                }
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
          onBackdropClick={e => {
            this.props.sort(this.props.sortKey);
            this.setState({ anchor: null });
          }}
          PaperProps={{
            style: {
              width: this.state.width !== 0 ? this.state.width : 'auto',
            },
          }}
        >
          {(Object.keys(keyNameMap) as (CourseType)[]).map(key => (
            <MenuItem
              key={key}
              selected={key === this.props.sortKey}
              onClick={e => {
                if (key !== this.props.sortKey) this.props.sort(key);
                this.setState({ anchor: null });
              }}
            >
              {keyNameMap[key]}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

export default SelectMenu;
