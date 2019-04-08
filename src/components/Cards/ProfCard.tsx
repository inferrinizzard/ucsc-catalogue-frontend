import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import StarRounded from '@material-ui/icons/StarRounded';
import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import StarHalfRounded from '@material-ui/icons/StarHalfRounded';
import styled from 'styled-components';

import { professorRating } from '../../models/course.model';
import { Typography } from '@material-ui/core';

export interface ProfCardProps {
  rmp: professorRating;
  name: string;
}

const ProfCard: React.SFC<ProfCardProps> = props => {
  function stars(num: number): JSX.Element {
    let result: JSX.Element[] = [] as JSX.Element[];
    for (let i = 0; i < Math.floor(num); i++)
      result.push(<StarRounded key={'a' + i} />);
    const half: boolean = num - Math.floor(num) >= 0.5;
    if (half) result.push(<StarHalfRounded key={'b'} />);
    for (let i = Math.floor(num) + (half ? 1 : 0); i < 5; i++)
      result.push(<StarBorderRounded key={'c' + i} />);
    return (
      <React.Fragment>
        {result.map((cur, index) => {
          return cur;
        })}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <CardHeader title={props.name} />
      <Divider />
      {props.rmp.clarity ? (
        <CardContent>
          <Typography>
            {'Difficulty - (' + props.rmp.difficulty.toFixed(2) + ')'}
          </Typography>
          {stars(props.rmp.difficulty)}
          <Typography>
            {'Clarity - (' + props.rmp.clarity.toFixed(2) + ')'}
          </Typography>
          {stars(props.rmp.clarity)}
          <Typography>
            {'Overall - (' + props.rmp.overall.toFixed(2) + ')'}
          </Typography>
          {stars(props.rmp.overall)}
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
