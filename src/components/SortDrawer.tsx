import * as React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import RootRef from '@material-ui/core/RootRef';

import SearchBar from './SearchBar';
import SelectMenu from './SelectMenu';
import FilterMenu from './FilterMenu';
import { Course } from '../models/course.model';

export interface SortDrawerProps {
  sort: (type: keyof Course) => void;
  sortKey: keyof Course;
  open: boolean;
  setDrawerWidth: (val: number) => void;
}
export interface SortDrawerState {
  widthRef: React.RefObject<HTMLElement>;
  width: number;
}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const Section = styled(Card)<any>`
  margin: 0.3em;
  padding: 0.2em;
`;

class SortDrawer extends React.Component<SortDrawerProps, SortDrawerState> {
  state = {
    widthRef: React.createRef<HTMLElement>(),
    width: 0,
  };
  ComponentDidMount() {
    this.props.setDrawerWidth(this.state.widthRef.current!.offsetWidth);
    console.log(this.state.widthRef.current!.offsetWidth);
    console.log('cdm');
  }
  render() {
    return (
      <RootRef rootRef={this.state.widthRef}>
        <Drawer
          open={this.props.open}
          variant="permanent"
          PaperProps={{
            style: {
              padding: '0 0.25em',
            },
          }}
        >
          <Spacer />
          <Section>
            <SearchBar />
          </Section>
          <Section>
            <CardHeader title="Sorting" />
            <SelectMenu sort={this.props.sort} sortKey={this.props.sortKey} />
          </Section>
          <Section>
            <CardHeader title="Filter" />
            {/* which quarter, default to current */}
            <FilterMenu />
            <Divider />
            {/* department/major */}
            <FilterMenu />
            <Divider />
            {/* Category */}
            <FilterMenu />
            <Divider />
            {/* GE */}
            <FilterMenu />
          </Section>
        </Drawer>
      </RootRef>
    );
  }
}

export default SortDrawer;
