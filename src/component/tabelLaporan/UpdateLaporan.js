import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DropdownWilayah from "./DropdownWilayah";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const UpdateLaporan = ({ show, handleClose, success, id }) => {
  const [reportData, setReportData] = useState(null);

  const [formData, setFormData] = useState({
    selectedOption: "",
    selectedLocation: "",
    selectedDate: "",
    recipientCount: "",
    selectedcatatanTambahan: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

  const fetchReports = async () => {
    if (!id) return;
    try {
      const response = await axios.get("/api/reports/" + id);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
    }
  };

  useEffect(() => {
    if (show) {
      fetchReports();
    }
  }, [show, id]);

  useEffect(() => {
    if (reportData) {
      setFormData({
        selectedOption: reportData.namaProgram || "",
        selectedLocation: reportData.wilayah || "",
        selectedDate: reportData.tanggalPenyaluran
          ? new Date(reportData.tanggalPenyaluran).toISOString().split("T")[0]
          : "",
        recipientCount: reportData.jumlahPenerima || "",
        file: null,
        selectedcatatanTambahan: reportData.catatanTambahan || "",
      });
      setErrors({});
    }
  }, [reportData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.selectedOption)
      newErrors.selectedOption = "Pilih jenis program wajib diisi.";
    if (!formData.recipientCount)
      newErrors.recipientCount = "Jumlah penerima bantuan wajib diisi.";
    if (!formData.selectedLocation)
      newErrors.selectedLocation = "Wilayah wajib diisi.";
    if (!formData.selectedDate) newErrors.selectedDate = "Tanggal wajib diisi.";
    if (!formData.file && !reportData.buktiPenyaluran)
      newErrors.file = "Unggah bukti penyaluran wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formDataToSend = {
        namaProgram: formData.selectedOption,
        wilayah: formData.selectedLocation,
        jumlahPenerima: formData.recipientCount,
        tanggalPenyaluran: formData.selectedDate,
        catatanTambahan: formData.selectedcatatanTambahan,
        status: reportData.status || "Pending",
        updatedAt: new Date().toISOString(),
      };

      toast("Laporan diproses.");
      handleClose();

      try {
        const response = await axios.put(
          `/api/reports/${reportData.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status === 200) {
          success("success");
        }
      } catch (error) {
        console.error("Error updating report", error);
        success("error");
        handleClose();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => {
      const { [name]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: selectedFile,
    }));

    setErrors((prevErrors) => {
      const { file, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });

    if (selectedFile) {
      const imageFormData = new FormData();
      imageFormData.append("buktiPenyaluran", selectedFile);

      try {
        const imageResponse = await axios.put(
          `/api/reports/${reportData.id}/bukti-penyaluran`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (imageResponse.status === 200) {
          console.log("Image uploaded successfully", imageResponse.data);
          setReportData((prev) => ({
            ...prev,
            buktiPenyaluran: imageResponse.data.report.buktiPenyaluran,
          }));
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    }
  };

  const handleLocationChange = (selectedData) => {
    setFormData((prev) => ({
      ...prev,
      selectedLocation: selectedData,
    }));

    setErrors((prevErrors) => {
      const { selectedLocation, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <ToastContainer />

      <Modal.Header closeButton>
        <Modal.Title>Update Laporan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="programType" className="mb-3">
          <Form.Label className="mb-1 labelInputBuatLaporan d-flex align-items-center">
            <p className="w-100 mb-0">Pilih Jenis Program *</p>
            {errors.selectedOption && (
              <div className="invalid-feedback d-block m-0 text-end">
                {errors.selectedOption}
              </div>
            )}
          </Form.Label>
          <Form.Select
            name="selectedOption"
            value={formData.selectedOption}
            onChange={handleChange}
            className={`form-control ${
              errors.selectedOption ? "is-invalid" : ""
            }`}
          >
            <option value="">Pilih Program</option>
            <option value="PHK">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
            <option value="JPS">JPS</option>
            <option value="PBIN">PBIN</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="recipientCount" className="mb-3">
          <Form.Label className="mb-1 labelInputBuatLaporan d-flex align-items-center">
            <p className="w-100 mb-0">Jumlah Penerima Bantuan *</p>
            {errors.recipientCount && (
              <div className="invalid-feedback d-block m-0 text-end">
                {errors.recipientCount}
              </div>
            )}
          </Form.Label>
          <Form.Control
            type="number"
            name="recipientCount"
            placeholder="Contoh : 200"
            value={formData.recipientCount}
            onChange={handleChange}
            className={`form-control ${
              errors.recipientCount ? "is-invalid" : ""
            }`}
          />
        </Form.Group>

        <Form.Group controlId="programDate" className="mb-3">
          <Form.Label className="mb-1 labelInputBuatLaporan d-flex align-items-center">
            <p className="w-100 mb-0">Wilayah *</p>
            {errors.selectedLocation && (
              <div className="invalid-feedback d-block m-0 text-end">
                {errors.selectedLocation}
              </div>
            )}
          </Form.Label>
          <DropdownWilayah
            onLocationChange={handleLocationChange}
            selectedLocation={formData.selectedLocation}
            className={errors.selectedLocation ? "is-invalid" : ""}
          />
        </Form.Group>

        <Form.Group controlId="programDate" className="mb-3">
          <Form.Label className="mb-1 labelInputBuatLaporan d-flex align-items-center">
            <p className="w-100 mb-0">Tanggal Penyaluran *</p>
            {errors.selectedDate && (
              <div className="invalid-feedback d-block m-0 text-end">
                {errors.selectedDate}
              </div>
            )}
          </Form.Label>
          <Form.Control
            type="date"
            name="selectedDate"
            value={formData.selectedDate}
            onChange={handleChange}
            className={`form-control ${
              errors.selectedDate ? "is-invalid" : ""
            }`}
          />
        </Form.Group>

        <Form.Group controlId="programFile" className="mb-3">
          <Form.Label className="mb-1 labelInputBuatLaporan d-flex align-items-center">
            <p className="w-100 mb-0">Bukti Penyaluran *</p>
            {errors.file && (
              <div className="invalid-feedback d-block m-0 text-end">
                {errors.file}
              </div>
            )}
          </Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            className={`form-control ${errors.file ? "is-invalid" : ""}`}
          />
          {reportData?.buktiPenyaluran && (
            <img
              className="imgLaporan mt-3"
              src={`https://be-eocdhkk8a-iwaldi-putras-projects.vercel.app/${reportData.buktiPenyaluran}`}
            />
          )}
        </Form.Group>

        <Form.Group controlId="additionalNotes" className="mb-3">
          <Form.Label className="mb-1 labelInputBuatLaporan">
            Catatan Tambahan (Opsional)
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="selectedcatatanTambahan"
            value={formData.selectedcatatanTambahan}
            onChange={handleChange}
            type="text"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Konfirmasi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateLaporan;
