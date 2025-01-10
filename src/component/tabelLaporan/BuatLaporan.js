import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DropdownWilayah from "./DropdownWilayah";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const BuatLaporan = ({ show, handleClose, success }) => {
  const [formData, setFormData] = useState({
    selectedOption: "",
    selectedLocation: "",
    selectedDate: "",
    recipientCount: "",
    selectedcatatanTambahan: "",
    selectedemail: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.selectedOption)
      newErrors.selectedOption = "Pilih jenis program wajib diisi.";
    if (!formData.recipientCount)
      newErrors.recipientCount = "Jumlah penerima bantuan wajib diisi.";
    if (!formData.selectedLocation)
      newErrors.selectedLocation = "Wilayah wajib diisi.";
    if (!formData.selectedDate) newErrors.selectedDate = "Tanggal wajib diisi.";
    if (!formData.file) newErrors.file = "Unggah bukti penyaluran wajib diisi.";
    if (!formData.selectedemail) {
      newErrors.selectedemail = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(formData.selectedemail)) {
      newErrors.selectedemail = "Format email tidak valid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formDataToSend = new FormData();

      formDataToSend.append("namaProgram", formData.selectedOption);
      formDataToSend.append("wilayah", formData.selectedLocation);
      formDataToSend.append("jumlahPenerima", formData.recipientCount);
      formDataToSend.append("tanggalPenyaluran", formData.selectedDate);
      formDataToSend.append("email", formData.selectedemail);
      formDataToSend.append(
        "catatanTambahan",
        formData.selectedcatatanTambahan,
      );
      formDataToSend.append("status", "Pending");
      formDataToSend.append("createdAt", new Date().toISOString());
      formDataToSend.append("updatedAt", new Date().toISOString());

      toast("Laporan diproses.");
      handleClose();

      if (formData.file) {
        formDataToSend.append("buktiPenyaluran", formData.file);
      }

      try {
        const response = await axios.post("/api/reports", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          console.log("Form submitted successfully", response.data);
          success("success");
        }
      } catch (error) {
        console.error("Error submitting form", error);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file,
    }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }

    setErrors((prevErrors) => {
      const { file, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
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

  useEffect(() => {
    if (!show) {
      setFormData({
        selectedOption: "",
        selectedLocation: "",
        selectedDate: "",
        recipientCount: "",
        selectedcatatanTambahan: "",
        selectedemail: "",
        file: null,
      });
      setErrors({});
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <ToastContainer />

      <Modal.Header closeButton>
        <Modal.Title>Buat Laporan</Modal.Title>
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
            <p className="w-100 mb-0">Email *</p>
            {errors.selectedemail && (
              <div className="invalid-feedback d-block m-0 text-end">
                {errors.selectedemail}
              </div>
            )}
          </Form.Label>
          <Form.Control
            type="email"
            name="selectedemail"
            placeholder="Contoh : abc@gmail.com"
            value={formData.selectedemail}
            onChange={handleChange}
            className={`form-control ${
              errors.selectedemail ? "is-invalid" : ""
            }`}
          />
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
            className={errors.selectedLocation ? "is-invalid" : ""}
            selectedLocation={""}
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

          {/* File Preview */}
          {filePreview && (
            <div className="mt-3">
              <h5>Preview:</h5>
              <img
                src={filePreview}
                alt="File Preview"
                className="imgLaporan"
              />
            </div>
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

export default BuatLaporan;
