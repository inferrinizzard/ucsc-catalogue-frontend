import React from 'react';
import styled from 'styled-components';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export interface LocCardProps {
	location: string;
}

const LocCard: React.FC<LocCardProps> = props => {
	return (
		<React.Fragment>
			{/* <CardMedia /> */}
			{/* <div>image goes here</div> */}
			<CardContent>
				<Typography>{'Location: ' + props.location}</Typography>
				{/* <div>Google Maps this</div> */}
			</CardContent>
		</React.Fragment>
	);
};

export default LocCard;
