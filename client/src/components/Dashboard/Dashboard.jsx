import React, { useContext, useState } from 'react';
import UploadSqlSChemaPage from "../UploadSqlSchema/UploadSqlSChemaPage";
import LoggedinNavbar from '../LoggedinNav/AuthorizedNavbar';

function Dashboard() {
  return (
    <>
      <LoggedinNavbar/>
      <UploadSqlSChemaPage />
    </>
  );
}

export default Dashboard;