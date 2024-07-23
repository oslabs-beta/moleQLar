import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NodeDialog from './AddNodeDialog';
import { useTheme } from '../../contexts/ThemeContext';
import { useGraphContext } from '../../contexts/GraphContext.jsx';

import './nodelist.scss'; // styles

const NodeList = ({
  tables,
  onSelectTable,
  onDeleteTable,
  onAddNode,
  onEditNode,
  selectedTableId,
}) => {
  const [openTable, setOpenTable] = useState(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const { darkMode } = useTheme();
  const { graphName, setGraphName } = useGraphContext();
  const { graphId, setGraphId } = useGraphContext();
  //add primary keys state
  

  
  //console.log(tables);
  //filter out the current table from the results
  //console.log(tables.map(table => table.id + '.' + table.primaryKey));
  
  //console.log(primaryKeys);

  const handleSetPrimaryKeys = () => {
    //filter out current table
    setPrimaryKeys(tables.map(table => table.id + '.' + table.primaryKey))
    console.log(primaryKeys)
  }


  const handleClick = (tableId) => {
    setOpenTable(openTable === tableId ? null : tableId);
    onSelectTable(tableId);
  };

  const handleAddNode = (newNode) => {
    onAddNode(newNode);
  };

  const handleEditNode = (nodeId, updatedNode) => {
    onEditNode(nodeId, updatedNode);
    setIsNodeDialogOpen(false);
    setEditingNode(null);
  };

  const openEditDialog = (table) => {
    setEditingNode(table);
    setIsNodeDialogOpen(true);
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
      <div className='sidebar-top'>
        <h1 className='sidebar-heading'>{graphName}</h1>
        <List sx={{ flexGrow: 1 }}>
          {tables.map((table) => (
            <React.Fragment key={table.id}>
              <ListItem
                sx={{
                  backgroundColor:
                    selectedTableId === table.id
                      ? darkMode
                        ? '#333'
                        : '#e3f2fd'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: darkMode ? '#444' : '#f5f5f5',
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 1,
                }}
              >
                <ListItemText
                  primary={table.data.label}
                  onClick={() => handleClick(table.id)}
                  sx={{
                    color: darkMode ? '#fff' : '#000',
                    flexGrow: 1,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size='small'
                    onClick={() => openEditDialog(table)}
                    sx={{ p: 0.5, color: darkMode ? '#fff' : '#000' }}
                  >
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => onDeleteTable(table.id)}
                    sx={{ p: 0.5, color: darkMode ? '#fff' : '#000' }}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Box>
              </ListItem>
              <Collapse
                in={openTable === table.id}
                timeout='auto'
                unmountOnExit
              >
                <Box sx={{ margin: 1 }}>
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: darkMode ? '#333' : '#fff' }}
                  >
                    <Table size='small' aria-label='table attributes'>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: darkMode ? '#fff' : '#000' }}>
                            Name
                          </TableCell>
                          <TableCell sx={{ color: darkMode ? '#fff' : '#000' }}>
                            Type
                          </TableCell>
                          <TableCell sx={{ color: darkMode ? '#fff' : '#000' }}>
                            Constraints
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {table.data.columns.fields.map((column, index) => (
                          <TableRow key={index}>
                            <TableCell
                              component='th'
                              scope='row'
                              sx={{ color: darkMode ? '#fff' : '#000' }}
                            >
                              {column.name}
                            </TableCell>
                            <TableCell
                              sx={{ color: darkMode ? '#fff' : '#000' }}
                            >
                              {column.type}
                            </TableCell>
                            <TableCell
                              sx={{ color: darkMode ? '#fff' : '#000' }}
                            >
                              {column.required ? 'NOT NULL' : ''}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </div>

      <div className='sidebar-bottom'>
        <button
          className='btn-graph btn-add-node'
          // onclick function commented out until relationship
          onClick={() => setIsNodeDialogOpen(true)}
        >
          Add New Node
        </button>
        <NodeDialog
          open={isNodeDialogOpen}
          onClose={() => {
            setIsNodeDialogOpen(false);
            setEditingNode(null);
          }}
          onAddNode={handleAddNode}
          onEditNode={handleEditNode}
          editingNode={editingNode}
          darkMode={darkMode}
          primaryKeys={primaryKeys}
          handleSetPrimaryKeys={handleSetPrimaryKeys}
        />
      </div>
    </div>
  );
};

export default NodeList;
