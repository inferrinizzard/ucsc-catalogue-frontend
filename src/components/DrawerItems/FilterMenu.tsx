import React, { useState, useRef, useLayoutEffect } from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import RootRef from '@material-ui/core/RootRef';
import Tooltip from '@material-ui/core/Tooltip';

import { Filter, CourseType } from '../../store/course';

import { isMobileOnly } from 'react-device-detect';

export interface FilterMenuProps {
	addFilter: (f: Filter) => void;
	removeFilter: (f: Filter) => void;
	category: CourseType;
	activeFilters: Filter[];
	filterList: string[];
	toolTips: string[];
}
export interface FilterMenuState {
	anchor: HTMLElement | null;
	widthRef: React.RefObject<HTMLElement>;
	width: number;
	scrolling: boolean;
}

const FilterMenu: React.FC<FilterMenuProps> = props => {
	const [anchor, setAnchor] = useState(null as HTMLElement | null);
	const [width, setWidth] = useState(0);
	const [scrolling, setScrolling] = useState(false);
	let widthRef = useRef<HTMLElement>(null);

	const ITEM_HEIGHT = 48;
	let scrollTimer: number = -1;

	useLayoutEffect(() => setWidth(widthRef.current!.offsetWidth), [widthRef.current]);

	return (
		<React.Fragment>
			<RootRef rootRef={widthRef}>
				<Button
					fullWidth
					aria-owns={anchor ? 'fade-menu' : undefined}
					aria-haspopup="true"
					onClick={e => setAnchor(e.currentTarget)}>
					{props.category}
				</Button>
			</RootRef>
			<Menu
				id="fade-menu"
				open={Boolean(anchor)}
				anchorEl={anchor}
				TransitionComponent={Fade}
				onBackdropClick={e => setAnchor(null)}
				onScroll={e => {
					if (!isMobileOnly) {
						!scrolling && setScrolling(true);
						clearTimeout(scrollTimer);
						scrollTimer = (setTimeout(() => setScrolling(false), 50) as any) as number;
					}
				}}
				PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 7.5, width } }}>
				{props.filterList
					// filter out active elements
					.filter(f => !props.activeFilters.map(x => x.name).includes(f))
					.map((f, k) => (
						<Tooltip
							key={k}
							title={scrolling ? '' : props.toolTips[props.filterList.indexOf(f)]}
							placement={isMobileOnly ? 'left' : 'right'}
							open={isMobileOnly ? true : undefined}
							// PopperProps={{ style: { disablePortal: isMobileOnly } }}
						>
							<MenuItem
								onClick={e => (
									props.addFilter({ type: props.category, name: f }), setAnchor(null)
								)}>
								{f}
							</MenuItem>
						</Tooltip>
					))}
			</Menu>
			<div style={{ maxWidth: '210px' }}>
				{props.activeFilters.map(af => (
					<Chip key={af.name} label={af.name} onDelete={e => props.removeFilter(af)} />
				))}
			</div>
		</React.Fragment>
	);
};

export default FilterMenu;
