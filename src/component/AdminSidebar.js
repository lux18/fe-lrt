import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoFileTrayStacked, IoGrid } from "react-icons/io5";

const Sidebar = ({ children }) => {
  return (
    <div className="container-fluid ">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light sidebarNav">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-2 pt-2 text-white min-vh-100">
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start py-3"
              id="menu"
            >
              <li className="nav-item d-flex mb-1">
                <a
                  href="/admin-dashboard"
                  className="nav-link align-items-center d-flex px-0"
                >
                  <div>
                    <IoGrid size={20} className="mx-auto d-flex" />
                    <div className="text-icon">Dashboard</div>
                  </div>
                  <span className="ms-3 me-2 d-none d-sm-inline">
                    Dashboard{" "}
                  </span>
                </a>
              </li>
              <li className="nav-item d-flex mb-1">
                <a
                  href="/admin-laporan"
                  className="nav-link align-items-center d-flex px-0"
                >
                  <div>
                    <IoFileTrayStacked size={20} className="mx-auto d-flex" />
                    <div className="text-icon">Laporan</div>
                  </div>
                  <span className="ms-3 me-2 d-none d-sm-inline">Laporan </span>
                </a>
              </li>
            </ul>
            <hr />
          </div>
        </div>

        {/* Content area (children will be rendered here) */}
        <div className="col py-3 contentAdmin">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
