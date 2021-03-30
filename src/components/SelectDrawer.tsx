import React, { useState } from 'react';
import memoize from 'memoize-one';
import styled from 'styled-components';

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
import { Filter, Course, CourseType } from '../store/course';

import { isMobileOnly, MobileOnlyView } from 'react-device-detect';

export interface SelectDrawerProps {
	courses: Course[];
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
	available: boolean;
}

const Section = styled(Card)`
	margin: 0.25em 0.15em;
	padding: 0;
	box-shadow: none !important;
`;

const catMap: Partial<Record<CourseType, { name: string; desc: string }[]>> = filterData;

const SelectDrawer: React.FC<SelectDrawerProps> = props => {
	const [basket, setBasket] = useState([]);
	const [available, setAvailable] = useState(!isMobileOnly);

	const getAvailableFilters = memoize((courses: Course[]) =>
		(Object.keys(catMap) as CourseType[]).reduce(
			(filtered, cur) =>
				catMap[cur]
					? {
							...filtered,
							[cur]: catMap[cur]!.filter(f =>
								courses.some(
									c => c[cur] === f.name || (cur === 'ge' && (c[cur]! as string[]).includes(f.name))
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
					marginTop: '32px',
					padding: isMobileOnly ? '0.25em 0' : '0.25em',
					width: isMobileOnly ? '100vw' : '12vw',
					height: available ? undefined : '15vw',
					flexDirection: available ? undefined : 'row',
					whiteSpace: 'nowrap',
				},
			}}>
			<SearchBar search={props.search} />
			<MobileOnlyView
				style={{
					// width: 'fit-content',
					// display: 'inline',
					// marginTop: '3px',
					position: 'absolute',
					top: 7,
					right: 7,
				}}>
				<NotchedOutline>
					<IconButton onClick={e => setAvailable(!available)} style={{ padding: '15px' }}>
						{available ? (
							<Clear style={{ transform: 'scale(1.25)' }} />
						) : (
							<FilterList style={{ transform: 'scale(1.25)' }} />
						)}
					</IconButton>
				</NotchedOutline>
			</MobileOnlyView>
			{available && (
				<React.Fragment>
					<Section style={{ display: 'block' }}>
						<NotchedOutline width={50} title="Sorting">
							<SelectMenu sort={props.sort} sortKey={props.sortKey} />
						</NotchedOutline>
					</Section>
					<Section>
						<NotchedOutline width={44} title="Filters">
							{(Object.keys(availableFilters) as CourseType[]).map((category, k) => (
								<React.Fragment key={k}>
									<FilterMenu
										addFilter={props.addFilter}
										removeFilter={props.removeFilter}
										category={category}
										filterList={availableFilters[category]?.map(f => f.name) ?? []}
										activeFilters={props.activeFilters.filter(f => f.type === category)}
										toolTips={availableFilters[category]?.map(f => f.desc) ?? []}
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
