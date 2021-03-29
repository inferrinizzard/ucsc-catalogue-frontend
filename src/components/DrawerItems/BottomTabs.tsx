import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Home from '@material-ui/icons/Home';

export interface BottomTabsProps {}

export interface BottomTabsState {}

class BottomTabs extends React.Component<BottomTabsProps, BottomTabsState> {
	state = {};
	render() {
		return (
			<div></div>
			// <Tabs value={1} component="div">
			// 	<Tab icon={<Home />} />
			// 	<Tab icon={<Home />} />
			// 	<Tab icon={<Home />} />
			// </Tabs>
		);
	}
}

export default BottomTabs;
