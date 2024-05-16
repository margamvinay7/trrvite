import React from "react";
import "./Attendence.css";
import DateWise from "./DateWise";
import MonthWise from "./MonthWise";
import { useState } from "react";
const StudentAttendence = () => {
  const [datewise, setDatewise] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [month, setMonth] = useState("");

  const handleClickdate = () => {
    setDatewise(true);
  };
  const handleClickmonth = () => {
    setDatewise(false);
  };
  return (
    <div className="studentAttendence ">
      <div className="nav">
        <div className="attendencedatestatus" onClick={handleClickdate}>
          <div className="datewise">
            <div className="text-sm">Date wise</div>
            <div className="flex flex-row items-center">
              <label htmlFor="from" className="text-sm">
                From:{" "}
              </label>
              <input
                id="from"
                type="date"
                className="text-white"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex ms-4 flex-row items-center">
              <label htmlFor="to" className="text-sm">
                To:{" "}
              </label>
              <input
                id="to"
                type="date"
                className="text-white"
                onChange={(e) => setendDate(e.target.value)}
              />
            </div>
            <div className="status1">
              <div className="text-xs sm:text-sm flex flex-row items-center gap-x-1">
                <div className="statusbar bg-green-700"></div>Present
              </div>
              <div className="text-xs sm:text-sm flex flex-row items-center gap-x-1">
                <div className="statusbar bg-customorange"></div> Absent
              </div>
            </div>
          </div>
          <div className="status">
            <div className="text-xs sm:text-sm">
              <div className="statusbar bg-green-700"></div>Present
            </div>
            <div className="text-xs sm:text-sm">
              <div className="statusbar bg-customorange"></div> Absent
            </div>
          </div>
        </div>
        <div className="monthwise" onClick={handleClickmonth}>
          <div className="text-sm ">Month wise</div>
          <div className="selectmonth text-sm ">Select month</div>
          <input
            type="month"
            className="text-black text-center w-24 sm:w-32 md:w-48 mt-1 rounded-sm "
            onChange={(e) => setMonth(e.target.value)}
            placeholder="MM-YYYY"
          />
        </div>
      </div>
      {datewise ? (
        <DateWise startDate={startDate} endDate={endDate} />
      ) : (
        <MonthWise month={month} />
      )}
    </div>
  );
};

export default StudentAttendence;
