import * as React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import RootRef from '@material-ui/core/RootRef';

import SearchBar from './Pieces/SearchBar';
import SelectMenu from './Pieces/SelectMenu';
import FilterMenu from './Pieces/FilterMenu';
import QuarterMenu from './Pieces/QuarterMenu';
import { Filter, CourseType } from '../store/course';
import subjectData from './Data/subject.json';
import descData from './Data/desc.json';

export interface SortDrawerProps {
  sort: (type: CourseType) => void;
  sortKey: CourseType;
  open: boolean;
  setDrawerWidth: (val: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  changeQuarter: (n: number) => void;
  activeFilters: Filter[];
  search: (name: string) => void;
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

const catMap: { [K in CourseType]?: string[] } = subjectData;
const toolTip: { [K in CourseType]?: string[] } = descData;

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
          <SearchBar search={this.props.search} />
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
                  toolTips={toolTip[category] || []}
                />
              </React.Fragment>
            ))}
            <QuarterMenu changeQuarter={this.props.changeQuarter} />
          </Section>
        </Drawer>
      </RootRef>
    );
  }
}

export default SortDrawer;
