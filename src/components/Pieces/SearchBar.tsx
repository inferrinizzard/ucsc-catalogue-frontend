import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import SearchRounded from '@material-ui/icons/SearchRounded';

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
        InputProps={{
          endAdornment: <SearchRounded />,
          style: { paddingRight: '6px' },
        }}
        inputProps={{ style: { maxWidth: '172px' } }}
        style={{ padding: '0 .15em .15em' }}
      />
    </React.Fragment>
  );
};

export default SearchBar;
