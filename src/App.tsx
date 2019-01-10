import * as React from 'react';

export interface AppProps {
}
 
export interface AppState {
}
 
class App extends React.Component<AppProps, AppState> {
	render() { 
		return (<p>Hello from the app</p>);
	}
}
 
export default App;
