import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';

import TextBlock from '../Pieces/TextBlock';

export interface GradesCardProps {}
export interface GradesCardState {}

class GradesCard extends React.Component<GradesCardProps, GradesCardState> {
  render() {
    return (
      <React.Fragment>
        <div style={{ textAlign: 'center', fontFamily: 'Roboto' }}>
          Work in Progress, to be implemented soon!
        </div>
        {/* <CardContent>
          <TextBlock text="Grade: " type={'h5'} />
          <TextBlock text="Wuh: " type={'h5'} />
        </CardContent> */}
      </React.Fragment>
    );
  }
}

export default GradesCard;
