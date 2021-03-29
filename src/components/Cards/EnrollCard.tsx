import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

import { CourseEnrollment } from '../../models/course.model';

import { isMobileOnly } from 'react-device-detect';

export interface EnrollCardProps {
	tracking: CourseEnrollment[];
	prevStart: Date;
	curStart: Date;
	quarter: number;
}

const EnrollCard: React.FC<EnrollCardProps> = props => {
	if (!props.tracking.length) {
		return (
			<React.Fragment>
				<CardHeader
					title={
						'Tracking Data' +
						(!props.quarter.toString().endsWith('4') ? ' not yet ' : ' Un') +
						'available for this term'
					}
				/>
			</React.Fragment>
		);
	}
	const tracking = props.tracking.reduce((data, cur) => {
		let temp = datePlus(cur.date, 1);
		const next = data[data.length - 1];
		if (
			!data.length ||
			next.date.getDate() === cur.date.getDate() ||
			next.date.getDate() === temp.getDate()
		)
			return [...data, cur];
		else {
			let dates = [] as CourseEnrollment[];
			for (
				let step = copyDate(temp);
				step.getDate() != next.date.getDate();
				step.setDate(step.getDate() + 1)
			)
				dates.unshift({ ...next, date: copyDate(step) });
			return [...data, ...dates, cur];
		}
	}, [] as CourseEnrollment[]);
	const dates = tracking.reduceRight(
		(acc: string[], val) => [...acc, val.date.toDateString().substr(4)],
		[]
	);
	const maxHeight = tracking.length
		? tracking.reduce(
				(max: number, val) =>
					Math.max(max, Math.max(val.enrolled + val.waitlistTotal, val.capacity)),
				tracking[0].capacity
		  )
		: 0;

	let firstPass = datePlus(
		props.prevStart,
		props.prevStart.getDate() + (props.prevStart.getMonth() === 8 ? 49 : 50)
	);
	let secondPass = datePlus(firstPass, 8);
	let quarterStart = props.curStart;
	console.log(quarterStart.toDateString());

	return (
		<React.Fragment>
			<div
				style={{
					marginBottom: '5px',
					height: isMobileOnly ? '20em' : undefined,
				}}>
				<Plot
					//dates:
					//enrollment for fall is 51 days after start of previous spring
					//enrollment for spring is 51 days after winter
					//enrollment for winter is 53 days after fall
					//second pass 8 days after
					data={[
						{
							x: dates,
							y: tracking.reduceRight((x: number[], val) => [...x, val.enrolled], []),
							type: 'scatter',
							fill: 'tozeroy',
							name: 'Enrolled',
						},
						{
							x: dates,
							y: tracking.reduceRight(
								(x: number[], val) => [...x, val.enrolled + val.waitlistTotal],
								[]
							),
							type: 'scatter',
							fill: 'tonexty',
							name: 'Waitlisted',
							hoverinfo: 'x+text+name' as 'x+text', //requires 'x+text+name' type in @types/plotly.js/index.d.ts
							text: tracking.reduceRight(
								(x: string[], val) => [...x, val.waitlistTotal.toString()],
								[]
							),
							line: { color: 'rgb(44, 160, 44)' },
						},
						{
							x: dates,
							y: tracking.reduceRight((x: number[], val) => [...x, val.capacity], []),
							type: 'scatter',
							name: 'Capacity',
							hoverlabel: { bordercolor: '#FFF' },
							line: { color: 'rgb(255, 127, 14)' },
						},
					]}
					style={{ width: 'calc(100% - 20px)', height: '100%' }}
					layout={{
						fixedrange: true,
						showlegend: false,
						xaxis: {
							fixedrange: true,
							hoverformat: '',
							// tickangle: 45
						},
						yaxis: {
							fixedrange: true,
							range: tracking.length ? [0, maxHeight] : undefined,
						},
						margin: { l: 25, r: 25, b: 50, t: 10 },
						...[
							{ date: firstPass, label: 'First Pass' },
							{ date: secondPass, label: 'Second Pass' },
							{ date: quarterStart, label: 'Quarter Start' },
						].reduce(
							(acc, pass) =>
								tracking[0].date.getTime() > pass.date.getTime()
									? {
											shapes: [
												...acc.shapes,
												{
													type: 'line',
													x0: print4(pass.date),
													y0: 0,
													x1: print4(pass.date),
													y1: maxHeight,
												},
											],
											annotations: [
												...acc.annotations,
												{
													x: ((p: Date) => {
														let d = datePlus(p, isMobileOnly && tracking.length > 100 ? 4 : 1);
														if (tracking[0].date.getTime() <= d.getTime())
															d.setDate(p.getDate() + (isMobileOnly ? 1 : -1));
														if (tracking[0].date.getTime() <= d.getTime())
															d.setDate(p.getDate() - 1);
														return print4(d);
													})(pass.date),
													y: maxHeight * 0.9,
													text: pass.label,
													textangle: 90,
													showarrow: false,
												},
											],
									  }
									: acc,
							{ shapes: [], annotations: [] } as {
								shapes: {}[];
								annotations: {}[];
							}
						),
					}}
					config={{
						displayModeBar: false,
					}}
					useResizeHandler
				/>
			</div>
			<Divider />
			<CardContent>
				{([
					{ key: 'enrolled', label: 'Enrolled' },
					{ key: 'waitlistTotal', label: 'Waitlisted' },
				] as { key: keyof CourseEnrollment; label: string }[]).map((stat, i) => (
					<Typography
						key={i}
						variant="h5"
						style={{
							display: 'inline-block !important',
							width: isMobileOnly ? '100%' : '50%',
						}}>
						{stat.label +
							': ' +
							(tracking.length
								? tracking[0][stat.key] +
								  '/' +
								  tracking[0].capacity +
								  (tracking[0].capacity
										? ' - ' +
										  (((tracking[0][stat.key] as number) / tracking[0].capacity) * 100).toFixed(
												0
										  ) +
										  '%'
										: '')
								: '')}
					</Typography>
				))}
			</CardContent>
		</React.Fragment>
	);
};

const copyDate = (base: Date): Date => {
	let d = new Date(0);
	d.setUTCMilliseconds(base.getTime());
	return d;
};

const datePlus = (base: Date, days: number): Date => {
	let d = copyDate(base);
	d.setDate(base.getDate() + days);
	return d;
};

const print4 = (d: Date) => d.toDateString().substr(4);

export default EnrollCard;
