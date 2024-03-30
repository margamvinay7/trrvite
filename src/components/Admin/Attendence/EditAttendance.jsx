import React, { useEffect, useState } from "react";
import "../Attendence/Attendence.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

///select/getTimetableYear
const EditAttendance = () => {
  const navigate = useNavigate();
  const [selectYear, setSelectYear] = useState("");
  const [yearValue, setYearValue] = useState([]);
  // const [students, setStudents] = useState([]);
  // const [timetable, setTimetable] = useState([]);
  const [date, setDate] = useState(new Date());
  const [periods, setPeriods] = useState([]);
  const [year, setYear] = useState("");
  const [day, setDay] = useState(new Date().getDay());
  const [academicyear, setAcademicyear] = useState("");
  const [academicyearValue, setAcademicYearValue] = useState([]);
  // const [acad, setAcad] = useState("");
  const [selectAcademic, setSelectAcademic] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [attendence, setAttendence] = useState([]);
  const [editAttendance, setEditAttendance] = useState([]);

  const dayNames = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const [today, setToday] = useState(dayNames[day]);
  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
    // setDay(new Date(e.target.value).getDay());
    // const day = new Date(e.target.value).getDay();

    setToday(dayNames[day]);
  };

  // useEffect(() => {
  //   handleAcademicChange();
  // }, [today]);

  const getEditAttendance = async () => {
    console.log("values", year, academicyear, date);
    try {
      const response = await API.post(
        "/attendance/getAttendenceByYearAcademicyearId",
        {
          year: year,
          academicYear: academicyear,
          date: date,
        }
      );
      setEditAttendance(response?.data);
      console.log("it is response", response);
    } catch (error) {}
  };

  const handleAcademicChange = async (e) => {
    const academicyear = e.target.value;
    setAcademicyear(academicyear);
    setSelectAcademic(academicyear);
  };

  // var attendence = [];

  const handleYearChange = async (e) => {
    setSelectYear(e.target.value);
    const year = e.target.value;
    setYear(year);
  };

  useEffect(() => {
    if (year && academicyear && date) {
      // getAttendenceByYearAcademicyearId

      getEditAttendance();
    }
  }, [date, year, academicyear]);
  const getSelect = async () => {
    const response = await API.get(
      "/timetable/getTimetableYearAndAcademicyear"
    );
    setYearValue(response?.data?.years);

    // setSelectYear(response?.data?.years);
    // setAcademicYearValue(["2019-2020", "2021-2022", "2018-2019", "2020-2021"]);
    setAcademicYearValue(response?.data?.academicyears);
  };

  const handleAttendence = (e) => {
    const subject = e.target.className.split("@");
    const studentId = e.target.id;

    // Find the student in the attendence array
    const targetStudentIndex = attendence.findIndex(
      (student) => student.studentId === studentId
    );

    if (targetStudentIndex !== -1) {
      // Find the subject index in the subjects array of the student
      const existingSubjectIndex = attendence[
        targetStudentIndex
      ].subjects.findIndex((subj) => subj.subject === subject[1]);

      if (existingSubjectIndex !== -1) {
        // Toggle the 'present' value for the subject
        attendence[targetStudentIndex].subjects[existingSubjectIndex].present =
          !attendence[targetStudentIndex].subjects[existingSubjectIndex]
            .present;

        console.log(
          "present value",
          attendence[targetStudentIndex].subjects[existingSubjectIndex].present
        );
      }
    }
  };

  //   useEffect(() => {

  //   }, [date]);

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

  const handleEditAttendence = (e, studentId, id) => {
    const isChecked = e.target.checked;

    // Find the index of the student in the editAttendance array
    const studentIndex = editAttendance.findIndex(
      (att) => att.attendance.studentId === studentId
    );

    if (studentIndex !== -1) {
      // Find the index of the subject in the subjects array of the student
      const subjectIndex = editAttendance[studentIndex].subjects.findIndex(
        (subj) => subj.id === id
      );

      if (subjectIndex !== -1) {
        // Update the present value of the subject based on the checkbox status
        editAttendance[studentIndex].subjects[subjectIndex].present = isChecked;

        // Update the state with the modified editAttendance array
        setEditAttendance([...editAttendance]);
      }
    }
  };

  const handleUpdateAttendance = async () => {
    //editAttendance
    let data = [];
    editAttendance.forEach((attendance) => {
      data = [...data, attendance.subjects];
    });

    if (data.length !== 0) {
      try {
        const response = await API.post("/attendance/editAttendance", {
          subjects: data,
        });
        if (response.status == 200) {
          toast.success("Attendance Updated Successfully");
          getEditAttendance();
        }
      } catch (error) {
        toast.error("Failed to Update Attendance");
        console.log("err", error);
      }
    }
  };

  useEffect(() => {
    getSelect();
  }, []);
  return (
    <div className=" bg-adminAttendence attendence min-h-[calc(100vh-140px)] pb-20 containerattendence min-w-[80%] flex relative  mx-1 flex-col items-center pt-7">
      <Link
        className="absolute top-5 left-10 bg-adminattendence1 p-2 rounded-full"
        to="/attendance"
      >
        <GoArrowLeft style={{ color: "white", height: 30, width: 30 }} />
      </Link>
      <h1 className="mb-3 text-xl font-medium text-adminyellow">
        Edit Attendence
      </h1>
      <div className="input">
        <Toaster />
        <select onChange={handleAcademicChange}>
          <option>select</option>
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
        <input type="date" required onChange={handleDateChange} />
      </div>
      <div className="Table table-container">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th
                style={{
                  color: "rgba(96, 165, 250, 1)",
                  textAlign: "left",
                  paddingLeft: "20px",
                }}
              >
                Student Name
              </th>
              <th
                style={{
                  color: "rgba(96, 165, 250, 1)",
                  textAlign: "left",
                  paddingLeft: "20px",
                }}
              >
                Roll No
              </th>
              <th>9am-11am</th>
              <th>11am-12noon</th>
              <th>12pm-2pm</th>

              <th>2pm-4pm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {periods.map((period, index) => (
                <td>
                  <label
                    htmlFor={`select${index}`}
                    style={{
                      cursor: "pointer",
                      color: selectedCheckboxes[period.time]
                        ? "white"
                        : "white",
                    }}
                  >
                    {selectedCheckboxes[period.time]
                      ? "Deselect All"
                      : "Select All"}
                  </label>
                  <input
                    id={`select${index}`}
                    type="checkbox"
                    style={{ display: "none" }} // Hide the checkbox
                    // onChange={(e) => handleSelectAll(e, period.time)} // Use the hidden checkbox to trigger the selection/deselection
                    checked={selectedCheckboxes[period.time]}
                  />
                </td>
              ))}
            </tr>

            {editAttendance?.map((att) => (
              <tr>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {att?.attendance?.studentName}
                </td>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {att?.attendance?.studentId}
                </td>
                {att?.subjects?.map((period) => (
                  <td>
                    <input
                      type="checkbox"
                      checked={Number(period.present)}
                      id={att?.attendance?.id}
                      onChange={(e) =>
                        handleEditAttendence(
                          e,
                          att.attendance?.studentId,
                          period.id
                        )
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          className="bg-skyblue hover:bg-sky-500 active:outline active:outline-sky-300 m-5 px-4 text-center w-20 rounded-sm"
          onClick={handleUpdateAttendance}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditAttendance;
