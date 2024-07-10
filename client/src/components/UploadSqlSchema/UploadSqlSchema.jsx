import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer';

const UploadSqlSchema = () => {
  const [sqlContents, setSqlContents] = useState([]);

  // onDrop is called when a file is dropped
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSqlContents((prevContents) => [...prevContents, e.target.result]);
      };
      reader.readAsText(file);
    });
  }, []);

  // useDropzone is to set up the drag and drop functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/sql': ['.sql'],
      'text/plain': ['.sql'],
    },
    multiple: true,
  });

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#e3f2fd' : 'white',
          border: '2px dashed #1976d2',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? 'Drop SQL files here'
            : '+ Click or drag to add SQL files'}
        </Typography>
      </Paper>
      {/* {sqlContents.length} */}
      {sqlContents.length > 0 && (
        <Box mt={3}>
          {/* <Typography variant="h6">Schema Visualization:</Typography> */}
          <SchemaVisualizer sqlContents={sqlContents} />
        </Box>
      )}
    </Box>
  );
};

export default UploadSqlSchema;