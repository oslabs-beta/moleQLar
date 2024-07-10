import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer';
import { red } from '@mui/material/colors';

import './uploadsqlschema.scss' // styles

const UploadSqlSchema = () => {
  const [sqlContents, setSqlContents] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);

  // onDrop is called when a file is dropped
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSqlContents((prevContents) => [...prevContents, e.target.result]);
      };
      reader.readAsText(file);
    });
    // hide overlay
    setOverlayVisible(false);
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

  // upload SQL button functionality
  const handleUploadBtn = (e) => {
    e.preventDefault();
    // toggle state
    setOverlayVisible(true);
  }

  const handleOverlayClick =() => {
    // toggle state
    setOverlayVisible(false);
  }

  return (
    <div className='graph-container'>
      
      <SchemaVisualizer handleUploadBtn={handleUploadBtn} handleOverlayClick={handleOverlayClick} sqlContents={sqlContents} />
      
      <div className={`overlay ${overlayVisible ? '' : 'hidden'}`}
        onClick={handleOverlayClick}
      >
        <div className="drop-box-container">
          <div
            {...getRootProps()}
            className={isDragActive ? 'drop-box drag-active' : 'drop-box drag-inactive'}
          >
            <input className="drop-box-input" {...getInputProps()} />
            <p className='drop-box-text'>
              {isDragActive ? 'Drop SQL files here' : '+ Click or drag to add SQL files'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default UploadSqlSchema;
