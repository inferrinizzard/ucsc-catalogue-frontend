import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export interface ClassCardProps {}
export interface ClassCardState {}

const StyleCard = styled(Card)`
	margin: .5em;
	min-width: 200px;
`;

class ClassCard extends React.Component<ClassCardProps, ClassCardState> {
	render() { 
		return (<React.Fragment>
		<StyleCard>
			<CardActionArea>
				<CardMedia image="https://i.kym-cdn.com/photos/images/original/001/316/888/f81.jpeg"/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						AMS 5
					</Typography>
					<Typography component="p">
            Statistics
          </Typography>
				</CardContent>
			</CardActionArea>
		</StyleCard>
		</React.Fragment>);
	}
}
 
export default ClassCard;