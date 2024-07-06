import React, { useContext, useState } from 'react';
import UploadSqlSChemaPage from "../UploadSqlSchema/UploadSqlSChemaPage";
import LoggedinNavbar from '../AuthorizedNavbar/AuthorizedNavbar';

function Dashboard() {
  return (
    <>
      <AuthorizedNavbar/>
      <UploadSqlSChemaPage />
    </>
  );
}

export default Dashboard;