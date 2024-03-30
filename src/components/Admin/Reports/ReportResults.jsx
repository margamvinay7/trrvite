import React, { useState, useEffect } from "react";

import "./ReportResults.css";
import "./CustomDropdown.css";
import { FiSearch } from "react-icons/fi";
import { API } from "../../Student/Student";

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
          "Status",
          "Failed Subjects",
        ],
      ], // Table header
      body: tableData.map((student) => [
        student.id,
        student.fullName || "-",
        student.mobile || "-",
        student.parentName || "-",
        student.parentMobile || "-",
        student.email || "-",
        student.finalstatus || "-",
        student.assessments
          .filter(
            (assessment) =>
              assessment.status == "Fail" || assessment.status == "Failed"
          )
          .map((assessment) => assessment.subject) // Extract subjects
          .join(", "),
      ]), // Table data
      styles: { theme: "grid" },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
      },
    });

    doc.save("Student Results.pdf");
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
    "Status",
    "Failed Subjects",
  ];

  const exportToExcel = () => {
    const filteredData = tableData.map((row) => ({
      Roll_No: row.id,
      Student_Name: row.fullName,
      Mobile: row.mobile,
      Parent_Name: row.parentName,
      Parent_Mobile: row.parentMobile,
      Email: row.email,
      Status: row.finalstatus,
      Failed_Subjects: row.assessments
        .filter(
          (assessment) =>
            assessment.status == "Fail" || assessment.status == "Failed"
        )
        .map((assessment) => assessment.subject)
        .join(", "),
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
    link.setAttribute("download", "Student Results.xlsx");
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
          "Status",
          "Failed Subjects",
        ],
      ], // Table header
      body: tableData.map((student) => [
        student.id,
        student.fullName || "-",
        student.mobile || "-",
        student.parentName || "-",
        student.parentMobile || "-",
        student.email || "-",
        student.finalstatus || "-",
        student.assessments
          .filter(
            (assessment) =>
              assessment.status == "Fail" || assessment.status == "Failed"
          )
          .map((assessment) => assessment.subject) // Extract subjects
          .join(", "),
      ]), // Table data
      styles: { theme: "grid" },
      columnStyles: {
        0: { cellWidth: 23 },
        1: { cellWidth: 22 },
        2: { cellWidth: 23 },
        3: { cellWidth: 22 },
        4: { cellWidth: 23 },
        5: { cellWidth: 36 },
        6: { cellWidth: 10 },
        7: { cellWidth: 27 },
      },
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

function CustomDropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const filteredData = options.filter(
    (assessment) =>
      assessment.status === "Fail" || assessment.status === "Failed"
  );
  console.log("array in dropdown", filteredData);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown ">
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#9660;</span>
      </div>
      {isOpen && (
        <div className="dropdown-options max-h-40 overflow-y-scroll">
          {filteredData.map((option, index) => (
            <div
              key={index}
              className="option"
              onClick={() => handleOptionClick(option.subject)}
            >
              {option.subject}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ReportResults = ({ academicyear, year }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [passedAcademicyear, setPassedAcademicyear] = useState(academicyear);
  const [passedYear, setPassedYear] = useState(year);
  const [assessment, setAssessment] = useState("");
  const [type, setType] = useState("");
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [searchlist, setSearchList] = useState([]);
  const [students, setStudents] = useState([]);

  const handleAssessment = (e) => {
    console.log("assessment name", e.target.value);
    setAssessment(e.target.value);
  };

  const handletype = (e) => {
    console.log("type name", e.target.value);
    setType(e.target.value);
  };

  const getAssessment = async () => {
    console.log("year values in get assessment", year, academicyear);
    const response = await API.get(
      `/result/getAssessments?year=${year}&academicyear=${academicyear}`
    );

    const sortOrder = [
      "I-Internal Assessment",
      "II-Internal Assessment",
      "III-Internal Assessment",
      "Prefinal Assessment",
      "Final Assessment",
    ];

    const customSort = (a, b) => {
      const orderA = sortOrder.indexOf(a.assessment);
      const orderB = sortOrder.indexOf(b.assessment);
      return orderA - orderB;
    };

    const sortedData = response?.data?.sort(customSort);

    setAssessmentsList(sortedData);
  };

  const getStudent = async () => {
    const response = await API.get(
      `/result/getAttendanceReports?year=${passedYear}&academicyear=${passedAcademicyear}&assessment=${assessment}`
    );

    console.log("res", response?.data);

    if (type == "All") {
      setStudents(response?.data);
      setSearchList(response?.data);
    }
    if (type == "Fail") {
      const data = response?.data.filter((student) => {
        if (
          student?.finalstatus == "Fail" ||
          student?.finalstatus == "Failed"
        ) {
          return student;
        }
      });
      setStudents(data);
      setSearchList(data);
    }

    if (type == "Pass") {
      const data = response?.data.filter((student) => {
        if (
          student?.finalstatus == "Passed" ||
          student?.finalstatus == "Pass"
        ) {
          return student;
        }
      });
      setStudents(data);
      setSearchList(data);
    }
  };

  const handleSearch = (e) => {
    const serachResults = students.filter((item) => {
      return (
        item.id.includes(e.target.value) ||
        item.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.mobile.includes(e.target.value)
      );
    });
    setSearchList(serachResults);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (academicyear && year) {
      setPassedAcademicyear(academicyear);
      setPassedYear(year);
      getAssessment();
    }
  }, [academicyear, year]);

  useEffect(() => {
    if (passedAcademicyear && passedYear && assessment && type) {
      console.log("year and academicyear", passedAcademicyear, passedYear);
      getStudent();
    }
  }, [passedAcademicyear, passedYear, assessment, type]);
  return (
    <div className="bg-adminprofile  ReportResults  min-w-[80%] pb-10 flex  mx-1 flex-col items-center  pt-7">
      <h1 className="mb-3 font-medium  ">Student Results</h1>
      <div className="input ">
        <select onChange={(e) => handleAssessment(e)} style={{ width: 200 }}>
          <option>Select</option>
          {assessmentsList?.map((assessment) => (
            <option value={assessment.assessment}>
              {assessment.assessment}
            </option>
          ))}
        </select>

        <select onChange={(e) => handletype(e)}>
          <option>Select</option>
          <option value="All">All</option>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
        <div className="flex items-center bg-white pe-2 rounded-md">
          <input
            onChange={(e) => handleSearch(e)}
            className="w-[25vw] rounded-md text-black ps-2 p-1  placeholder-slate-600"
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

      <div className="Table table-container">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>

              <th style={{ textAlign: "left", paddingLeft: "30px" }}>Mobile</th>
              <th>Parent Name</th>
              <th>Parent Mobile</th>

              <th style={{ textAlign: "left", paddingLeft: "40px" }}>Email</th>
              <th style={{ textAlign: "center" }}>status </th>
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
                  {student.parentMobile == null ? "-" : student.parentMobile}
                </td>
                <td>{student.email == null ? "-" : student.email}</td>
                {student.finalstatus === "Failed" ||
                student.finalstatus == "Fail" ? (
                  <td>
                    <div className="flex justify-between">
                      <span className=" me-2 text-center text-red-700">
                        {student.finalstatus}
                      </span>

                      <span>
                        <CustomDropdown options={student.assessments} />
                      </span>
                    </div>
                  </td>
                ) : (
                  <td style={{ color: "green" }}>{student.finalstatus}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportResults;
