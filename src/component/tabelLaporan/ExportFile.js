import React from "react";
import { ExportAsExcel, ExportAsPdf, ExportAsCsv } from "react-export-table";

const ExportFiles = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error("Invalid data: data should be an array");
    return <p>Invalid data provided.</p>;
  }

  if (data.length === 0) {
    return <p>No data available to export.</p>;
  }

  return (
    <div className="row">
      <div className="col-12 col-sm-6 col-md-auto mb-3">
        <ExportAsExcel
          data={data}
          headers={[
            "ID",
            "Nama Program",
            "Wilayah",
            "Jumlah Penerima",
            "Tanggal Penyaluran",
            "Bukti Penyaluran",
            "Catatan Tambahan",
            "Keterangan",
            "Email",
            "Status",
            "Dibuat",
            "Diupdate",
          ]}
        >
          {(props) => (
            <button
              className="w-100 d-flex justify-content-center fw-semibold btn btn-success"
              {...props}
            >
              Export as Excel
            </button>
          )}
        </ExportAsExcel>
      </div>

      <div className="col-12 col-sm-6 col-md-auto mb-3">
        <ExportAsCsv
          data={data}
          headers={[
            "ID",
            "Nama Program",
            "Wilayah",
            "Jumlah Penerima",
            "Tanggal Penyaluran",
            "Bukti Penyaluran",
            "Catatan Tambahan",
            "Keterangan",
            "Email",
            "Status",
            "Dibuat",
            "Diupdate",
          ]}
          separator=","
        >
          {(props) => (
            <button
              className="w-100 d-flex justify-content-center fw-semibold btn btn-info text-light"
              {...props}
            >
              Export as CSV
            </button>
          )}
        </ExportAsCsv>
      </div>
      <div className="col-12 col-sm-6 col-md-auto mb-3">
        <ExportAsPdf
          data={data}
          headers={[
            "ID",
            "Nama Program",
            "Wilayah",
            "Jumlah Penerima",
            "Tanggal Penyaluran",
            "Bukti Penyaluran",
            "Catatan Tambahan",
            "Keterangan",
            "Email",
            "Status",
            "Dibuat",
            "Diupdate",
          ]}
          styles={{
            minCellWidth: 20,
            overflow: "linebreak",
          }}
          orientation="l"
        >
          {(props) => (
            <button
              className="w-100 d-flex justify-content-center fw-semibold btn btn-danger"
              {...props}
            >
              Export as PDF
            </button>
          )}
        </ExportAsPdf>
      </div>
    </div>
  );
};

ExportFiles.defaultProps = {
  data: [],
};

export default ExportFiles;
