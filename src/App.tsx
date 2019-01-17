import * as React from 'react';
import styled from 'styled-components';

import Main from './components/Main';
import SortDrawer from './components/SortDrawer';
import CourseDrawer from './components/CourseDrawer';
import BottomLiner from './components/BottomLiner';

const Liner = styled.div`
  width: 100%;
  background: #5d92dd;
  z-index: 1201;
	position: fixed;
  top: 0;
`;

const drawerWidth = 300;
const linerWidth = 30;

export interface AppProps {}
export interface AppState {
  courses: Class[];
	drawerOpen: boolean;
	linerWidth: number;
	drawerWidth: number;
	linerOpen: boolean;
}

export type Class = { course: string; name: string; grade: string };

class App extends React.Component<AppProps, AppState> {
  state = {
    courses: [
      { course: 'AMS 3', name: 'smth', grade: 'C' },
      { course: 'AMS 5', name: 'Statistics', grade: 'B' },
      { course: 'AMS 7', name: 'smth else', grade: 'A' },
    ],
		drawerOpen: false,
		linerWidth: 30,
		drawerWidth: 300,
		linerOpen: false,
  };

  sortCourses = (type: number) => {
    let courseTemp: Class[] = ([] as Class[]);
    switch (type) {
      case 0:
        courseTemp.concat(this.state.courses)
          .sort((a: Class, b: Class) =>
            a.course > b.course ? 1 : a.course < b.course ? -1 : 0
          );
        break;
      case 2:
        courseTemp.concat(this.state.courses)
          .sort((a: Class, b: Class) =>
            a.grade > b.grade ? 1 : a.grade < b.grade ? -1 : 0
          );
        break;
      default:
        courseTemp = this.state.courses;
        break;
    }
    this.setState({ ...this.state, courses: courseTemp });
  };

  openDetail = () => {
    this.setState({
      ...this.state,
      drawerOpen: true,
    });
  };

  closeDetail = () => {
    this.setState({
      ...this.state,
      drawerOpen: false,
    });
	};

  openLiner = () => {
    this.setState({
      ...this.state,
      linerOpen: true,
    });
  };

  closeLiner = () => {
    this.setState({
      ...this.state,
      linerOpen: false,
    });
	};
	
	setDrawerWidth = (val:number) =>{
		this.setState({...this.state, drawerWidth:val});
	}

  render() {
    return (
      <React.Fragment>
        <Liner>UCSC-Catalogue</Liner>
        <div>
					<SortDrawer 
						sort={this.sortCourses} 
						open={!this.state.drawerOpen} 
						setDrawerWidth={this.setDrawerWidth}
					/>
          <Main
            courses={this.state.courses}
            open={this.state.drawerOpen}
            linerWidth={this.state.linerWidth}
            drawerWidth={this.state.drawerWidth}
						openDetail={this.openDetail}
          />
          <CourseDrawer
            open={this.state.drawerOpen}
            closeDetail={this.closeDetail}
          />
        </div>
				<BottomLiner 
					open={this.state.linerOpen} 
					openLiner={this.openLiner}
					closeLiner={this.closeLiner}
				>About</BottomLiner>
      </React.Fragment>
    );
  }
}

export default App;
