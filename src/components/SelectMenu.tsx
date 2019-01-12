import * as React from 'react';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export interface SelectMenuProps {}
export interface SelectMenuState {}
 
class SelectMenu extends React.Component<SelectMenuProps, SelectMenuState> {
	render() { 
		return (<React.Fragment>
			<List component="nav">
				<ListItem
					button
					aria-haspopup="true"
					aria-controls="lock-menu"
				>
					<ListItemText primary="Selected Option"/>
				</ListItem>
			</List>
			<Menu
			open={false}
			>
				<MenuItem
				>
				Course Name
				</MenuItem>
				<MenuItem
				>
				Number Enrolled
				</MenuItem>
				<MenuItem
				>
				Grade Average
				</MenuItem>
				<MenuItem
				>
				Prof Rating
				</MenuItem>
			</Menu>
		</React.Fragment>);
	}
}
 
export default SelectMenu;