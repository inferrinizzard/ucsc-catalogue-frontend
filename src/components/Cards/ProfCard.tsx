import React from 'react';
import styled from 'styled-components';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import StarRounded from '@material-ui/icons/StarRounded';
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import StarHalfRounded from '@material-ui/icons/StarHalfRounded';

import { professorRating } from '../../models/course.model';
import { Typography } from '@material-ui/core';

export interface ProfCardProps {
	rmp: professorRating;
	name: string;
}

const ProfCard: React.FC<ProfCardProps> = ({ name, rmp }) => {
	const stars = (num: number) => {
		let result: JSX.Element[] = [] as JSX.Element[];
		for (let i = 0; i < Math.floor(num); i++) result.push(<StarRounded key={'a' + i} />);
		num - Math.floor(num) >= 0.5 && result.push(<StarHalfRounded key={'b'} />);
		for (let i = result.length; i < 5; i++) result.push(<StarBorderRounded key={'c' + i} />);
		return <>{result}</>;
	};

	return (
		<React.Fragment>
			<CardHeader title={name} style={{ padding: '8px 16px' }} />
			<Divider />
			{rmp.clarity ? (
				<CardContent>
					{Object.entries(rmp).map(([name, rating]) => (
						<>
							<Typography key={name}>
								{`${name[0].toUpperCase() + name.slice(1)} - (${rating.toFixed(2)})`}
							</Typography>
							{stars(rating)}
						</>
					))}
				</CardContent>
			) : (
				<Typography style={{ textAlign: 'center' }}>
					{'RateMyProfessors Data Unavailable'}
				</Typography>
			)}
		</React.Fragment>
	);
};

export default ProfCard;
