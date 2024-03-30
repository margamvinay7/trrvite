import React, { useState, useEffect } from "react";
import "../Reports/ReportProfiles.css";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { FiSearch } from "react-icons/fi";

import PrintImg from "./print.jpg";
import Excel from "./excel.jpg";
import PdfImage from "./pdf.jpg";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Pdf = ({ tableData }) => {
  const downloadPDF = () => {
    console.log("in pdf fn");
    const doc = new jsPDF();
    // doc.text("Student Information", 10, 10);

    const styles = {
      // Header styles
      headStyles: {
        fillColor: [0, 0, 0], // Light blue background
        textColor: "black", // Dark text color
        fontSize: 12, // Font size
        halign: "center", // Center-align text
        valign: "middle", // Center-align text vertically
      },
      // Body styles (applied to all rows)
      bodyStyles: {
        fontSize: 10, // Font size
      },
      theme: "grid",
      // Column-specific styles (optional)
      columnStyles: [
        { halign: "center" }, // Center-align Roll No.
        { halign: "left" }, // Left-align other columns
        { halign: "center" },
        { halign: "left" },
        { halign: "center" },
        { halign: "left" },
        { halign: "left" },
      ],
    };

    doc.autoTable({
      head: [
        [
          "Roll No.",
          "Student Name",
          "Mobile",
          "Parent Name",
          "Parent Mobile",
          "Email",
        ],
      ], // Table header
      body: tableData.map((student) => [
        student.id,
        student.fullName || "-",
        student.mobile || "-",
        student.parentName || "-",
        student.parentMobile || "-",
        student.email || "-",
      ]), // Table data
      styles: { theme: "center" },
    });

    doc.save("Student Profile.pdf");
  };

  return (
    <img
      onClick={downloadPDF}
      src={PdfImage}
      width={30}
      height={20}
      className="rounded-sm"
      alt="PDF Icon"
    />
  );
};

const TableToExcel = ({ tableData }) => {
  const columnHeaders = [
    "Roll No",
    "Student Name",
    "Mobile",
    "Parent Name",
    "Parent Mobile",
    "Email",
  ];

  const exportToExcel = () => {
    const filteredData = tableData.map((row) => ({
      Roll_No: row.id,
      Student_Name: row.fullName,
      Mobile: row.mobile,
      Parent_Name: row.parentName,
      Parent_Mobile: row.parentMobile,
      Email: row.email,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    ws["!cols"] = columnHeaders.map(() => ({ wpx: 100 })); // Set column widths
    ws["!cols"].forEach((col, index) => {
      col.wch = Math.max(col.wch || 0, columnHeaders[index].length); // Set column widths based on header length
    });
    ws["!rows"] = [{ hpx: 30 }]; // Set row height for header row
    columnHeaders.forEach((header, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      ws[cellRef] = { v: header, t: "s" }; // Assign new header name
    });
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Student Profile.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <img
      src={Excel}
      width={30}
      height={20}
      className="rounded-sm"
      onClick={exportToExcel}
    />
  );
};

const Print = ({ tableData }) => {
  const printPDF = () => {
    console.log("in print");
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Roll No.",
          "Student Name",
          "Mobile",
          "Parent Name",
          "Parent Mobile",
          "Email",
        ],
      ], // Table header
      body: tableData.map((student) => [
        student.id,
        student.fullName || "-",
        student.mobile || "-",
        student.parentName || "-",
        student.parentMobile || "-",
        student.email || "-",
      ]), // Table data
      styles: { theme: "grid" },
    });

    doc.autoPrint();
    window.open(doc.output("bloburl"));
  };

  return (
    <img
      src={PrintImg}
      width={30}
      height={20}
      className="rounded-sm"
      onClick={printPDF}
    />
  );
};

const ReportProfiles = ({ academicyear, year }) => {
  const [passedAcademicyear, setPassedAcademicyear] = useState(academicyear);
  const [passedYear, setPassedYear] = useState(year);
  const [students, setStudents] = useState([]);
  const [searchlist, setSearchList] = useState([]);

  const getStudent = async () => {
    const response = await API.get(
      `/student/getStudentByYearAndAcademicYear?year=${passedYear}&academicyear=${passedAcademicyear}`
    );

    console.log("res", response?.data);

    setStudents(response?.data);
    setSearchList(response?.data);
  };

  const handleSearch = (e) => {
    const serachResults = students.filter((item) => {
      return (
        item.id.includes(e.target.value) ||
        item.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.mobile.includes(e.target.value) ||
        item.joiningyear.includes(e.target.value) ||
        item.academicyear.includes(e.target.value)
      );
    });
    setSearchList(serachResults);
  };

  useEffect(() => {
    if (academicyear && year) {
      setPassedAcademicyear(academicyear);
      setPassedYear(year);
    }
  }, [academicyear, year]);

  useEffect(() => {
    if (passedAcademicyear && passedYear) {
      console.log("year and academicyear", passedAcademicyear, passedYear);
      getStudent();
    }
  }, [passedAcademicyear, passedYear]);
  return (
    <div className="bg-adminprofile  ReportProfiles   min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <h1 className="mb-3 font-medium ">Student Profiles</h1>
      <div className="input">
        <Toaster />
        <div className="flex items-center bg-white pe-2 rounded-md">
          <input
            className="w-[35vw] rounded-md text-black ps-2 p-1  placeholder-slate-600"
            onChange={handleSearch}
            placeholder="Search Student"
          />
          <FiSearch
            style={{
              color: "black",

              height: 25,
              width: 25,
            }}
          />
        </div>
        <div className=" ps-10 md:ps-40 flex flex-row gap-x-1">
          <Print tableData={searchlist} />

          <Pdf tableData={searchlist} />
          <TableToExcel tableData={searchlist} />
        </div>
      </div>
      <div className="Table table-container ">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>

              <th style={{ textAlign: "left", paddingLeft: "30px" }}>Mobile</th>
              <th>Parent Name</th>
              <th>Parent Mobile</th>

              <th style={{ textAlign: "left", paddingLeft: "40px" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {searchlist?.map((student) => (
              <tr>
                <td>{student.id} </td>
                <td>{student.fullName == null ? "-" : student.fullName}</td>
                <td>{student.mobile == null ? "-" : student.mobile} </td>
                <td>{student.parentName == null ? "-" : student.parentName}</td>
                <td>
                  {student.parentMobile == null ? "-" : student.parentMobile}{" "}
                </td>
                <td>{student.email == null ? "-" : student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportProfiles;
