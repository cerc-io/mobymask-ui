import { Link } from '@mui/material'

import Button from './Button';

export const InstallFlaskButton = () => (
  <Button
    marginTop="20px"
    color="#fff"
    borderRadius="100px"
    padding="12px 20px"
    style={{
      background: "linear-gradient(90deg, #334FB8 0%, #1D81BE 100%)",
    }}
    label="Install MetaMask Flask"
    component={Link}
    href="https://metamask.io/flask/"
    target="_blank"
  ></Button>
);

export const ConnectButton = (props) => {
  return (
    <Button
      marginTop="20px"
      color="#fff"
      borderRadius="100px"
      padding="12px 20px"
      style={{
        background: "linear-gradient(90deg, #334FB8 0%, #1D81BE 100%)",
      }}
      label="Connect Snap"
      {...props}
    />
  );
};

export const ReconnectButton = (props) => {
  return (
    <Button
      marginTop="20px"
      color="#fff"
      borderRadius="100px"
      padding="12px 20px"
      style={{
        background: "linear-gradient(90deg, #334FB8 0%, #1D81BE 100%)",
      }}
      label="Reconnect Snap"
      {...props}>
    </Button>
  );
};
