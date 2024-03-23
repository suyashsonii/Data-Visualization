import React, { useState } from "react";
import "./FileUpload.css";
import axios from "axios";
import Chart from "chart.js/auto";

const FileUpload = () => {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    //Multer
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData);
      console.log(response.data);
      //   setCsvData(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    //Multer

    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target.result;
      const data = parseCsv(result);
      setCsvData(data);
      renderChart(data);
    };

    reader.readAsText(file);
  };

  const parseCsv = (csvString) => {
    const rows = csvString.split("\n");
    const filteredRows = rows.filter((row) => row.trim() !== "");
    const data = filteredRows.map((row) => {
      const columns = row.split(",");
      return {
        column1: columns[0],
        column2: columns[1],
      };
    });
    return data;
  };

  const renderChart = (data) => {
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((row) => row.column1),
        datasets: [
          {
            label: "Column 2",
            data: data.map((row) => row.column2),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="container">
      <div className="table-container">
        <h2 className="file-upload-title">Upload CSV File</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-upload-input"
        />
        <div className="csv-table-container">
          <table className="csv-table">
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  <td>{row.column1}</td>
                  <td>{row.column2}</td>
                  {/* Add more table data cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="chart-container">
        <canvas id="myChart" width="600" height="400"></canvas>
      </div>
    </div>
  );
};

export default FileUpload;
