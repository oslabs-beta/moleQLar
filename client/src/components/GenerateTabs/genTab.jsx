import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab, ButtonGroup } from '@mui/material';
import '../NodeSchema/schemavisualizer.scss'


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="TypeDef" {...a11yProps(0)} />
          <Tab label="Resolver" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        TypeDef
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Resolver
      </CustomTabPanel>
    </Box>
  );
}

const GenerateTab = ({open,onClose}) => {
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <div>
    {/* <Button onClick={handleClickOpen}>
      Generate
    </Button> */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Tabs</DialogTitle>
        <DialogContent>
          <BasicTabs />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    
    </div>
  );
}

export default GenerateTab;