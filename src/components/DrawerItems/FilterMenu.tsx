import React from 'react';

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

class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
	state = {
		anchor: null,
		widthRef: React.createRef<HTMLElement>(),
		width: 0,
		scrolling: false,
	};

	ITEM_HEIGHT = 48;
	scrollTimer: number = -1;

	componentDidMount = () => this.setState({ width: this.state.widthRef.current!.offsetWidth });

	render() {
		return (
			<React.Fragment>
				<RootRef rootRef={this.state.widthRef}>
					<Button
						fullWidth
						aria-owns={this.state.anchor ? 'fade-menu' : undefined}
						aria-haspopup="true"
						onClick={e => this.setState({ anchor: e.currentTarget })}>
						{this.props.category}
					</Button>
				</RootRef>
				<Menu
					id="fade-menu"
					open={Boolean(this.state.anchor)}
					anchorEl={this.state.anchor}
					TransitionComponent={Fade}
					onBackdropClick={e => this.setState({ anchor: null })}
					onScroll={e => {
						if (!isMobileOnly) {
							if (!this.state.scrolling) this.setState({ scrolling: true });
							clearTimeout(this.scrollTimer);
							this.scrollTimer = (setTimeout(
								() => this.setState({ scrolling: false }),
								50
							) as any) as number;
						}
					}}
					PaperProps={{
						style: {
							maxHeight: this.ITEM_HEIGHT * 7.5,
							width: this.state.width,
						},
					}}>
					{this.props.filterList
						// filter out active elements
						.filter(f => !this.props.activeFilters.map(x => x.name).includes(f))
						.map((f, k) => (
							<Tooltip
								key={k}
								title={
									this.state.scrolling ? '' : this.props.toolTips[this.props.filterList.indexOf(f)]
								}
								placement={isMobileOnly ? 'left' : 'right'}
								open={isMobileOnly ? true : undefined}
								// PopperProps={{ style: { disablePortal: isMobileOnly } }}
							>
								<MenuItem
									onClick={e => {
										this.props.addFilter({
											type: this.props.category,
											name: f,
										});
										this.setState({ anchor: null });
									}}>
									{f}
								</MenuItem>
							</Tooltip>
						))}
				</Menu>
				<div style={{ maxWidth: '210px' }}>
					{this.props.activeFilters.map(af => (
						<Chip key={af.name} label={af.name} onDelete={e => this.props.removeFilter(af)} />
					))}
				</div>
			</React.Fragment>
		);
	}
}

export default FilterMenu;
