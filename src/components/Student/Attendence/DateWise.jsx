import React, { useEffect, useState } from "react";
import "./Attendence.css";
import axios from "axios";
import { API } from "../Student";
import { useSelector } from "react-redux";
const DateWise = ({ startDate, endDate }) => {
  const [attendence, setAttendence] = useState([]);
  const username = useSelector((state) => state.studentReducer.username);

  console.log("start date in datewise", startDate, endDate);

  const handleDate = (date) => {
    const formatedDate = `${date.split("-")[2]}-${date.split("-")[1]}-${
      date.split("-")[0]
    }`;
    return formatedDate;
  };

  const getAttendence = async () => {
    console.log("in getAttendence");
    //9747674821
    const response = await API.get(
      `/attendance/getAttendanceByIdAndDateRange?id=${username}&startDate=${startDate}&endDate=${endDate}`
    );
    console.log("response attendence", response?.data);
    setAttendence(response?.data);
  };

  const customDateSort = (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA < dateB) {
      return 1; // dateA comes before dateB
    } else if (dateA > dateB) {
      return -1; // dateA comes after dateB
    } else {
      return 0; // dates are equal
    }
  };

  // Sort dates in ascending order (older dates first)
  const sortedDates = attendence.sort(customDateSort);

  useEffect(() => {
    if (startDate && endDate) {
      getAttendence();
    }
  }, [startDate, endDate]);

  return (
    <div className="datewisepage min-h-[calc(100vh-248px)] pb-20">
      <div className="Table table-container">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>9am-11am</th>
              <th>11am-12noon</th>
              <th>12pm-1pm</th>
              <th>2pm-4pm</th>
            </tr>
          </thead>
          <tbody>
            {sortedDates?.map((date) => (
              <tr>
                <td>{handleDate(date.date?.split(" ")[0])}</td>
                {date?.subjects?.map((subject) => (
                  <td
                    style={
                      subject.present == 1
                        ? { color: "rgba(42, 255, 42,1)" }
                        : { color: "rgba(199, 106, 48, 1)" }
                    }
                  >
                    {subject.subject}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DateWise;
