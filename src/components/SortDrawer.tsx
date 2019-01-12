import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

import SearchBar from './SearchBar';
import SelectMenu from './SelectMenu';
import FilterMenu from './FilterMenu';
import { Select } from '@material-ui/core';

export interface SortDrawerProps {}
export interface SortDrawerState {}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const Section = styled(Paper)<any>`
  margin: 0.3em;
  padding: 0.2em;
`;

class SortDrawer extends React.Component<SortDrawerProps, SortDrawerState> {
  render() {
    return (
      <Drawer open={false} variant="permanent">
        <Spacer />
        <Section>
          <SearchBar />
        </Section>
        <Section>
          <SelectMenu />
        </Section>
        <Section>
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
