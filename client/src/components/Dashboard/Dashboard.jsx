import React, { useContext, useState } from 'react';
import UploadSqlSchema from "../UploadSqlSchema/UploadSqlSchema";
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';

function Dashboard() {
  return (
    <>
      <AuthorizedNavbar/>
      <UploadSqlSchema />
    </>
  );
}

export default Dashboard;