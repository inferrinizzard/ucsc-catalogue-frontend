import React, { useState, useContext } from 'react';
import memoize from 'memoize-one';
import styled, { ThemeContext } from 'styled-components';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FilterList from '@material-ui/icons/FilterList';
import Clear from '@material-ui/icons/Clear';

import SearchBar from './DrawerItems/SearchBar';
import SelectMenu from './DrawerItems/SortMenu';
import FilterMenu from './DrawerItems/FilterMenu';
import QuarterMenu from './DrawerItems/QuarterMenu';
import NotchedOutline from './DrawerItems/NotchedOutline';

import filterData from './Data/filters.json';
import { Filter, Course, CourseType, FilterDomain } from '../store/course';

import { isMobileOnly, MobileOnlyView } from 'react-device-detect';

export interface SelectDrawerProps {
	backup: Course[];
	sortKey: CourseType;
	open: boolean;
	sort: (type: CourseType) => void;
	activeFilters: Filter[];
	addFilter: (f: Filter) => void;
	removeFilter: (f: Filter) => void;
	clearFilters: () => void;
	changeQuarter: (n: number) => void;
	search: (name: string) => void;
}
export interface SelectDrawerState {
	basket: Course[];
	mobileOpen: boolean;
}

const Section = styled(Card)`
	margin: 0.25em 0.15em;
	padding: 0;
	&& {
		box-shadow: none;
	}
`;

const catMap: Record<FilterDomain, { name: string; desc: string }[]> = filterData;

const SelectDrawer: React.FC<SelectDrawerProps> = props => {
	// const [basket, setBasket] = useState([]);
	const [mobileOpen, setMobileOpen] = useState(!isMobileOnly);

	const theme = useContext(ThemeContext);

	const getAvailableFilters = memoize((courses: Course[]) =>
		Object.entries(catMap).reduce(
			(filtered, [cur, dataFilter]) =>
				dataFilter
					? {
							...filtered,
							[cur]: dataFilter.filter(f =>
								courses.some(
									c => c[cur as CourseType] === f.name || (cur === 'ge' && c[cur].includes(f.name))
								)
							),
					  }
					: filtered,
			{} as typeof catMap
		)
	);

	const availableFilters = getAvailableFilters(props.backup);
	return (
		<Drawer
			anchor={isMobileOnly ? 'top' : 'left'}
			open={props.open}
			variant="permanent"
			elevation={1}
			PaperProps={{
				style: {
					top: theme.topLinerHeight,
					padding: isMobileOnly ? '0.25em 0' : '0.25em',
					width: isMobileOnly ? '100%' : theme.selectDrawerWidth + '%',
					height: mobileOpen ? undefined : '15vw',
					flexDirection: mobileOpen ? undefined : 'row',
					whiteSpace: 'nowrap',
				},
			}}>
			<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
				<SearchBar search={props.search} />
				<MobileOnlyView style={{ display: 'inline-block' }}>
					<NotchedOutline>
						<IconButton onClick={e => setMobileOpen(!mobileOpen)} style={{ padding: '15px' }}>
							{mobileOpen && <Clear style={{ transform: 'scale(1.25)' }} />}
							{!mobileOpen && <FilterList style={{ transform: 'scale(1.25)' }} />}
						</IconButton>
					</NotchedOutline>
				</MobileOnlyView>
			</div>
			{mobileOpen && (
				<React.Fragment>
					<Section style={{ display: 'block' }}>
						<NotchedOutline width={50} title="Sorting">
							<SelectMenu sort={props.sort} sortKey={props.sortKey} />
						</NotchedOutline>
					</Section>
					<Section>
						<NotchedOutline width={44} title="Filters">
							{Object.entries(availableFilters).map(([category, filter]) => (
								<React.Fragment key={category}>
									<FilterMenu
										addFilter={props.addFilter}
										removeFilter={props.removeFilter}
										category={category as CourseType}
										filterList={filter?.map(f => f.name) ?? []}
										activeFilters={props.activeFilters.filter(f => f.type === category)}
										toolTips={filter?.map(f => f.desc) ?? []}
									/>
									<Divider />
								</React.Fragment>
							))}
							<QuarterMenu changeQuarter={props.changeQuarter} />
							<Divider />
							<Button fullWidth onClick={e => props.clearFilters()}>
								{'Clear All'}
							</Button>
						</NotchedOutline>
					</Section>
				</React.Fragment>
			)}
		</Drawer>
	);
};

export default SelectDrawer;
