import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";
import { IoIosCloseCircle } from "react-icons/io";
import BuatLaporan from "./BuatLaporan";
import UpdateLaporan from "./UpdateLaporan";
import { Form, Modal } from "react-bootstrap";
import ExportFiles from "./ExportFile";
import { BiSort } from "react-icons/bi";

const TableLaporan = ({ role }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchWilayah, setSearchWilayah] = useState("");
  const [page, setPage] = useState(1);
  const [tempPage, setTempPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [roles, setRoles] = useState("");
  const [showBuatLaporan, setShowBuatLaporan] = useState(false);
  const [showUpdateLaporan, setShowUpdateLaporan] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [showCatatanModal, setShowCatatanModal] = useState(false);
  const [valBukti, setValBukti] = useState(false);
  const [valCatatan, setValCatatan] = useState(false);
  const [showketeranganditolak, setShowKeteranganditolak] = useState(false);
  const [valKeterangan, setValKeterangan] = useState(false);
  const [alasanDitolak, setAlasanDitolak] = useState("");
  const [dataWilayah, setDataWilayah] = useState([]);

  useEffect(() => {
    if (role && role !== "") {
      setRoles(role);
    }
    fetchProvinces();
  }, [role]);

  const fetchReports = async () => {
    setLoading(true);
    const params = {
      page,
      limit,
      namaProgram: searchName,
      wilayah: searchWilayah,
      sortField,
      sortOrder,
    };
    try {
      const response = await axios.get("/api/reports", { params });
      setReports(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, limit, searchName, sortField, sortOrder, searchWilayah]);

  const handleFilter = (value, type) => {
    if (type === "name") {
      setSearchName(value);
    } else if (type === "wilayah") {
      setSearchWilayah(value);
    }
    fetchReports();
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    console.log(`Sorting by ${field} in ${order} order`);
    setSortField(field);
    setSortOrder(order);
  };

  const handlePageInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTempPage(value);
    }
  };

  const handlePageBlur = () => {
    const value = Math.max(1, Math.min(totalPages, Number(tempPage) || 1));
    setPage(value);
    setTempPage(value);
  };

  const handleVerif = async (id, val) => {
    toast("Laporan diproses.");
    handleCloseKeterangan();

    try {
      const response = await axios.put(`/api/reports/${id}`, {
        status: val,
        keterangan: alasanDitolak,
      });

      if (val === "Disetujui") {
        toast.success("Laporan berhasil disetujui");
      } else {
        toast.success("Laporan berhasil ditolak");
      }

      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error.message);
      toast.error("Laporan gagal disetujui");
      handleCloseKeterangan();
    } finally {
      handleCloseKeterangan();
    }
  };

  const handledelete = async (id, val) => {
    try {
      const response = await axios.delete(`/api/reports/${id}`);
      toast.success("Laporan berhasil dihapus");

      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error.message);
      toast.error("Laporan gagal dihapus");
      fetchReports();
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (status) => {
    toast.success("Laporan berhasil dibuat");
    fetchReports();
  };

  const handleOpenUpdateLaporan = (id) => {
    setShowUpdateLaporan(true);
    setIdUpdate(id);
  };

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://kanglerian.github.io/api-wilayah-indonesia/api/provinces.json",
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setDataWilayah(data);
    } catch (error) {
      console.error("Error fetching provinces:", error.message);
    }
  };

  const handleAlasan = (e) => {
    const val = e.target.value;
    setAlasanDitolak(val);
  };

  const handleShowBukti = (val) => {
    setShowBuktiModal(true);
    setValBukti(val);
  };
  const handleCloseBukti = () => setShowBuktiModal(false);

  const handleShowCatatan = (val) => {
    setShowCatatanModal(true);
    setValCatatan(val);
  };
  const handleCloseCatatan = () => setShowCatatanModal(false);

  const handleShowKeterangan = (val) => {
    setShowKeteranganditolak(true);
    setValKeterangan(val);
    console.log(val);
  };

  const handleCloseKeterangan = () => setShowKeteranganditolak(false);

  return (
    <div>
      <ToastContainer />

      <BuatLaporan
        show={showBuatLaporan}
        handleClose={() => setShowBuatLaporan(false)}
        success={handleSuccess}
      />

      <UpdateLaporan
        show={showUpdateLaporan}
        handleClose={() => setShowUpdateLaporan(false)}
        success={handleSuccess}
        id={idUpdate}
      />

      <Modal show={showBuktiModal} onHide={handleCloseBukti}>
        <Modal.Header closeButton>
          <Modal.Title>Bukti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            className="imgLaporan mt-3"
            src={`https://be-eocdhkk8a-iwaldi-putras-projects.vercel.app/${valBukti}`}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseBukti}>
            Tutup
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCatatanModal} onHide={handleCloseCatatan}>
        <Modal.Header closeButton>
          <Modal.Title>Catatan Tambahan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {valCatatan === "" ? "Tidak ada Catatan Tambahan" : valCatatan}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseCatatan}>
            Tutup
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showketeranganditolak} onHide={handleCloseKeterangan}>
        <Modal.Header closeButton>
          <Modal.Title>Keterangan Laporan Ditolak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Group controlId="additionalNotes" className="mb-3">
              <Form.Label className="mb-1 labelInputBuatLaporan">
                Alasan Laporan Ditolak
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="selectedcatatanTambahan"
                type="text"
                onChange={handleAlasan}
              />
            </Form.Group>{" "}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseKeterangan}>
            Tutup
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleVerif(valKeterangan, "Ditolak")}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex align-items-center justify-content-between mb-3 mt-2">
        <div>
          <h3 className="mb-1 titleDaftarLaporan">Daftar Laporan</h3>
          <p className="mb-0 textDaftarLaporan">Bantuan Sosial</p>
        </div>
        <button
          className="btn btn-md btn-primary fw-semibold text-light"
          onClick={() => setShowBuatLaporan(true)}
        >
          Buat Laporan
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-12 col-lg-6">
          <input
            className="form-control form-control px-3 py-1 mb-0"
            type="text"
            placeholder="Cari Berdasarkan Nama Program"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setPage(1);
              setTempPage(1);
            }}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-lg-3">
          <Form.Group controlId="programType">
            <Form.Select
              name="selectedOption"
              className="from-control py-1"
              onChange={(e) => handleFilter(e.target.value, "name")}
            >
              <option value="">Filter Nama</option>
              <option value="PHK">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BLT">BLT</option>
              <option value="JPS">JPS</option>
              <option value="PBIN">PBIN</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-lg-3">
          <Form.Group controlId="programType">
            <Form.Select
              name="selectedOption"
              className="from-control py-1"
              onChange={(e) => handleFilter(e.target.value, "wilayah")}
            >
              <option value="">Filter Wilayah</option>

              {dataWilayah.map((province, index) => (
                <option key={index} value={province.name}>
                  {province.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      <div className="tableLrtOuter">
        <table className="w-100 tableLrt">
          <thead>
            <tr>
              <th>#</th>
              <th className="text-center">Aksi</th>
              <th onClick={() => handleSort("namaProgram")}>
                Nama <BiSort />
              </th>
              <th onClick={() => handleSort("wilayah")}>
                Wilayah <BiSort />
              </th>
              <th onClick={() => handleSort("jumlahPenerima")}>
                Jumlah <BiSort />
              </th>
              <th onClick={() => handleSort("tanggalPenyaluran")}>
                Tanggal <BiSort />
              </th>
              <th onClick={() => handleSort("email")}>
                Email <BiSort />
              </th>
              <th onClick={() => handleSort("status")}>
                Status <BiSort />
              </th>
              <th onClick={() => handleSort("tanggalPenyaluran")}>
                Keterangan <BiSort />
              </th>
              <th onClick={() => handleSort("tanggalPenyaluran")}>Bukti</th>
              <th onClick={() => handleSort("tanggalPenyaluran")}>Catatatan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={report.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      {roles && roles === "admin" ? (
                        <div className="d-flex align-items-center">
                          <div
                            className="mx-2"
                            style={{
                              borderRight: "1px solid grey",
                              height: "35px",
                            }}
                          ></div>

                          <div
                            onClick={() => handleVerif(report.id, "Disetujui")}
                            className="pointer d-flex flex-column justify-content-center align-items-center w-100 mx-2"
                            style={{
                              pointerEvents:
                                report.status !== "Pending" ? "none" : "auto",
                              opacity: report.status !== "Pending" ? 0.4 : 1,
                            }}
                          >
                            <GoCheckCircleFill
                              size={20}
                              className="tableIcon d-flex justify-content-center"
                              color="green"
                            />
                            <p
                              style={{ fontSize: "10px", color: "green" }}
                              className="mb-0 text-center"
                            >
                              Setujui
                            </p>
                          </div>

                          <div
                            onClick={() => handleShowKeterangan(report.id)}
                            className="pointer d-flex flex-column justify-content-center align-items-center w-100 mx-2"
                            style={{
                              pointerEvents:
                                report.status !== "Pending" ? "none" : "auto",
                              opacity: report.status !== "Pending" ? 0.4 : 1,
                            }}
                          >
                            <IoIosCloseCircle
                              size={23}
                              className="tableIcon d-flex justify-content-center"
                              color="red"
                            />
                            <p
                              style={{ fontSize: "10px", color: "red" }}
                              className="mb-0 text-center"
                            >
                              Tolak
                            </p>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className="mx-2"
                        style={{
                          borderRight: "1px solid grey",
                          height: "35px",
                        }}
                      ></div>

                      {roles && roles != "admin" ? (
                        <div className="d-flex align-items-center">
                          <div
                            onClick={() => handleOpenUpdateLaporan(report.id)}
                            className="pointer d-flex flex-column justify-content-center align-items-center w-100 mx-2"
                            style={{
                              pointerEvents:
                                report.status !== "Pending" ? "none" : "auto",
                              opacity: report.status !== "Pending" ? 0.4 : 1,
                            }}
                          >
                            <FaEdit
                              size={20}
                              className="tableIcon d-flex justify-content-center ms-1"
                            />
                            <p
                              style={{ fontSize: "10px", color: "black" }}
                              className="mb-0 text-center"
                            >
                              Edit
                            </p>
                          </div>

                          <div
                            className="pointer d-flex flex-column justify-content-center align-items-center w-100 mx-2"
                            style={{
                              pointerEvents:
                                report.status !== "Pending" ? "none" : "auto",
                              opacity: report.status !== "Pending" ? 0.4 : 1,
                            }}
                            onClick={() => handledelete(report.id)}
                          >
                            <MdDelete
                              size={24}
                              className="tableIcon d-flex justify-content-center"
                              color="orange"
                            />
                            <p
                              style={{ fontSize: "10px", color: "orange" }}
                              className="mb-0 text-center"
                            >
                              Hapus
                            </p>
                          </div>

                          <div
                            className="mx-2"
                            style={{
                              borderRight: "1px solid grey",
                              height: "35px",
                            }}
                          ></div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td>{report.namaProgram}</td>
                  <td style={{ minWidth: "350px" }}>{report.wilayah}</td>
                  <td>{report.jumlahPenerima}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(report.tanggalPenyaluran).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </td>
                  <td>{report.email ? report.email : "-"}</td>
                  <td>
                    <span
                      style={{
                        color:
                          report.status === "Disetujui"
                            ? "green"
                            : report.status === "Pending"
                            ? "gray"
                            : report.status === "Ditolak"
                            ? "red"
                            : "gray",
                        fontWeight: "500",
                      }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td
                    style={{ textTransform: "capitalize", minWidth: "200px" }}
                  >
                    {report.keterangan ? report.keterangan : "-"}
                  </td>
                  <td style={{ minWidth: "140px" }}>
                    <button
                      onClick={() => handleShowBukti(report.buktiPenyaluran)}
                      className="btn btn-sm btn-secondary"
                    >
                      Lihat Bukti
                    </button>
                  </td>
                  <td style={{ minWidth: "140px" }}>
                    <button
                      onClick={() => handleShowCatatan(report.catatanTambahan)}
                      className="btn btn-sm btn-secondary"
                    >
                      Lihat Catatan
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "start" }}>
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <select
          className="form-select form-select-sm"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          style={{ width: "60px" }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>

        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setPage((prev) => Math.max(prev - 1, 1));
              setTempPage((prev) => Math.max(prev - 1));
            }}
            disabled={page === 1}
          >
            Prev
          </button>
          <input
            className="form-control form-control-sm ms-2 me-2 fw-semibold"
            type="text"
            value={tempPage}
            onChange={handlePageInput}
            onBlur={handlePageBlur}
            style={{ width: "50px", textAlign: "center" }}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setPage((prev) => Math.min(prev + 1, totalPages));
              setTempPage((prev) => Math.max(prev + 1));
            }}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <br />
      <hr />
      <div>
        <h3 className="mb-1 titleDaftarLaporan">Export Laporan</h3>
        <p className="mb-0 textDaftarLaporan">
          Tersedia format PDF dan Excel/CSV
        </p>
        <br />
        <ExportFiles data={reports} />
      </div>
    </div>
  );
};

export default TableLaporan;
