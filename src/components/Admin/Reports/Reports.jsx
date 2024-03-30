import React, { useState, useEffect } from "react";
import ReportProfiles from "./ReportProfiles";
import ReportAttendance from "./ReportAttendance";
import ReportResults from "./ReportResults";
import "./ReportProfiles.css";
import "../StudentProfiles/StudentProfile.css";
import { API } from "../../Student/Student";
import Pdf from "./pdf.jpg";
import Print from "./print.jpg";
import Excel from "./excel.jpg";

const Reports = () => {
  const [yearValue, setYearValue] = useState([]);
  const [academicyearValue, setAcademicYearValue] = useState([]);
  const [academicyear, setAcademicyear] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState("");
  const handleAcademicyearChange = (e) => {
    setAcademicyear(e.target.value);
  };
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };
  const handlePageChange = (e) => {
    setPage(e.target.value);
  };

  const sortMBBSValues = (a, b) => {
    const getAlphabeticPart = (str) => str.split("-")[1];
    const alphabeticValues = { I: 1, II: 2, III: 3, IV: 4 };
    const aValue = alphabeticValues[getAlphabeticPart(a)];
    const bValue = alphabeticValues[getAlphabeticPart(b)];
    return aValue - bValue;
  };
  const sortedYears = yearValue.sort(sortMBBSValues);

  const compareAcademicYears = (a, b) => {
    const getLastYear = (academicYear) => {
      return parseInt(academicYear.split("-")[1]);
    };
    return getLastYear(b) - getLastYear(a);
  };
  const sortedAcademicYears = academicyearValue.sort(compareAcademicYears);

  const getSelect = async () => {
    const response = await API.get("/student/getYearAndAcademicYear");
    setYearValue(response?.data?.years);
    setAcademicYearValue(response?.data?.academicyears);
    console.log("response", response?.data);
  };

  useEffect(() => {
    getSelect();
  }, []);
  return (
    <div className="bg-adminprofile min-h-[calc(100vh-140px)] profiles pb-20   flex flex-col mx-1   pt-7">
      <div className="flex flex-col items-center ">
        <h1 className="mb-3 font-bold">Reports</h1>

        <div className="input">
          <select
            className="me-1"
            onChange={(e) => handleAcademicyearChange(e)}
          >
            <option>Select</option>
            {sortedAcademicYears?.map((academicyear) => (
              <option value={academicyear}>{academicyear}</option>
            ))}
          </select>
          <select className="me-1" onChange={(e) => handleYearChange(e)}>
            <option>Select</option>
            {sortedYears?.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </select>
          <select onChange={(e) => handlePageChange(e)}>
            <option>Select</option>
            <option>Student Profiles</option>
            <option>Attendance</option>
            <option>Results</option>
          </select>
        </div>
      </div>

      {page === "Student Profiles" && (
        <ReportProfiles academicyear={academicyear} year={year} />
      )}
      {page === "Attendance" && (
        <ReportAttendance academicyear={academicyear} year={year} />
      )}
      {page === "Results" && (
        <ReportResults academicyear={academicyear} year={year} />
      )}
    </div>
  );
};

export default Reports;
