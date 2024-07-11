import React, { useContext, useState } from 'react';
import UploadSqlSchema from '../UploadSqlSchema/UploadSqlSchema';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer'
import '../NodeSchema/schemavisualizer.scss';

function Graph() {
  const [sqlContents, setSqlContents] = useState([]);

  const handleUploadBtn = (content) => {
    setSqlContents([...sqlContents, content]);
  };

  return (
    <>
      <AuthorizedNavbar />
        <UploadSqlSchema />
      {/* <div style={{width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
        <SchemaVisualizer sqlContents={sqlContents} handleUploadBtn={handleUploadBtn} />
      </div> */}
    </>
  );
}

export default Graph;
