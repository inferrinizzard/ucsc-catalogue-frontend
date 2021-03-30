import React, { useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';

import MenuItem from '@material-ui/core/MenuItem';

import { CourseType } from '../../store/course';
import { Term } from '../../models/course.model';
import quarterData from '../Data/quarters.json';

export interface QuarterMenuProps {
	changeQuarter: (n: number) => void;
}

const quarters: Term[] = quarterData;

const QuarterMenu: React.FC<QuarterMenuProps> = ({ changeQuarter }) => {
	const [anchor, setAnchor] = useState(null as HTMLElement | null);
	const [activeQuarter, setQuarter] = useState(quarters[0].name); // replace with prop from app / route-based prop

	const ITEM_HEIGHT = 48;

	return (
		<React.Fragment>
			<List component="nav" style={{ padding: 0 }}>
				<ListItem
					button
					aria-owns={anchor ? 'fade-menu' : undefined}
					aria-haspopup="true"
					aria-controls="lock-menu"
					onClick={e => setAnchor(e.currentTarget)}
					style={{ padding: '8px' }}>
					<ListItemText
						primary={activeQuarter}
						style={{ padding: 0 }}
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
				onBackdropClick={e => setAnchor(null)}
				PaperProps={{
					style: { maxHeight: ITEM_HEIGHT * 4.5 },
				}}>
				{quarters.map(q => (
					<MenuItem
						key={q.name}
						selected={q.name === activeQuarter}
						onClick={e => (changeQuarter(q.code), setQuarter(q.name), setAnchor(null))}>
						{q.name}
					</MenuItem>
				))}
			</Menu>
		</React.Fragment>
	);
};

export default QuarterMenu;
