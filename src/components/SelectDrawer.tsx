import * as React from 'react';
import memoize from 'memoize-one';

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

import filterData from './Data/filters.json';
import { Filter, Course, CourseType } from '../store/course';

export interface SelectDrawerProps {
  courses: Course[];
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
export interface SelectDrawerState {
  basket: Course[];
}

const Section = styled(Card)<any>`
  margin: 0.25em 0.15em;
  padding: 0;
  box-shadow: none !important;
`;

const catMap: {
  [K in CourseType]?: { name: string; desc: string }[]
} = filterData;

class SelectDrawer extends React.Component<
  SelectDrawerProps,
  SelectDrawerState
> {
  state = {
    basket: [],
  };

  getAvailableFilters = memoize((courses: Course[]) =>
    (Object.keys(catMap) as CourseType[]).reduce(
      (filtered, cur) =>
        catMap[cur]
          ? {
              ...filtered,
              [cur]: catMap[cur]!.filter(f =>
                courses.some(c => c[cur] === f.name)
              ),
            }
          : filtered,
      {} as { [K in CourseType]?: { name: string; desc: string }[] }
    )
  );

  render() {
    let availableFilters = this.getAvailableFilters(this.props.courses);
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
          <NotchedOutline width={50} title={'Sorting'}>
            <SelectMenu sort={this.props.sort} sortKey={this.props.sortKey} />
          </NotchedOutline>
        </Section>
        <Section>
          <NotchedOutline width={44} title={'Filters'}>
            {(Object.keys(availableFilters) as CourseType[]).map(
              (category, k) => (
                <React.Fragment key={k}>
                  <FilterMenu
                    addFilter={this.props.addFilter}
                    removeFilter={this.props.removeFilter}
                    category={category}
                    filterList={
                      availableFilters[category]!.map(f => f.name) || []
                    }
                    activeFilters={this.props.activeFilters.filter(
                      f => f.type === category
                    )}
                    toolTips={
                      availableFilters[category]!.map(f => f.desc) || []
                    }
                  />
                  <Divider />
                </React.Fragment>
              )
            )}
            <QuarterMenu changeQuarter={this.props.changeQuarter} />
            <Divider />
            <Button fullWidth onClick={e => this.props.clearFilters()}>
              {'Clear All'}
            </Button>
          </NotchedOutline>
        </Section>
      </Drawer>
    );
  }
}

export default SelectDrawer;
