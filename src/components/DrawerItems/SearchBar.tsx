import React from 'react';

import TextField from '@material-ui/core/TextField';
import SearchRounded from '@material-ui/icons/SearchRounded';

import { isMobileOnly } from 'react-device-detect';

export interface SearchBarProps {
	search: (name: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search }) => {
	return (
		<TextField
			variant="outlined"
			label="Search"
			placeholder="Search class by name"
			onChange={e => search(e.target.value.toUpperCase().trim())}
			InputProps={{
				endAdornment: <SearchRounded />,
				style: { paddingRight: '6px', width: isMobileOnly ? '80vw' : undefined },
			}}
			style={{
				padding: '0 .15em .15em',
				display: isMobileOnly ? 'inline-block' : undefined,
			}}
		/>
	);
};

export default SearchBar;
