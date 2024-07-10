import React, { useState } from "react";
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
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import './objecttypelist.scss';  // styles

const ObjectTypeList = ({
  tables,
  onSelectTable,
  onDeleteTable,
  selectedTableId,
}) => {
  const [openTable, setOpenTable] = useState(null);

  const handleClick = (tableId) => {
    setOpenTable(openTable === tableId ? null : tableId);
    onSelectTable(tableId);
  };


  // TODO - pull graph name from the database
  return (
    <div className='sidebar'>
      {/* <Typography variant="h2">Nodes</Typography> */}
      <div className="sidebar-top">
      <h1 className="sidebar-heading">Graph Name</h1>
        <List>
          {tables.map((table) => (
            <React.Fragment key={table.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDeleteTable(table.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  backgroundColor:
                    selectedTableId === table.id ? "#e3f2fd" : "transparent",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ListItemText
                  primary={table.data.label}
                  onClick={() => handleClick(table.id)}
                  sx={{
                    cursor: "pointer",
                    "& .MuiTypography-root": {
                      fontWeight:
                        selectedTableId === table.id ? "bold" : "normal",
                    },
                  }}
                />
                {openTable === table.id ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openTable === table.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="table attributes">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Constraints</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {table.data.columns.map((column, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {column.name}
                            </TableCell>
                            <TableCell>{column.type}</TableCell>
                            <TableCell>
                              {column.required ? "NOT NULL" : ""}
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
      <div className="sidebar-bottom">
        <button className='btn-graph btn-add-node'>Add Node</button>
        <button className='btn-graph btn-clear'>Clear</button>
      </div>
    </div>
  );
};

export default ObjectTypeList;
