import * as React from 'react';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { Input } from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/SearchIcon'

export interface SearchBarProps {}
export interface SearchBarState {}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  render() {
    return (
      <React.Fragment>
        <InputBase placeholder="Search classes by name" />
        <IconButton aria-label="Search" />
      </React.Fragment>
    );
  }
}

export default SearchBar;
