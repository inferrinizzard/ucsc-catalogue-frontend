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
import { Course, Filter } from '../models/course.model';

export interface SortDrawerProps {
  sort: (type: keyof Course) => void;
  sortKey: keyof Course;
  open: boolean;
  setDrawerWidth: (val: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  activeFilters: Filter[];
}
export interface SortDrawerState {
  widthRef: React.RefObject<HTMLElement>;
  categories: keyof Course[] | string[];
  catList: { [K in CategoryType]: string[] };
}
export type CategoryType = keyof Course | string;

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const Section = styled(Card)<any>`
  margin: 0.5em 0.3em;
  padding: 0.2em;
`;

class SortDrawer extends React.Component<SortDrawerProps, SortDrawerState> {
  state = {
    widthRef: React.createRef<HTMLElement>(),
    categories: ['term', 'subject', 'level', 'ge'],
    catList: {
      term: ['2190', '2189'],
      subject: ['AMS', 'ANTH'],
      level: ['Lower Div'],
      ge: ['TA', 'SR'],
    },
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
            {this.state.categories.map((category, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <Divider />}
                <FilterMenu
                  addFilter={this.props.addFilter}
                  removeFilter={this.props.removeFilter}
                  category={category}
                  filterList={this.state.catList[category]}
                  activeFilters={this.props.activeFilters}
                />
              </React.Fragment>
            ))}
            {/* which quarter, default to current */}
            {/* department/major */}
            {/* Category */}
            {/* GE */}
          </Section>
        </Drawer>
      </RootRef>
    );
  }
}

export default SortDrawer;
