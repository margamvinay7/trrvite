import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../Student";
import { useSelector } from "react-redux";

const MonthWise = ({ month }) => {
  const [subjects, setSubjects] = useState("");
  const [present, setPresent] = useState("");
  const [percentage, setPercentage] = useState("");
  const username = useSelector((state) => state.studentReducer.username);
  console.log("selected month", month);

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
  console.log("month", monthnumber);
  const year = month?.split("-")[0];
  const getAttendence = async () => {
    //9747674821
    const response = await API.get(
      `/attendance/getAttendanceByIdAndMonth?id=${username}&month=${monthnumber}&year=${year}`
    );
    setSubjects(response.data[0]);
    setPresent(response.data[1]);
    setPercentage(response?.data[2]);
    console.log("response of month", response.data);
  };

  useEffect(() => {
    if (monthnumber && year) {
      getAttendence();
    }
  }, [month]);
  return (
    <div className="monthwisepage min-h-[calc(100vh-248px)] pb-20">
      <div className="flex flex-col items-center">
        <div className="text-white">
          {monthnumber ? `${months[Number(monthnumber - 1)]}-${year}` : ""}
        </div>
        <div className="Table">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingLeft: "20px" }}>
                  DEPARTMENT
                </th>
                <th>Working Days</th>
                <th>Present</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(subjects).map((key) => (
                <tr>
                  <td style={{ textAlign: "left", paddingLeft: "20px" }}>
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
