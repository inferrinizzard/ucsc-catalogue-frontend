import * as React from 'react';
import memoize from 'memoize-one';
import styled from 'styled-components';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FilterList from '@material-ui/icons/FilterList';

import SearchBar from './Pieces/SearchBar';
import SelectMenu from './Pieces/SortMenu';
import FilterMenu from './Pieces/FilterMenu';
import QuarterMenu from './Pieces/QuarterMenu';
import NotchedOutline from './Pieces/NotchedOutline';

import filterData from './Data/filters.json';
import { Filter, Course, CourseType } from '../store/course';

import { isMobileOnly, MobileOnlyView } from 'react-device-detect';

export interface SelectDrawerProps {
  courses: Course[];
  sort: (type: CourseType) => void;
  sortKey: CourseType;
  open: boolean;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  clearFilters: () => void;
  changeQuarter: (n: number) => void;
  activeFilters: Filter[];
  search: (name: string) => void;
}
export interface SelectDrawerState {
  basket: Course[];
  available: boolean;
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
    available: !isMobileOnly,
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
        anchor={isMobileOnly ? 'top' : 'left'}
        open={this.props.open}
        variant="permanent"
        elevation={1}
        PaperProps={{
          style: {
            marginTop: '32px',
            padding: isMobileOnly ? '0.25em 0' : '0.25em',
            width: isMobileOnly ? '100vw' : '12vw',
            height: this.state.available ? undefined : '15vw',
            flexDirection: 'row',
          },
        }}
      >
        <SearchBar search={this.props.search} />
        <MobileOnlyView
          style={{
            width: 'fit-content',
            display: 'inline-block',
            marginTop: '3px',
          }}
        >
          <NotchedOutline>
            <IconButton
              onClick={e => this.setState({ available: !this.state.available })}
              style={{ padding: '15px' }}
            >
              <FilterList style={{ transform: 'scale(1.25)' }} />
            </IconButton>
          </NotchedOutline>
        </MobileOnlyView>
        {this.state.available && (
          <React.Fragment>
            <Section>
              <NotchedOutline width={50} title="Sorting">
                <SelectMenu
                  sort={this.props.sort}
                  sortKey={this.props.sortKey}
                />
              </NotchedOutline>
            </Section>
            <Section>
              <NotchedOutline width={44} title="Filters">
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
          </React.Fragment>
        )}
      </Drawer>
    );
  }
}

export default SelectDrawer;
