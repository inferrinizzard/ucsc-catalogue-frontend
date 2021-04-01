import React from 'react';

import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

const TopBar = styled.div`
	width: 100%;
	background: #5d92dd;
	z-index: 1201;
	position: fixed;
	top: 0;
	height: ${p => p.theme.topLinerHeight};
`;

export interface TopLinerProps {
	open: boolean;
	setAbout: (status: boolean) => void;
}

const TopLiner: React.FC<TopLinerProps> = props => {
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
				<Button size="small" onClick={e => props.setAbout(!props.open)}>
					<Typography>About</Typography>
				</Button>
			</span>
			<Collapse in={props.open}>
				<Typography>Made by Sean Song with special help from Shun Kashiwa</Typography>
				<Typography>Data provided by slugsurvival</Typography>
			</Collapse>
		</TopBar>
	);
};

export default TopLiner;
