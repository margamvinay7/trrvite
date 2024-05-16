import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../Student";
import { useSelector } from "react-redux";

const MonthWise = ({ month }) => {
  const [subjects, setSubjects] = useState("");
  const [present, setPresent] = useState("");
  const [percentage, setPercentage] = useState("");
  const username = useSelector((state) => state.studentReducer.username);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthnumber = month?.split("-")[1];

  const year = month?.split("-")[0];
  const getAttendence = async () => {
    const response = await API.get(
      `/attendance/getAttendanceByIdAndMonth?id=${username}&month=${monthnumber}&year=${year}`
    );
    setSubjects(response.data[0]);
    setPresent(response.data[1]);
    setPercentage(response?.data[2]);
  };

  useEffect(() => {
    if (monthnumber && year) {
      getAttendence();
    }
  }, [month]);
  return (
    <div className="monthwisepage min-h-[calc(100vh-232px)] pb-20">
      <div className="flex flex-col items-center ms-1">
        <div className="text-white">
          {monthnumber ? `${months[Number(monthnumber - 1)]}-${year}` : ""}
        </div>
        <div className="Table table-container">
          <table className="table-auto scroll-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingLeft: "60px" }}>
                  DEPARTMENT
                </th>
                <th style={{ paddingRight: "20px" }}>Working Days</th>
                <th style={{ paddingRight: "20px" }}>Present</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(subjects).map((key) => (
                <tr>
                  <td style={{ textAlign: "left", paddingLeft: "60px" }}>
                    {key}
                  </td>
                  <td>{subjects[key]}</td>
                  <td>{present[key] ? present[key] : 0}</td>
                  <td>{Number(percentage[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthWise;
