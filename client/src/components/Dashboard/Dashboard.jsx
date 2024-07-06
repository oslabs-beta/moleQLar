import React, { useContext, useState } from 'react';
import UploadSqlSchemaPage from "../UploadSqlSchema/UploadSqlSchemaPage";
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';

function Dashboard() {
  return (
    <>
      <AuthorizedNavbar/>
      <UploadSqlSchemaPage />
    </>
  );
}

export default Dashboard;