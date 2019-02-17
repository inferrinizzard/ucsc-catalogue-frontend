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
import { Filter, CourseType } from '../store/course';

export interface SortDrawerProps {
  sort: (type: CourseType) => void;
  sortKey: CourseType;
  open: boolean;
  setDrawerWidth: (val: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  activeFilters: Filter[];
}
export interface SortDrawerState {
  widthRef: React.RefObject<HTMLElement>;
}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const Section = styled(Card)<any>`
  margin: 0.5em 0.3em;
  padding: 0.2em;
`;

const catMap: { [K in CourseType]?: string[] } = {
  subject: ['AMS', 'ANTH'],
  level: ['Lower Div'],
  ge: ['TA', 'SR'],
  type: ['Lecture', 'Discussion', 'Laboratory', 'Seminar'],
};

class SortDrawer extends React.Component<SortDrawerProps, SortDrawerState> {
  state = {
    widthRef: React.createRef<HTMLElement>(),
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
            {(Object.keys(catMap) as (CourseType)[]).map((category, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <Divider />}
                <FilterMenu
                  addFilter={this.props.addFilter}
                  removeFilter={this.props.removeFilter}
                  category={category}
                  filterList={catMap[category] || []}
                  activeFilters={this.props.activeFilters.filter(
                    f => f.type === category
                  )}
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
