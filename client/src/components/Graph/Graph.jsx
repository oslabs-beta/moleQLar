import React, { useContext, useState } from 'react';
import UploadSqlSchema from '../UploadSqlSchema/UploadSqlSchema';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';

function Graph() {
  return (
    <>
      <AuthorizedNavbar />
      <UploadSqlSchema />
    </>
  );
}

export default Graph;
