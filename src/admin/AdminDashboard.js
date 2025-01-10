import React, { useState, useEffect } from "react";
import Sidebar from "../component/AdminSidebar";
import Chart from "../component/dashboard/Chart";
import axios from "axios";

const AdminDashboard = () => {
  const [count, setCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalBantuan, setTotalBantuan] = useState(0);
  const [bantuanByProgram, setBantuanByProgram] = useState({});

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports/chart");
      const reports = response.data.data.rows;

      setCount(response.data.data.count);

      const totalBantuanValue = reports.reduce((acc, report) => {
        const bantuan = parseFloat(report.jumlahPenerima);
        if (!isNaN(bantuan)) {
          acc += bantuan;
        }
        return acc;
      }, 0);
      setTotalBantuan(totalBantuanValue);

      const approvedData = reports.filter(
        (report) => report.status === "Disetujui",
      );
      setApprovedCount(approvedData.length);

      const rejectedData = reports.filter(
        (report) => report.status === "Ditolak",
      );
      setRejectedCount(rejectedData.length);

      const groupedByProgram = reports.reduce((acc, report) => {
        const program = report.namaProgram;
        const bantuan = parseFloat(report.jumlahPenerima) || 0;
        acc[program] = (acc[program] || 0) + bantuan;
        return acc;
      }, {});
      setBantuanByProgram(groupedByProgram);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Sidebar>
      <div className="mt-4">
        <div className="row g-3">
          <div className="col-xl-3 col-12 col-sm-12 col-md-6 col-lg-6 mb-3 mt-0">
            <div className="cardDashboard2">
              <h5 className="mt-2 titleDashboard1 text-light">
                Total Laporan Masuk
              </h5>
              <h2 className="mb-2 text-light">{count}</h2>
            </div>
          </div>
          <div className="col-xl-3 col-12 col-sm-12 col-md-6 col-lg-6 mb-3 mt-0">
            <div className="cardDashboard2">
              <h5 className="mt-2 titleDashboard1 text-light">Total Bantuan</h5>
              <h2 className="mb-2 text-light">{totalBantuan}</h2>
            </div>
          </div>
          <div className="col-xl-3 col-12 col-sm-12 col-md-6 col-lg-6 mb-3 mt-0">
            <div className="cardDashboard2">
              <h5 className="mt-2 titleDashboard1 text-light">
                Laporan Disetujui
              </h5>
              <h2 className="mb-2 text-light">{approvedCount}</h2>
            </div>
          </div>
          <div className="col-xl-3 col-12 col-sm-12 col-md-6 col-lg-6 mb-3 mt-0">
            <div className="cardDashboard2">
              <h5 className="mt-2 titleDashboard1 text-light">
                Laporan Ditolak
              </h5>
              <h2 className="mb-2 text-light">{rejectedCount}</h2>
            </div>
          </div>
        </div>
        <div className="cardDashboard mb-3 p-3">
          <h5 className="titleDashboard mb-1">Program Bantuan Sosial</h5>
          <p style={{ fontSize: "14px", opacity: "60%" }} className="mb-3">
            Jumlah penerima bantuan per program
          </p>

          <div className="row w-100">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 mb-2">
              <div className="cardDashboard3 w-100">
                <p className="textCardDashboard3">Program BLT</p>
                <p className="textCardDashboard3Body">
                  {bantuanByProgram && bantuanByProgram.BLT
                    ? bantuanByProgram.BLT
                    : 0}
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 mb-2">
              <div className="cardDashboard3 w-100">
                <p className="textCardDashboard3">Program BPNT</p>
                <p className="textCardDashboard3Body">
                  {bantuanByProgram && bantuanByProgram.BPNT
                    ? bantuanByProgram.BPNT
                    : 0}
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 mb-2">
              <div className="cardDashboard3 w-100">
                <p className="textCardDashboard3">Program JSP</p>
                <p className="textCardDashboard3Body">
                  {bantuanByProgram && bantuanByProgram.JSP
                    ? bantuanByProgram.JSP
                    : 0}
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 mb-2">
              <div className="cardDashboard3 w-100">
                <p className="textCardDashboard3">Program PHK</p>
                <p className="textCardDashboard3Body">
                  {bantuanByProgram && bantuanByProgram.PHK
                    ? bantuanByProgram.PHK
                    : 0}
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 mb-2">
              <div className="cardDashboard3 w-100">
                <p className="textCardDashboard3">Program PBIN</p>
                <p className="textCardDashboard3Body">
                  {bantuanByProgram && bantuanByProgram.PBIN
                    ? bantuanByProgram.PBIN
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Chart />
      </div>
    </Sidebar>
  );
};

export default AdminDashboard;
