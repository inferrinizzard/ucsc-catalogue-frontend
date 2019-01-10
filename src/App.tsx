import * as React from 'react';
import styled from 'styled-components';

const Liner = styled.div`
	background:blue;
`;

export interface AppProps {
}
 
export interface AppState {
}
 
class App extends React.Component<AppProps, AppState> {
	render() { 
		return (<Liner>Hello from the app</Liner>);
	}
}
 
export default App;
