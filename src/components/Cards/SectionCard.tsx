import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import { SectionEnrollment } from '../../models/course.model';

export interface SectionCardProps {
  section: SectionEnrollment[];
}
export interface SectionCardState {}

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  margin-right: 0.25em;
  overflow: visible !important;
`;

class SectionCard extends React.Component<SectionCardProps, SectionCardState> {
  render() {
    return (
      <StyleCard>
        <CardHeader title={'Sections'} />
        <Divider />
        <CardContent>
          <GridList>
            {this.props.section.map((cur, index) => {
              return (
                <GridListTile key={index} style={{ width: 100 / 7 + '%' }}>
                  <Card>
                    <CardHeader title={cur.name} />
                    <Divider />
                    <CardContent style={{ padding: '14px' }}>
                      <Typography>
                        {'Enrolled: ' + cur.enrolled + '/' + cur.capacity}
                      </Typography>
                      <Typography>{'Waitlisted: ' + cur.waitlist}</Typography>
                    </CardContent>
                  </Card>
                </GridListTile>
              );
            })}
          </GridList>
        </CardContent>
      </StyleCard>
    );
  }
}

export default SectionCard;
