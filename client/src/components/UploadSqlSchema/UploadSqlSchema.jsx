import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer';

import './uploadsqlschema.scss'  // styles 
import { useEffect } from 'react';  // for testing onDrop
import samplePgDump from '../algorithms/sample_pg_dump.sql';  // for testing onDrop
import { useTheme } from '../../contexts/ThemeContext';

const UploadSqlSchema = () => {
  const [sqlContents, setSqlContents] = useState([]);
  const { darkMode } = useTheme();

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

  // TODO - testing with sample node graph functionality
  // useEffect(() => {
  //   const blob = new Blob([samplePgDump], { type: "application/sql" });
  //   const mockFile = new File([blob], "mock.sql", {
  //     type: "application/sql",
  //   });
  //   onDrop([mockFile]);
  // }, []);

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
    <div className={`graph-container ${darkMode ? 'dark' : ''}`}>
      <div className={`drop-box ${isDragActive ? 'isDragActive' : ''} ${darkMode ? 'dark' : ''}`} {...getRootProps()}>
        <input className='drop-box-input' {...getInputProps()} />
        <Typography className={`drop-box-text ${darkMode ? 'dark' : ''}`}>
          {isDragActive
            ? 'Drop SQL files here'
            : '+ Click or drag to add SQL files'}
        </Typography>
      </div>

      <SchemaVisualizer sqlContents={sqlContents} />
    </div>
  );
};

export default UploadSqlSchema;