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
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import NodeDialog from "./AddNodeDialog";

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
    <Box
      sx={{
        width: "300px",
        height: "100%",
        overflowY: "auto",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        {tables.map((table) => (
          <React.Fragment key={table.id}>
            <ListItem
              sx={{
                backgroundColor:
                  selectedTableId === table.id ? "#e3f2fd" : "transparent",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pr: 1,
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
                  flexGrow: 1,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  size="small"
                  onClick={() => openEditDialog(table)}
                  sx={{ p: 0.5 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDeleteTable(table.id)}
                  sx={{ p: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                {openTable === table.id ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </Box>
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsNodeDialogOpen(true)}
        sx={{ margin: 2 }}
      >
        Add New Node
      </Button>
      <NodeDialog
        open={isNodeDialogOpen}
        onClose={() => {
          setIsNodeDialogOpen(false);
          setEditingNode(null);
        }}
        onAddNode={handleAddNode}
        onEditNode={handleEditNode}
        editingNode={editingNode}
      />
    </Box>
  );
};

export default NodeList;
