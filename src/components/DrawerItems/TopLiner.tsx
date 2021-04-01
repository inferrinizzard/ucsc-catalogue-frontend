import React, { useState } from 'react';

import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

const TopBar = styled.div`
	width: 100%;
	background: ${p => p.theme.topLinerBlue};
	z-index: ${p => p.theme.cardHeightPlus1};
	position: fixed;
	top: 0;
	height: ${p => p.theme.topLinerHeight};
`;

export interface TopLinerProps {}

const TopLiner: React.FC<TopLinerProps> = props => {
	const [open, setOpen] = useState(false);
	return (
		<TopBar>
			<span>
				<Typography
					variant="h5"
					style={{
						display: 'inline',
						paddingLeft: '8px',
						fontWeight: 400,
					}}>
					CruzAssist
				</Typography>
			</span>
			<span style={{ float: 'right' }}>
				<Button size="small" onClick={e => setOpen(!open)}>
					<Typography>About</Typography>
				</Button>
			</span>
			<Collapse in={open}>
				<Typography>Made by Sean Song with special help from Shun Kashiwa</Typography>
				<Typography>Data provided by slugsurvival</Typography>
			</Collapse>
		</TopBar>
	);
};

export default TopLiner;
