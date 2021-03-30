import React, { useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { CourseType } from '../../store/course';

export interface SelectMenuProps {
	sort: (type: CourseType) => void;
	sortKey: CourseType;
}

const keyNameMap: { [K in CourseType]?: string } = {
	subjectCode: 'Course Name',
	capacity: 'Capacity (WIP)',
	type: 'Class Type',
};

const SelectMenu: React.FC<SelectMenuProps> = ({ sort, sortKey }) => {
	const [anchor, setAnchor] = useState(null as HTMLElement | null);

	return (
		<React.Fragment>
			<List component="nav">
				<ListItem
					button
					aria-owns={anchor ? 'fade-menu' : undefined}
					aria-haspopup="true"
					aria-controls="lock-menu"
					onClick={e => setAnchor(e.currentTarget)}
					style={{ padding: '8px' }}>
					<ListItemText
						primary={keyNameMap[sortKey] ?? 'Course Name'}
						primaryTypographyProps={{
							style: {
								font: 'Roboto',
								width: '100%',
								lineHeight: 1.75,
								fontWeight: 400,
								fontSize: '0.875rem',
								color: 'rgba(0, 0, 0, 0.87)',
								textAlign: 'center',
							},
						}}
					/>
				</ListItem>
			</List>
			<Menu
				id="fade-menu"
				open={Boolean(anchor)}
				anchorEl={anchor}
				TransitionComponent={Fade}
				onBackdropClick={e => (sort(sortKey), setAnchor(null))}>
				{Object.entries(keyNameMap).map(([key, val]) => (
					<MenuItem
						key={key}
						selected={key === sortKey}
						onClick={e => (key !== sortKey && sort(key as CourseType), setAnchor(null))}>
						{val}
					</MenuItem>
				))}
			</Menu>
		</React.Fragment>
	);
};

export default SelectMenu;
