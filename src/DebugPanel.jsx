import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Metrics, DebugInfo, PeerNetwork } from "@cerc-io/react-peer";

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
          padding: "4px",
          border: '1px solid black'
        },
      },
    }
  },
});

export default function DebugPanel(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
          sx={{
            overflow: "auto",
            padding: 1 / 2,
            marginBottom: "-56px",
            maxHeight: "50vh",
            border: "4px double black"
          }}
        >
          <Fab
            onClick={() => setAnchorEl(null)}
            sx={closeFabStyle}
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </Fab>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList sx={{ minHeight: 32 }} onChange={handleChange} aria-label="debug panel tabs">
                <Tab sx={{ padding: 1/2, minHeight: 32 }} label="Peers" value="1" />
                <Tab sx={{ padding: 1/2, minHeight: 32 }} label="Metrics" value="2" />
                <Tab sx={{ padding: 1/2, minHeight: 32 }} label="Graph" value="3" />
              </TabList>
            </Box>
            <TabPanel sx={{ padding: 0 }} value="1">
              <DebugInfo sx={{ marginTop: 1 }} />
            </TabPanel>
            <TabPanel sx={{ padding: 0 }} value="2">
              <Metrics />
            </TabPanel>
            <TabPanel sx={{ padding: 0 }} value="3">
              <PeerNetwork />
            </TabPanel>
          </TabContext>
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
  )
}
