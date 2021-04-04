import React from 'react';
import styled from 'styled-components';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

export interface MajorCardProps {}

const MajorCard: React.FC<MajorCardProps> = props => {
	return (
		<React.Fragment>
			<div style={{ textAlign: 'center', fontFamily: 'Roboto' }}>
				Work in progress, to be implemented soon!
			</div>
			{/* <CardContent>
          <div>reqs</div>
        </CardContent> */}
		</React.Fragment>
	);
};

export default MajorCard;
