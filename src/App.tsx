import * as React from 'react';
import styled from 'styled-components';
import ClassCard from './components/ClassCard'
import Drawer from '@material-ui/core/Drawer'

const Liner = styled.div`
	width: 100%;
	background: #5d92dd;
	z-index: 1201;
	position: fixed;
`;

const TopLiner = styled(Liner)`top: 0;`;
const BottomLiner = styled(Liner)`bottom: 0;`;

const drawerWidth = 240;
const linerWidth = 30;

const Main = styled.div`
	margin-top: ${linerWidth}px;
	margin-left: ${drawerWidth}px;
	width: calc(100% - ${drawerWidth}px);
`;

export interface AppProps {}
 
export interface AppState {}
 
class App extends React.Component<AppProps, AppState> {
	render() { 
		return (<React.Fragment>
			<TopLiner>UCSC-Catalogue</TopLiner>
			<div>
				<Drawer open={true} variant="permanent">
					<h2>sorting</h2>
				</Drawer>
				<Main>
					<ClassCard />
					<ClassCard />
				</Main>
				<Drawer anchor="right" variant="persistent">
					<h2>depth</h2>
				</Drawer>
			</div>
			<BottomLiner>About</BottomLiner>
			</React.Fragment>);
	}
}
 
export default App;
