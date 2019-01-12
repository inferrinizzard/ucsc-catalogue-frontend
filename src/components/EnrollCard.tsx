import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';

export interface EnrollCardProps {}
export interface EnrollCardState {}
 
class EnrollCard extends React.Component<EnrollCardProps, EnrollCardState> {
	render() { 
		return (
			<Card>
				<CardHeader
					title="Enrollment"
				/>
				<CardMedia />
				<CardContent>
					<Typography>
						Enrolled:
					</Typography>
					<Typography>
						Waitlisted:
					</Typography>
				</CardContent>
			</Card>
		);
	}
}
 
export default EnrollCard;