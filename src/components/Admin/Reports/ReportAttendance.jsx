import React, { useState, useEffect } from "react";
import "./ReportAttendance.css";

import { YearWise } from "./ReportAttendance/YearWise";
import { MonthWise } from "./ReportAttendance/MonthWise";
import { FiSearch } from "react-icons/fi";
import { API } from "../../Student/Student";

import PrintImg from "./print.jpg";
import Excel from "./excel.jpg";
import PdfImage from "./pdf.jpg";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Pdf = ({ tableData, category }) => {
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
        { halign: "center" },
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
          "Percentage",
        ],
      ], // Table header
      body: tableData.map((student) => [
        student.id,
        student.fullName || "-",
        student.mobile || "-",
        student.parentName || "-",
        student.parentMobile || "-",
        student.email || "-",
        category == "Theory"
          ? student.totalTSubjectsCount == 0
            ? "-"
            : Number(
                (student.totalTPresentSubjectsCount /
                  student.totalTSubjectsCount) *
                  100
              ).toFixed(2) + "%"
          : student.totalPSubjectsCount == 0
          ? "-"
          : Number(
              (student.totalPPresentSubjectsCount /
                student.totalPSubjectsCount) *
                100
            ).toFixed(2) + "%",
      ]), // Table data
      styles: { theme: "grid" },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 28 },
        2: { cellWidth: 28 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 28 },
        6: { cellWidth: 28 },
      },
    });

    doc.save("Student Attendance.pdf");
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

const TableToExcel = ({ tableData, category }) => {
  const columnHeaders = [
    "Roll No",
    "Student Name",
    "Mobile",
    "Parent Name",
    "Parent Mobile",
    "Email",
    "Percentage",
  ];

  const exportToExcel = () => {
    const filteredData = tableData.map((row) => ({
      Roll_No: row.id,
      Student_Name: row.fullName,
      Mobile: row.mobile,
      Parent_Name: row.parentName,
      Parent_Mobile: row.parentMobile,
      Email: row.email,
      Percentage:
        category == "Theory"
          ? row.totalTSubjectsCount == 0
            ? "-"
            : Number(
                (row.totalTPresentSubjectsCount / row.totalTSubjectsCount) * 100
              ).toFixed(2) + "%"
          : row.totalPSubjectsCount == 0
          ? "-"
          : Number(
              (row.totalPPresentSubjectsCount / row.totalPSubjectsCount) * 100
            ).toFixed(2) + "%",
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
    link.setAttribute("download", "Student Attendance.xlsx");
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

const Print = ({ tableData, category }) => {
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
          "Percentage",
        ],
      ], // Table header
      body: tableData.map((student) => [
        student.id,
        student.fullName || "-",
        student.mobile || "-",
        student.parentName || "-",
        student.parentMobile || "-",
        student.email || "-",
        category == "Theory"
          ? student.totalTSubjectsCount == 0
            ? "-"
            : Number(
                (student.totalTPresentSubjectsCount /
                  student.totalTSubjectsCount) *
                  100
              ).toFixed(2) + "%"
          : student.totalPSubjectsCount == 0
          ? "-"
          : Number(
              (student.totalPPresentSubjectsCount /
                student.totalPSubjectsCount) *
                100
            ).toFixed(2) + "%",
      ]), // Table data
      styles: { theme: "grid" },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 28 },
        2: { cellWidth: 28 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 28 },
        6: { cellWidth: 28 },
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

const ReportAttendance = ({ academicyear, year }) => {
  const [passedAcademicyear, setPassedAcademicyear] = useState(academicyear);
  const [passedYear, setPassedYear] = useState(year);
  const [wise, setWise] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [searchlist, setSearchList] = useState([]);
  const [students, setStudents] = useState([]);
  const [month, setMonth] = useState();

  const handleWiseChange = (e) => {
    setWise(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const getStudent = async () => {
    const response = await API.get(
      `/student/getStudentByYearAndAcademicYear?year=${passedYear}&academicyear=${passedAcademicyear}`
    );

    console.log("res", response?.data);

    setStudents(response?.data);
    setSearchList(response?.data);
  };
  const getStudentAttendanceByMonth = async (yeardate, monthdate) => {
    const response = await API.get(
      `/attendance/getAttendanceForReportsByMonth?year=${yeardate}&academicyear=${passedAcademicyear}&mbbsyear=${passedYear}&month=${monthdate}`
    );

    console.log("res", response?.data);

    if (type == "All") {
      console.log("all");
      setStudents(response?.data?.studentAttendanceData);
      setSearchList(response?.data?.studentAttendanceData);
    }

    if (type == "Above or Equal") {
      console.log("Above or Equal");
      let studentData;
      if (category == "Theory") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) >= 80
          ) {
            return student;
          }
        });
      }

      if (category == "Practical") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) >= 75
          ) {
            return student;
          }
        });
      }
      console.log("typed above or equal", studentData);
      setStudents(studentData);
      setSearchList(studentData);
    }

    if (type == "Below") {
      console.log("Below");
      let studentData;
      if (category == "Theory") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) < 80
          ) {
            return student;
          }
        });
      }

      if (category == "Practical") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) < 75
          ) {
            return student;
          }
        });
      }
      console.log("typed below", studentData);
      setStudents(studentData);
      setSearchList(studentData);
    }
  };
  const getStudentAttendanceByYear = async () => {
    const response = await API.get(
      `/attendance/getAttendanceForReportsByMbbsYear?academicyear=${passedAcademicyear}&mbbsyear=${passedYear}`
    );

    console.log("res", response?.data);
    if (type == "All") {
      console.log("all");
      setStudents(response?.data?.studentAttendanceData);
      setSearchList(response?.data?.studentAttendanceData);
    }

    if (type == "Above or Equal") {
      console.log("Above or Equal");
      let studentData;
      if (category == "Theory") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) >= 80
          ) {
            return student;
          }
        });
      }

      if (category == "Practical") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) >= 75
          ) {
            return student;
          }
        });
      }
      console.log("typed above or equal", studentData);
      setStudents(studentData);
      setSearchList(studentData);
    }

    if (type == "Below") {
      console.log("Below");
      let studentData;
      if (category == "Theory") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) < 80
          ) {
            return student;
          }
        });
      }

      if (category == "Practical") {
        studentData = response?.data.studentAttendanceData.filter((student) => {
          if (
            Number(
              (student.totalTPresentSubjectsCount /
                student.totalTSubjectsCount) *
                100
            ).toFixed(2) < 75
          ) {
            return student;
          }
        });
      }
      console.log("typed below", studentData);
      setStudents(studentData);
      setSearchList(studentData);
    }
  };

  const handleSearch = (e) => {
    console.log("search", e?.target?.value);
    const serachResults = students.filter((item) => {
      return (
        item?.id?.includes(e?.target?.value) ||
        item?.fullName
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        item?.email?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        item?.mobile?.includes(e?.target?.value)
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
    if (passedAcademicyear && passedYear && wise && category && type) {
      console.log("month", month);
      console.log("year and academicyear", passedAcademicyear, passedYear);

      if (wise == "Month Wise") {
        getStudentAttendanceByMonth(month?.split("-")[0], month?.split("-")[1]);
      }
      if (wise == "Year Wise") {
        getStudentAttendanceByYear();
      }
    }
  }, [passedAcademicyear, passedYear, wise, category, type, month]);
  return (
    <div className="bg-adminprofile  ReportAttendance  min-w-[80%]  flex  mx-1 flex-col items-center  pt-7">
      <h1 className="mb-3 font-medium  ">Student Attendance</h1>
      <div className="input">
        <select onChange={(e) => handleWiseChange(e)} style={{ width: 110 }}>
          <option>Select</option>
          <option value="Year Wise">Year Wise</option>
          <option value="Month Wise">Month Wise</option>
        </select>
        {wise == "Month Wise" && (
          <input
            type="month"
            className="w-32"
            onChange={(e) => setMonth(e.target.value)}
          />
        )}
        <select onChange={(e) => handleCategoryChange(e)}>
          <option>Select</option>
          <option value="Theory">Theory</option>
          <option value="Practical">Practical</option>
        </select>
        <select onChange={(e) => handleTypeChange(e)} style={{ width: 130 }}>
          <option>Select</option>
          <option value="All">All</option>
          <option value="Above or Equal">Above or Equal</option>
          <option value="Below">Below</option>
        </select>
        <div className="flex items-center bg-white pe-2 rounded-md">
          <input
            onChange={handleSearch}
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
          <Print tableData={searchlist} category={category} />

          <Pdf tableData={searchlist} category={category} />
          <TableToExcel tableData={searchlist} category={category} />
        </div>
      </div>

      {/* {wise === "Year Wise" && (
        <YearWise
          academicyear={passedAcademicyear}
          year={passedYear}
          wise={wise}
          category={category}
          type={type}
          search={search}
        />
      )}
      {wise === "Month Wise" && (
        <MonthWise
          academicyear={passedAcademicyear}
          year={passedYear}
          wise={wise}
          category={category}
          type={type}
          search={search}
        />
      )} */}

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
              <th>Percentage</th>
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
                {category == "Theory" ? (
                  <td
                    style={
                      Number(
                        (student.totalTPresentSubjectsCount /
                          student.totalTSubjectsCount) *
                          100
                      ) < 80
                        ? { color: "red" }
                        : { color: "green" }
                    }
                  >
                    {student.totalTSubjectsCount == 0
                      ? "-"
                      : Number(
                          (student.totalTPresentSubjectsCount /
                            student.totalTSubjectsCount) *
                            100
                        ).toFixed(2) + "%"}
                  </td>
                ) : category == "Practical" ? (
                  <td
                    style={
                      Number(
                        (student.totalPPresentSubjectsCount /
                          student.totalPSubjectsCount) *
                          100
                      ) < 75
                        ? { color: "red" }
                        : { color: "green" }
                    }
                  >
                    {student.totalPSubjectsCount == 0
                      ? "-"
                      : Number(
                          (student.totalPPresentSubjectsCount /
                            student.totalPSubjectsCount) *
                            100
                        ).toFixed(2) + "%"}
                  </td>
                ) : (
                  <td style={{ textAlign: "center" }}>-</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportAttendance;
