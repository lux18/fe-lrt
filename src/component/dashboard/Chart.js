import axios from "axios";
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

function Chart() {
  const [data, setData] = useState({
    x: [],
    y: [],
  });

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports/chart");
      const reports = response.data.data.rows;

      const groupedData = reports.reduce((acc, report) => {
        const provinsi = report.wilayah.split(",")[0];
        const jumlahPenerima = report.jumlahPenerima;

        if (acc[provinsi]) {
          acc[provinsi] += jumlahPenerima;
        } else {
          acc[provinsi] = jumlahPenerima;
        }

        return acc;
      }, {});

      const wilayahData = Object.keys(groupedData);
      const penerimaData = Object.values(groupedData);

      setData({
        x: wilayahData,
        y: penerimaData,
      });
    } catch (error) {
      console.error("Error fetching reports:", error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const options = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    xaxis: {
      categories: data.x,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["black"],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const wilayah = w.globals.labels[dataPointIndex];
        const penerima = series[seriesIndex][dataPointIndex];
        return `<div class="tooltip-custom">
                    <span>${wilayah} : ${penerima}</span>
                  </div>`;
      },
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      opacity: 0.5,
    },
    colors: ["#3d96e3"],
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            height: 400,
          },
        },
      },
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 400,
          },
        },
      },
    ],
  };

  const series = [
    {
      data: data.y,
    },
  ];

  return (
    <div className="graphic">
      <h4 className="mb-0 mt-2 ms-2 titleDashboard">
        Grafik Penyaluran Bantuan
      </h4>
      <p style={{ fontSize: "14px", opacity: 0.6 }} className="mb-0 ms-2 mt-1">
        Data berdasarkan provinsi
      </p>
      <ApexCharts options={options} series={series} type="bar" height={400} />
    </div>
  );
}

export default Chart;
