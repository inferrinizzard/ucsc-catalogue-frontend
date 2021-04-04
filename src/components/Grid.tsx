import React, { useContext } from 'react';
import styled from 'styled-components';
import toPX from 'to-px';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List, ListRowProps } from 'react-virtualized/dist/es/List';

import { CourseContext } from '../App';
import ClassCard from './DrawerItems/ClassCard';
import Skeleton from './Cards/Skeleton';
import { Course } from '../models/course.model';

import { isMobileOnly } from 'react-device-detect';

export interface GridProps {
	openDetail: (course: Course, row?: number) => void;
	scrollIndex: number;
	scrollTo: (row: number) => void;
	open: boolean;
	loading: boolean;
}

const GridContainer = styled.div<Pick<GridProps, 'open'>>`
	margin-top: ${isMobileOnly && '15vw'};
	margin-left: ${p => !isMobileOnly && p.theme.selectDrawerWidth + '%'};
	width: ${p =>
		isMobileOnly ? '100vw' : `calc(${(100 - p.theme.selectDrawerWidth) / (p.open ? 2 : 1)}%)`};
	height: ${p => (isMobileOnly && p.open ? '40%' : '100%')};
`;

const Grid: React.FC<GridProps> = props => {
	const courses = useContext(CourseContext).list;

	const DummyArray = new Array(100).fill(0).map((_, i) => i);

	return (
		<GridContainer open={props.open}>
			<AutoSizer>
				{({ height, width }: { height: number; width: number }) => {
					const columns = isMobileOnly ? 2 : props.open ? 4 : 8;
					const rows = props.loading ? 10 : Math.ceil(courses.length / columns);
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
								const toIndex: number = Math.min(
									fromIndex + columns,
									props.loading ? DummyArray.length : courses.length
								);
								return (
									<div key={key} style={{ ...style, padding: '0 0.5rem' }}>
										{props.loading
											? DummyArray.slice(fromIndex, toIndex).map((i, j) => (
													<Skeleton
														key={i}
														variant={'rect'}
														width={`calc(${cardWidth}% - 0.5rem)`}
														height={cardHeight - 0.3 + 'rem'}
														style={{ margin: '0.25rem 0.15rem', display: 'inline-block' }}
														animation={{
															type: 'pulse',
															stagger: index * 0.1 + j * 0.05,
															duration: '3s',
														}}
													/>
											  ))
											: courses.slice(fromIndex, toIndex).map((course, i) => (
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
};

export default Grid;
