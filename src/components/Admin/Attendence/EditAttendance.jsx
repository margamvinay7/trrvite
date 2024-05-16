import React, { useEffect, useState } from "react";
import "../Attendence/Attendence.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import Notification from "../../Notification";

const EditAttendance = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [popup, setPopup] = useState(false);
  const location = useLocation();
  const { yearEdit, academicyearEdit, dateEdit, periodEdit } = location.state;

  const [datevalue, setDateValue] = useState(
    `${new Date(dateEdit).getDate()}/${
      new Date(dateEdit).getMonth() + 1
    }/${new Date(dateEdit).getFullYear()}`
  );
  // console.log(
  //   "datevalue",
  //   datevalue?.getDate(),
  //   datevalue?.getMonth(),
  //   datevalue?.getFullYear()
  // );
  console.log(datevalue);
  const [periodsArray, setPeriodsArray] = useState([
    "9am-10am",
    "10am-11am",
    "11am-12pm",
    "12pm-1pm",
    "2pm-3pm",
    "3pm-4pm",
  ]);
  const [selectYear, setSelectYear] = useState("");
  const [yearValue, setYearValue] = useState([]);

  const [date, setDate] = useState();
  const [periods, setPeriods] = useState([]);
  const [year, setYear] = useState("");
  const [day, setDay] = useState(new Date().getDay());
  const [academicyear, setAcademicyear] = useState("");
  const [academicyearValue, setAcademicYearValue] = useState([]);

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

    setToday(dayNames[day]);
  };

  const getEditAttendance = async () => {
    try {
      const response = await API.post(
        "/attendance/getAttendenceByYearAcademicyearId",
        {
          year: yearEdit,
          academicYear: academicyearEdit,
          date: dateEdit,
        }
      );
      if (response?.data?.length === 0) {
        setPopup(true);
      }

      setEditAttendance(response?.data);

      setPeriodsArray(
        response?.data[0]?.subjects?.map((period) => period.time) ||
          periodsArray
      );
    } catch (error) {
      console.log(error);
    }
  };

  // const handleAcademicChange = async (e) => {
  //   const academicyear = e.target.value;
  //   setAcademicyear(academicyear);
  //   setSelectAcademic(academicyear);
  // };

  // var attendence = [];

  // const handleYearChange = async (e) => {
  //   setSelectYear(e.target.value);
  //   const year = e.target.value;
  //   setYear(year);
  // };

  useEffect(() => {
    if (yearEdit && academicyearEdit && dateEdit) {
      // getAttendenceByYearAcademicyearId
      // setDateValue(datevalue?.getDate());
      getEditAttendance();
    }
  }, [dateEdit, yearEdit, academicyearEdit, periodEdit]);
  const getSelect = async () => {
    const response = await API.get(
      "/timetable/getTimetableYearAndAcademicyear"
    );
    setYearValue(response?.data?.years);

    setAcademicYearValue(response?.data?.academicyears);
  };

  // const handleAttendence = (e) => {
  //   const subject = e.target.className.split("@");
  //   const studentId = e.target.id;

  //   // Find the student in the attendence array
  //   const targetStudentIndex = attendence.findIndex(
  //     (student) => student.studentId === studentId
  //   );

  //   if (targetStudentIndex !== -1) {
  //     // Find the subject index in the subjects array of the student
  //     const existingSubjectIndex = attendence[
  //       targetStudentIndex
  //     ].subjects.findIndex((subj) => subj.subject === subject[1]);

  //     if (existingSubjectIndex !== -1) {
  //       // Toggle the 'present' value for the subject
  //       attendence[targetStudentIndex].subjects[existingSubjectIndex].present =
  //         !attendence[targetStudentIndex].subjects[existingSubjectIndex]
  //           .present;
  //     }
  //   }
  // };

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
          setNotification({
            message: "Attendance Updated Successfully!",
            type: "success",
          });
          setTimeout(() => {
            setNotification({
              message: "",
              type: "",
            });
          }, 3000);
          getEditAttendance();
        }
      } catch (error) {
        console.log(error);
        setNotification({
          message: "Failed to Update Attendance",
          type: "error",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);
        toast.error("Failed to Update Attendance");
      }
    }
  };

  const handleSelectAll = (e, time) => {
    const isChecked = e.target.checked;
    const updatedSelectedCheckboxes = { ...selectedCheckboxes };
    updatedSelectedCheckboxes[time] = isChecked;
    setSelectedCheckboxes(updatedSelectedCheckboxes);

    const updatedAttendance = editAttendance?.map((student) => ({
      ...student,
      subjects: student?.subjects?.map((subject) => {
        if (subject.time === time) {
          return {
            ...subject,
            present: isChecked,
          };
        } else {
          return subject;
        }
      }),
    }));
    setEditAttendance(updatedAttendance);
  };

  const handleCancel = () => {
    setPopup(false);
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
      {notification.message && <Notification {...notification} />}
      <div className="input">
        <select>
          <option value={academicyearEdit}>{academicyearEdit}</option>
          {/* {sortedAcademicYears?.map((academicyear) => (
            <option value={academicyearEdit}>{academicyearEdit}</option>
          ))} */}
        </select>
        <select>
          <option value={yearEdit}>{yearEdit}</option>
          {/* {sortedYears?.map((year) => (
            <option value={yearEdit}>{yearEdit}</option>
          ))} */}
        </select>
        <input
          type="text"
          // required
          className="w-36"
          value={datevalue}
        />
      </div>
      <div className="popup-container ">
        {popup && (
          <div className="popup-overlay">
            <div className="popup ">
              <p className="text-black mt-4">
                Attendance for this date has not marked, do you want to Mark?
              </p>
              <div className="flex justify-between mt-8 pop">
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "rgb(209, 213, 219)",
                    color: "black",
                  }}
                >
                  Cancel
                </button>
                <Link to="/attendance">
                  <button
                    // onClick={handleDelete}
                    style={{
                      backgroundColor: "rgba(189, 68, 46, 1)",
                      color: "white",
                    }}
                  >
                    Mark
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
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
              <th>{periodsArray[0]}</th>
              <th>{periodsArray[1]}</th>
              <th>{periodsArray[2]}</th>
              <th>{periodsArray[3]}</th>
              <th>{periodsArray[4]}</th>
              <th>{periodsArray[5]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>

              {periodEdit.map((period, index) => (
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
                    onChange={(e) => handleSelectAll(e, period.time)} // Use the hidden checkbox to trigger the selection/deselection
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
