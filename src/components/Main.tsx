import * as React from 'react';
import styled, { ThemedStyledFunction } from 'styled-components';
import ClassCard from './ClassCard';

// function styledComponentWithProps<T, U extends HTMLElement = HTMLElement>(styledFunction: StyledFunction<React.HTMLProps<U>>): StyledFunction<T & React.HTMLProps<U>> {
// 	return styledFunction;
// }

export type Class = { course: string; name: string; grade: string };

export interface MainProps {
  courses: Class[];
  open: boolean;
  linerWidth: number;
  sortWidth: number;
  openDetail: () => void;
}

// const MainDiv = styledComponentWithProps<MyProps, HTMLDivElement>(styled.div)`
const MainDiv = styled.div`
  margin-top: ${props => props.linerWidth}px;
  margin-left: ${props => props.sortWidth}px;
  width: calc(
    ${props => (props.open ? 50 : 100)}% - ${props => props.sortWidth}px
  );
`;

const Main: React.SFC<MainProps> = props => {
  return (
    <MainDiv>
      {props.courses.map((course, index) => (
        <ClassCard
          key={index}
          courseData={course}
          openDetail={props.openDetail}
        />
      ))}
    </MainDiv>
  );
};

export default Main;
