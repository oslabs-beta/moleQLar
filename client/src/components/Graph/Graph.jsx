import React, { useContext, useState } from 'react';
import UploadSqlSChemaPage from '../UploadSqlSchema/UploadSqlSchema';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';

function Graph() {
  return (
    <>
      <AuthorizedNavbar />
      <UploadSqlSChemaPage />
    </>
  );
}

export default Graph;
