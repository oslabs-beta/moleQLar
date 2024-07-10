import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const NodeDialog = ({
  open,
  onClose,
  onAddNode,
  onEditNode,
  editingNode = null,
}) => {
  const [nodeName, setNodeName] = useState("");
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    name: "",
    type: "String",
    required: false,
  });

  useEffect(() => {
    if (editingNode) {
      setNodeName(editingNode.data.label);
      setFields(
        editingNode.data.columns.map((col) => ({
          name: col.name,
          type: col.type,
          required: col.required,
        }))
      );
    } else {
      setNodeName("");
      setFields([]);
    }
  }, [editingNode]);

  const handleAddField = () => {
    if (newField.name) {
      setFields([...fields, newField]);
      setNewField({ name: "", type: "String", required: false });
    }
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleEditField = (index) => {
    setNewField(fields[index]);
    handleRemoveField(index);
  };

  const handleSubmit = () => {
    if (nodeName && fields.length > 0) {
      const nodeData = { name: nodeName, fields };
      if (editingNode) {
        onEditNode(editingNode.id, nodeData);
      } else {
        onAddNode(nodeData);
      }
      setNodeName("");
      setFields([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingNode ? "Edit Node" : "Add New Node"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Node Name"
          fullWidth
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          sx={{ mb: 3 }}
        />
        <List>
          {fields.map((field, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={field.name}
                secondary={`${field.type}${
                  field.required ? " (NOT NULL)" : ""
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEditField(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleRemoveField(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Field Name"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select-label"
                value={newField.type}
                onChange={(e) =>
                  setNewField({ ...newField, type: e.target.value })
                }
                label="Type"
              >
                <MenuItem value="Int">Int</MenuItem>
                <MenuItem value="Float">Float</MenuItem>
                <MenuItem value="String">String</MenuItem>
                <MenuItem value="Boolean">Boolean</MenuItem>
                <MenuItem value="ID">ID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
                />
              }
              label="NOT NULL"
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddField}
              startIcon={<AddIcon />}
              fullWidth
            >
              Add Field
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingNode ? "Save Changes" : "Add Node"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
