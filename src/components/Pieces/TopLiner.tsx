import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

export interface TopLinerProps {
  open: boolean;
  openAbout: () => void;
  closeAbout: () => void;
  height: number;
}

const Liner = styled.div`
  width: 100%;
  background: #5d92dd;
  z-index: 1201;
  position: fixed;
  top: 0;
`;

const TopLiner: React.SFC<TopLinerProps> = props => {
  return (
    <Liner>
      <span>
        <Typography
          style={{
            height: props.height + 'px',
            display: 'inline',
          }}
        >
          CruzAssist
        </Typography>
      </span>
      <span style={{ float: 'right' }}>
        <Button
          size="small"
          onClick={props.open ? props.closeAbout : props.openAbout}
        >
          <Typography>About</Typography>
        </Button>
      </span>
      <Collapse in={props.open}>
        <Typography>Made by Sean Song and Shun Kashiwa</Typography>
        <Typography>Data provided by slugsurvival</Typography>
      </Collapse>
    </Liner>
  );
};

export default TopLiner;
