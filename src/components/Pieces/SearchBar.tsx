import * as React from 'react';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Input } from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/SearchIcon'

export interface SearchBarProps {
  search: (name: string) => void;
}

const SearchBar: React.SFC<SearchBarProps> = props => {
  return (
    <React.Fragment>
      <TextField
        variant="outlined"
        label="Search"
        placeholder="Search classes by name"
        onChange={event => props.search(event.target.value.toUpperCase())}
      />
      {/* <InputBase placeholder="Search classes by name" /> */}
    </React.Fragment>
  );
};

export default SearchBar;
