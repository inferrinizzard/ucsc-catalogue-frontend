import React from 'react';
import styled from 'styled-components';
import toPX from 'to-px';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List, ListRowProps } from 'react-virtualized/dist/es/List';

import ClassCard from './DrawerItems/ClassCard';
import { Course } from '../models/course.model';

import { isMobileOnly } from 'react-device-detect';

export interface GridProps {
	courses: Course[];
	openDetail: (course: Course, row?: number) => void;
	scrollIndex: number;
	scrollTo: (row: number) => void;
	open: boolean;
}

const GridContainer = styled.div<Pick<GridProps, 'open'>>`
	margin-top: ${isMobileOnly && '15vw'};
	margin-left: ${p => !isMobileOnly && p.theme.selectDrawerWidth + '%'};
	width: ${p =>
		isMobileOnly ? '100vw' : `calc(${(100 - p.theme.selectDrawerWidth) / (p.open ? 2 : 1)}%)`};
	height: ${p => (isMobileOnly && p.open ? '40%' : '100%')};
`;

const Grid: React.FC<GridProps> = props => (
	<GridContainer open={props.open}>
		<AutoSizer>
			{({ height, width }: { height: number; width: number }) => {
				const columns = isMobileOnly ? 2 : props.open ? 4 : 8;
				const rows = Math.ceil(props.courses.length / columns);
				const cardWidth = 100 / columns,
					cardHeight = 6;
				return (
					<List
						width={width}
						height={height}
						rowCount={rows}
						rowHeight={toPX(cardHeight + 'rem')}
						overscanRowCount={4}
						scrollToAlignment="start"
						scrollToIndex={props.scrollIndex}
						style={{ outline: 'none' }}
						rowRenderer={({ index, key, style }: ListRowProps) => {
							const fromIndex: number = index * columns;
							const toIndex: number = Math.min(fromIndex + columns, props.courses.length);
							return (
								<div key={key} style={{ ...style, padding: '0 0.5rem' }}>
									{props.courses.slice(fromIndex, toIndex).map((course, i) => (
										<ClassCard
											key={course.subjectCode + '_' + i}
											row={index}
											courseData={course}
											width={cardWidth}
											openDetail={(course, row) => {
												props.openDetail(course, row);
												row && props.scrollTo(row);
											}}
										/>
									))}
								</div>
							);
						}}
					/>
				);
			}}
		</AutoSizer>
	</GridContainer>
);

export default Grid;
