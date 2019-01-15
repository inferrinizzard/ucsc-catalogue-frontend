import * as React from 'react';
import styled, { ThemedStyledFunction } from 'styled-components';
import ClassCard from './ClassCard';

// function styledComponentWithProps<T, U extends HTMLElement = HTMLElement>(styledFunction: StyledFunction<React.HTMLProps<U>>): StyledFunction<T & React.HTMLProps<U>> {
// 	return styledFunction;
// }

export type Class = { course: string; name: string; grade: string };

export interface MainProps {
  courses: Class[];
  openDetail: () => void;
}

export interface MainDivProps {
  open: boolean;
  linerWidth: number;
  drawerWidth: number;
}

// const MainDiv = styledComponentWithProps<MyProps, HTMLDivElement>(styled.div)`
const MainDiv = styled.div<MainDivProps>`
  margin-top: ${p => p.linerWidth as number}px;
  margin-left: ${p => p.drawerWidth as number}px;
  width: calc(
    ${p => ((p.open as boolean) ? 50 : 100)}% -
      ${p => p.drawerWidth as number}px
  );
`;

// const MainDiv = styled(MainDivCore)<any>``;

const Main: React.SFC<MainProps & MainDivProps> = props => {
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
