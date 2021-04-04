import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';

import { SectionEnrollment, Setting } from '../../models/course.model';

export interface SectionCardProps {
	section: SectionEnrollment[];
	setting: Setting[];
}

const SectionCard: React.FC<SectionCardProps> = props => {
	return (
		<React.Fragment>
			<CardContent style={{ padding: '8px' }}>
				<GridList>
					{props.section.map((cur, k) => (
						<GridListTile key={k} style={{ width: 100 / 5 + '%', height: 'auto' }}>
							<Card>
								<CardHeader title={cur.name} style={{ padding: '8px' }} />
								<Divider />
								<CardContent style={{ padding: '8px' }}>
									<Typography>{'Enrolled: ' + cur.enrolled + '/' + cur.capacity}</Typography>
									<Typography>{'Waitlisted: ' + cur.waitlist}</Typography>
									{/* {props.setting.length > 0 && (
                        <Typography>
                          {'Time: ' +
                            (props.setting && props.setting[k]
                              ? props.setting[k].day.reduce(
                                  (d, s, i) => {
                                    return (
                                      (i === 0 ? '' : d) + s.substring(0, 2)
                                    );
                                  },
                                  ''
                                ) +
                                ' ' +
                                props.setting![k].time.start +
                                '-' +
                                props.setting![k].time.end
                              : 'TBA')}
                        </Typography>
                      )}
                      {props.setting.length > 0 && (
                        <Typography>
                          {'Location: ' +
                            (props.setting && props.setting[k]
                              ? props.setting[k].location
                              : 'TBA')}
                        </Typography>
                      )} */}
								</CardContent>
							</Card>
						</GridListTile>
					))}
				</GridList>
			</CardContent>
		</React.Fragment>
	);
};

export default SectionCard;
