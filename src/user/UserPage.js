import React, { useState, useEffect } from "react";
import TableLaporan from "../component/tabelLaporan/TableLaporan";

const User = () => {
  return (
    <div className="px-3 mt-4">
      <TableLaporan role={"user"} />
    </div>
  );
};

export default User;
