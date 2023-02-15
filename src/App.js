import React, { useCallback } from "react";
import { HashRouter } from "react-router-dom";
import { ethers } from 'ethers';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PeerContext, Metrics, DebugInfo } from "@cerc-io/react-peer";
import logo from "./logo.svg";
import "./installBuffer";
import QueryParamsRoute from "./RoutableArea";
import "./App.css";
import { MESSAGE_KINDS, MOBYMASK_TOPIC } from "./constants";
const { abi:PhisherRegistryABI } = require("./artifacts");

const contractInterface = new ethers.utils.Interface(PhisherRegistryABI);

const debugFabStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
};

const closeFabStyle = {
  position: 'absolute',
  top: 8,
  right: 8
}

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        sizeSmall: {
          padding: "4px"
        },
      },
    }
  },
});

function App() {
  const peer = React.useContext(PeerContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleTopicMessage = useCallback((peerId, data) => {
    console.log("Received a message on mobymask P2P network from peer:", peerId.toString());
    const { kind, message } = data;

    switch (kind) {
      case MESSAGE_KINDS.INVOKE: {
        console.log("Signed invocations:");
        console.log(JSON.stringify(message, null, 2));

        const [{ invocations: { batch: invocationsList } }] = message;
        Array.from(invocationsList).forEach(invocation => {
          const txData = invocation.transaction.data;
          const decoded = contractInterface.parseTransaction({ data: txData });

          console.log(`method: ${decoded.name}, value: ${decoded.args[0]}`);
        });

        break;
      }
    
      case MESSAGE_KINDS.REVOKE: {
        const { signedDelegation, signedIntendedRevocation } = message;
        console.log("Signed delegation:");
        console.log(JSON.stringify(signedDelegation, null, 2));
        console.log("Signed intention to revoke:");
        const stringifiedSignedIntendedRevocation = JSON.stringify(
          signedIntendedRevocation,
          (key, value) => {
            if (key === 'delegationHash' && value.type === 'Buffer') {
              // Show hex value for delegationHash instead of Buffer
              return ethers.utils.hexlify(Buffer.from(value));
            }

            return value;
          },
          2
        )
        console.log(stringifiedSignedIntendedRevocation);

        break;
      }

      default:
        break;
    }

    console.log('------------------------------------------')
  }, []);

  React.useEffect(() => {
    if (peer) {
      const unsubscribe = peer.subscribeTopic(MOBYMASK_TOPIC, handleTopicMessage);

      return unsubscribe;
    }
  }, [peer, handleTopicMessage]);

  return (
    <div className="App">
      <header className="App-header">

        <div className="logo-bar">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>
            MobyMask
          </h1>
        </div>

        {/* Based on https://codepen.io/goodkatz/pen/LYPGxQz?editors=1100 */}
        <div class="waves">
          <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g class="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
          </svg>
          <p>An alliance of good-hearted phish, aiming to eliminate phishers.</p>
        </div>

      </header>

      <HashRouter>
        <QueryParamsRoute />
      </HashRouter>

      <div className="footer">
        <p>Reporters are added on an invite-only basis.</p>
        <p>
          <a href="https://mirror.xyz/0x55e2780588aa5000F464f700D2676fD0a22Ee160/8whNch3m5KMzeo6g5eblcXMMplPf8UpW228cSh3nmzg">
            Learn more
          </a>
        </p>
        <p>
          <a href="https://github.com/danfinlay/MobyMask/">Fork on GitHub</a>
        </p>
      </div>
      <ThemeProvider theme={theme}>
        <Box height={Boolean(anchorEl) ? '50vh' : 0} />
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="top-end"
          keepMounted
          sx={{
            width: 'calc(100% - 32px)',
            zIndex: 2
          }}
        >
          <Paper
            variant="outlined"
            elevation={12}
            sx={{
              overflow: "auto",
              padding: 1/2,
              marginBottom: "-56px",
              maxHeight: "50vh",
              border: "4px double black"
            }}
          >
            <Box
            >
              <Fab
                onClick={() => setAnchorEl(null)}
                sx={closeFabStyle}
                aria-label="close"
                size="small"
              >
                <CloseIcon />
              </Fab>
              <DebugInfo />
              <Metrics />
            </Box>
          </Paper>
        </Popper>
        <Fab
          color="primary"
          onClick={event => setAnchorEl(event.currentTarget)}
          sx={{
            ...debugFabStyle,
            ...(Boolean(anchorEl) ? { zIndex: 1 } : {})
          }}
          disabled={Boolean(anchorEl)}
          aria-label="debug"
        >
          <BugReportIcon />
        </Fab>
      </ThemeProvider>
    </div>
  );
}

export default App;
