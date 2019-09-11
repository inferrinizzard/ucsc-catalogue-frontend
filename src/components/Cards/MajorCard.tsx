import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';

export interface MajorCardProps {}
export interface MajorCardState {}

class MajorCard extends React.Component<MajorCardProps, MajorCardState> {
  render() {
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
  }
}

export default MajorCard;
