import * as React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import SearchBar from './SearchBar';
import SelectMenu from './SelectMenu';
import FilterMenu from './FilterMenu';
import { Select } from '@material-ui/core';

export interface SortDrawerProps {
  sort: (type: number) => void;
	open: boolean;
	setDrawerWidth: ()=>void;
	drawerWidth: number;
}
export interface SortDrawerState {
	width: React.RefObject<HTMLElement>;
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
		width: this.props.drawerWidth;
	};
  render() {
    return (
      <Drawer open={this.props.open} variant="permanent">
        <Spacer />
        <Section>
          <SearchBar />
        </Section>
        <Section>
          <CardHeader title="Sorting" />
          <SelectMenu sort={this.props.sort} />
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
    );
  }
}

export default SortDrawer;
