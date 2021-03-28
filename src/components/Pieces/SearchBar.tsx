import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import SearchRounded from '@material-ui/icons/SearchRounded';

import { isMobileOnly } from 'react-device-detect';

export interface SearchBarProps {
	search: (name: string) => void;
}

const SearchBar: React.SFC<SearchBarProps> = props => {
	return (
		<TextField
			variant="outlined"
			label="Search"
			placeholder="Search class by name"
			onChange={event => props.search(event.target.value.toUpperCase())}
			InputProps={{
				endAdornment: <SearchRounded />,
				style: {
					paddingRight: '6px',
					width: isMobileOnly ? '80vw' : undefined,
				},
			}}
			style={{
				padding: '0 .15em .15em',
				marginTop: '3px',
				marginLeft: '5px',
				width: isMobileOnly ? '83vw' : undefined,
				display: isMobileOnly ? 'inline' : undefined,
			}}
		/>
	);
};

export default SearchBar;
