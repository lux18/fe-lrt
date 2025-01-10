import React, { useState, useEffect } from "react";
import Sidebar from "../component/AdminSidebar";
import TableLaporan from "../component/tabelLaporan/TableLaporan";

const AdminLaporan = () => {
  return (
    <Sidebar>
      <TableLaporan role={"admin"} />
    </Sidebar>
  );
};

export default AdminLaporan;
