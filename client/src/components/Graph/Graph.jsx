import React, { useContext, useState } from 'react';
import UploadSqlSchema from '../UploadSqlSchema/UploadSqlSchema';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer'
import '../NodeSchema/schemavisualizer.scss';

function Graph() {
  const [sqlContents, setSqlContents] = useState([]);
  const [ graphName, setGraphName ] = useState();

  const handleUploadBtn = (content) => {
    setSqlContents([...sqlContents, content]);
  };

  return (
    <>
      <AuthorizedNavbar />
      <UploadSqlSchema />
    </>
  );
}

export default Graph;
