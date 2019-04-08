import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import { SectionEnrollment, Setting } from '../../models/course.model';

export interface SectionCardProps {
  section: SectionEnrollment[];
  setting: Setting[];
}
export interface SectionCardState {}

class SectionCard extends React.Component<SectionCardProps, SectionCardState> {
  render() {
    return (
      <React.Fragment>
        <CardContent>
          <GridList>
            {this.props.section.map((cur, index) => {
              return (
                <GridListTile
                  key={index}
                  style={{ width: 100 / 4 + '%', height: 'auto' }}
                >
                  <Card>
                    <CardHeader title={cur.name} />
                    <Divider />
                    <CardContent style={{ padding: '14px' }}>
                      <Typography>
                        {'Enrolled: ' + cur.enrolled + '/' + cur.capacity}
                      </Typography>
                      <Typography>{'Waitlisted: ' + cur.waitlist}</Typography>
                      {/* {this.props.setting.length > 0 && (
                        <Typography>
                          {'Time: ' +
                            (this.props.setting && this.props.setting[index]
                              ? this.props.setting[index].day.reduce(
                                  (d, s, i) => {
                                    return (
                                      (i === 0 ? '' : d) + s.substring(0, 2)
                                    );
                                  },
                                  ''
                                ) +
                                ' ' +
                                this.props.setting![index].time.start +
                                '-' +
                                this.props.setting![index].time.end
                              : 'TBA')}
                        </Typography>
                      )}
                      {this.props.setting.length > 0 && (
                        <Typography>
                          {'Location: ' +
                            (this.props.setting && this.props.setting[index]
                              ? this.props.setting[index].location
                              : 'TBA')}
                        </Typography>
                      )} */}
                    </CardContent>
                  </Card>
                </GridListTile>
              );
            })}
          </GridList>
        </CardContent>
      </React.Fragment>
    );
  }
}

export default SectionCard;
