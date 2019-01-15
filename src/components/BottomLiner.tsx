import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

export interface BottomLinerProps {
  open: boolean;
  openLiner: () => void;
  closeLiner: () => void;
}

const Liner = styled.div`
  width: 100%;
  background: #5d92dd;
  z-index: 1201;
  position: fixed;
  bottom: 0;
`;

const BottomLiner: React.SFC<BottomLinerProps> = props => {
  return (
    <Liner>
      <Button
        size="small"
        onClick={props.open ? props.closeLiner : props.openLiner}
        fullWidth={true}
      >
        <Typography>About</Typography>
      </Button>
      <Collapse in={props.open}>
        <Typography>Content</Typography>
      </Collapse>
    </Liner>
  );
};

export default BottomLiner;
