import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab, ButtonGroup } from '@mui/material';
import '../NodeSchema/schemavisualizer.scss'
import schemaGenerator from '../algorithms/schema_generator';
import resolverGenerator from '../algorithms/resolver_generator';
import './gentab.scss'



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

function BasicTabs({generatedSchema, generatedResolver}) {
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
        <h1>TypeDefs</h1>
        {generatedSchema.map((item, index) => (
          <div key={index}>
            <h3>{`${item}`}</h3>
          </div>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <h1>Resolver</h1>
        {generatedResolver.map((item, index) => (
          <div key={index}>
            <h3>{`${item}`}</h3>
          </div>
        ))}
      </CustomTabPanel>
    </Box>
  );
}

const GenerateTab = ({open, onClose, nodes, edges}) => {
  // Storing ER of Schema Generator Function

  let generatedSchemaData = [];
  if(open) generatedSchemaData = schemaGenerator(nodes, edges);
  // Storing ER of Resolver Generator Function
  let generatedResolverData = [];
  if(open) generatedResolverData = resolverGenerator(nodes, edges);

  //  const [generatedSchemaData, setGeneratedSchemaData] = useState(null);
  //  const [generatedResolverData, setGeneratedResolverData] = useState(null);

  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // useEffect(() => {
  //   // if(open && nodes && nodes.length > 0) {
  //   //   console.log('test')
  //     const schemaData = schemaGenerator(nodes, edges);
  //     setGeneratedSchemaData(schemaData);
  //     const resolverData = resolverGenerator(nodes, edges);
  //     setGeneratedResolverData(resolverData);
  //   // }

  // }, [open, nodes, edges])

  if(!open) return null;

  return (
    <div>
    {/* <Button onClick={handleClickOpen}>
      Generate
    </Button> */}
    {/* maxWidth="md" fullWidth */}
      <button>Hello</button>
      <Dialog open={open} onClose={onClose} >
        <DialogTitle>Tabs</DialogTitle>
        <DialogContent>
          <BasicTabs 
            generatedSchema={generatedSchemaData}
            generatedResolver={generatedResolverData} 
          />
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