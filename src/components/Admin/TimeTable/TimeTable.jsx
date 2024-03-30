import React, { useEffect } from "react";
import "../TimeTable/TimeTable.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API } from "../../Student/Student";
import toast, { Toaster } from "react-hot-toast";

const dayOrderMap = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const Periods = ({ periods }) => {
  // console.log("periods from parent", periods);
  return (
    <>
      {periods?.map((period) => (
        <td>{period.subject}</td>
      ))}
    </>
  );
};

const TimeTable = () => {
  const navigate = useNavigate();
  const username = useSelector((state) => state.studentReducer.username);
  const [yearValue, setYearValue] = useState([]);
  const [academicyearValue, setAcademicYearValue] = useState([]);
  const [selectAcademic, setSelectAcademic] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [year, setYear] = useState("");
  const [acad, setAcad] = useState("");
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  ///select/getTimetableYearAndAcademicyear

  //http://localhost:5000/select/getTimetableBYyearAndAcademicyear/MBBS-I/2024-2025

  const handleYearChange = async (e) => {
    setSelectYear(e.target.value);
    const year = e.target.value;
    const academicyear = selectAcademic;
    setYear(year);
    setAcad(academicyear);

    if (year && academicyear) {
      const response = await API.get(
        `/timetable/getTimetableBYyearAndAcademicyear?year=${year}&academicyear=${academicyear}`
      );
      setTimetable(response?.data?.Days);
      setId(response?.data?.id);
      console.log("res", response?.data?.Days);
      console.log(e.target.value);
    }
  };

  const handleAcademicChange = async (e) => {
    const year = selectYear;
    const academicyear = e.target.value;
    setAcad(academicyear);
    setSelectAcademic(academicyear);

    if (year && academicyear) {
      const response = await API.get(
        `/timetable/getTimetableBYyearAndAcademicyear?year=${year}&academicyear=${academicyear}`
      );
      setId(response?.data?.id);
      setTimetable(response?.data?.Days);
      console.log("res", response?.data?.Days);
    }
  };

  const getSelect = async () => {
    const response = await API.get(
      "/timetable/getTimetableYearAndAcademicyear"
    );
    setYearValue(response?.data?.years);
    setAcademicYearValue(response?.data?.academicyears);
    // setSelectAcademic(response?.data?.academicyears[0]);
    // setSelectYear(response?.data?.years[0]);
    console.log("response data", response?.data);
    console.log("response", response?.data?.years);
  };

  const week = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const sortedTimetable = timetable?.sort(
    (a, b) => dayOrderMap[a.day] - dayOrderMap[b.day]
  );

  const sortMBBSValues = (a, b) => {
    // Extract the alphabetic part from the strings
    const getAlphabeticPart = (str) => str.split("-")[1];

    // Define a mapping for the alphabetic values
    const alphabeticValues = { I: 1, II: 2, III: 3, IV: 4 };

    // Get the alphabetic value for each string
    const aValue = alphabeticValues[getAlphabeticPart(a)];
    const bValue = alphabeticValues[getAlphabeticPart(b)];

    // Sort based on alphabetic values
    return aValue - bValue;
  };
  const sortedYears = yearValue.sort(sortMBBSValues);

  const compareAcademicYears = (a, b) => {
    // Get the last year from the academic year string
    const getLastYear = (academicYear) => {
      return parseInt(academicYear.split("-")[1]);
    };

    // Sort by descending order of last year
    return getLastYear(b) - getLastYear(a);
  };

  const sortedAcademicYears = academicyearValue.sort(compareAcademicYears);

  const handleButtonClick = () => {
    setIsOpen(true); // Open popup on button click
  };

  const handleDelete = async (id) => {
    if (id !== "") {
      console.log("id", id);
      try {
        const response = await API.post(`/timetable/deleteTimetable`, {
          id: id,
        });

        if (response.status == 200) {
          toast.success("Table Deleted successfully");
          console.log("File uploaded successfully");
          setAcademicYearValue([]);
          setYearValue([]);
          setSelectAcademic(null);
          setSelectYear(null);
          setTimetable([]);
          setYear("");
          getSelect();
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        toast.error("Failed to Delete");
        console.error("Error:", error);
      }
      console.log("Item deleted!");
      setIsOpen(false);
    } else {
      console.log("select timetable");
      toast.error("Select Timetable");
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false); // Close popup on cancel
  };

  useEffect(() => {
    getSelect();
  }, []);

  return (
    <div className="bg-admintimeorange min-h-[calc(100vh-140px)] timetable  min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <h1 className="mb-3 font-semibold">Time Table</h1>
      <Toaster />
      <div className="input">
        <select onChange={handleAcademicChange}>
          <option>Select</option>
          {sortedAcademicYears?.map((academicyear) => (
            <option value={academicyear}>{academicyear}</option>
          ))}
        </select>
        <select onChange={handleYearChange}>
          <option>Select</option>
          {sortedYears?.map((year) => (
            <option value={year}>{year}</option>
          ))}
        </select>

        <button>
          <Link to="/createNew">Create New</Link>
        </button>
      </div>
      <div className="mt-5 text-xl">{year}</div>
      <div className="Table table-container  ">
        <table className="table-auto scroll-table ">
          <thead>
            <tr>
              <th>Day</th>
              <th>9am-11am</th>
              <th>11am-12noon</th>
              <th>12pm-1pm</th>
              <th>2pm-4pm</th>
            </tr>
          </thead>
          <tbody>
            {timetable?.map((day) => (
              <tr>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {day.day}
                </td>
                <Periods periods={day.Periods} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="actions">
        <Link
          to="/updatetimetable"
          state={{ year: year, academicyear: acad, id: id }}
        >
          <button>Edit</button>
        </Link>
        <div className="popup-container ">
          <button onClick={handleButtonClick}>Delete</button>
          {isOpen && (
            <div className="popup-overlay">
              <div className="popup ">
                <p className="text-black mt-4">
                  <span>Are you sure you want to delete?</span>
                  <span className="  mt-1">
                    Note: Deleting this table, you will lose the recorded data
                    for the attendace
                  </span>
                </p>
                <div className="flex justify-between  mt-4 pop">
                  <button
                    onClick={handleCancel}
                    style={{
                      backgroundColor: "rgb(209, 213, 219)",
                      color: "black",
                      width: 100,
                      padding: 4,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    style={{
                      backgroundColor: "rgba(189, 68, 46, 1)",
                      color: "white",
                      width: 100,
                      padding: 4,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
