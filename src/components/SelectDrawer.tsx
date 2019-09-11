import * as React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import SearchBar from './Pieces/SearchBar';
import SelectMenu from './Pieces/SortMenu';
import FilterMenu from './Pieces/FilterMenu';
import QuarterMenu from './Pieces/QuarterMenu';
import NotchedOutline from './Pieces/NotchedOutline';
import subjectData from './Data/subject.json';
import descData from './Data/desc.json';
import { Filter, Course, CourseType } from '../store/course';

export interface SortDrawerProps {
  sort: (type: CourseType) => void;
  sortKey: CourseType;
  open: boolean;
  setDrawerWidth: (val: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  clearFilters: () => void;
  changeQuarter: (n: number) => void;
  activeFilters: Filter[];
  search: (name: string) => void;
}
export interface SortDrawerState {
  basket: Course[];
}

const Section = styled(Card)<any>`
  margin: 0.25em 0.15em;
  padding: 0;
  box-shadow: none !important;
`;

const catMap: { [K in CourseType]?: string[] } = subjectData;
const toolTip: { [K in CourseType]?: string[] } = descData;

class SortDrawer extends React.Component<SortDrawerProps, SortDrawerState> {
  state = {
    basket: [],
  };
  render() {
    return (
      <Drawer
        open={this.props.open}
        variant="permanent"
        elevation={1}
        PaperProps={{
          style: {
            marginTop: '32px',
            padding: '0.25em',
            width: '210px',
          },
        }}
      >
        <SearchBar search={this.props.search} />
        <Section>
          <NotchedOutline
            width={50}
            title={'Sorting'}
            inner={
              <SelectMenu sort={this.props.sort} sortKey={this.props.sortKey} />
            }
          />
        </Section>
        <Section>
          <NotchedOutline
            width={44}
            title={'Filters'}
            inner={
              <React.Fragment>
                {(Object.keys(catMap) as CourseType[]).map((category, k) => (
                  <React.Fragment key={k}>
                    <FilterMenu
                      addFilter={this.props.addFilter}
                      removeFilter={this.props.removeFilter}
                      category={category}
                      filterList={catMap[category] || []}
                      activeFilters={this.props.activeFilters.filter(
                        f => f.type === category
                      )}
                      toolTips={toolTip[category] || []}
                    />
                    <Divider />
                  </React.Fragment>
                ))}
                <QuarterMenu changeQuarter={this.props.changeQuarter} />
                <Divider />
                <Button fullWidth onClick={e => this.props.clearFilters()}>
                  {'Clear All'}
                </Button>
              </React.Fragment>
            }
          />
        </Section>
      </Drawer>
    );
  }
}

export default SortDrawer;
