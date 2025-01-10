import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./user/UserPage";
import axios from "axios";
import "./App.css";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLaporan from "./admin/AdminLaporan";
import logo from "./staticAssets/logolrt.png";
import { FaUser } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";

axios.defaults.baseURL =
  "https://be-eocdhkk8a-iwaldi-putras-projects.vercel.app";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-md navbar-light bg-light px-3">
          <a className="navbar-brand" href="/">
            <img src={logo} className="imgLogo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item ">
                <a className="nav-link d-flex align-items-center" href="/">
                  <FaUser style={{ width: "20px" }} size={12} /> User
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center"
                  href="/admin-dashboard"
                >
                  <RiCustomerServiceFill style={{ width: "20px" }} size={16} />{" "}
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <br />
        <div>
          <Routes>
            <Route path="/" element={<User />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-laporan" element={<AdminLaporan />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
