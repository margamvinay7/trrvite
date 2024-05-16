import React, { useEffect, useState } from "react";
import "../Attendence/Attendence.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { Link } from "react-router-dom";
import Notification from "../../Notification";

const Attendence = () => {
  const [periodTimeArray, setPeriodTimeArray] = useState([
    "9am-10am",
    "10am-11am",
    "11am-12pm",
    "12pm-1pm",
    "2pm-3pm",
    "3pm-4pm",
  ]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [popup, setPopup] = useState(false);

  const [selectYear, setSelectYear] = useState("");
  const [yearValue, setYearValue] = useState([]);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [date, setDate] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [year, setYear] = useState(new Date());
  const [day, setDay] = useState(new Date().getDay());
  const [academicyear, setAcademicyear] = useState("");
  const [academicyearValue, setAcademicYearValue] = useState([]);

  const [selectAcademic, setSelectAcademic] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [attendence, setAttendence] = useState([]);

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
    setDay(new Date(e.target.value).getDay());
    const day = new Date(e.target.value).getDay();

    setToday(dayNames[day]);
  };

  useEffect(() => {
    handleAcademicChange();
    setSelectedCheckboxes({});
  }, [date, setDate]);

  useEffect(() => {
    handleAcademicChange();
  }, [today]);

  const handleAcademicChange = async (e = null) => {
    let currentPeriods = null;
    let currentStudents = null;
    const year = selectYear;
    let academicyear;
    if (e == null) {
      academicyear = selectAcademic;
    } else {
      academicyear = e.target.value;
      setAcademicyear(academicyear);
      setSelectAcademic(academicyear);
    }

    if (year && academicyear) {
      const response = await API.get(
        `/timetable/getTimetableBYyearAndAcademicyear?year=${year}&academicyear=${academicyear}`
      )
        .then(async (response) => {
          setTimetable(
            response?.data?.Days.filter((day) => day.day == today)[0]
          );
          setPeriods(
            response?.data?.Days.filter((day) => day.day == today)[0]?.Periods
          );
          currentPeriods = response?.data?.Days.filter(
            (day) => day.day == today
          )[0]?.Periods;

          const periodsArray = currentPeriods?.map((period) => period.time);
          setPeriodTimeArray(periodsArray || periodTimeArray);
        })
        .then(async () => {
          if (year && academicyear && date !== null) {
            const students = await API.get(
              `/student/getStudentByYearAndAcademicYear?year=${year}&academicyear=${academicyear}`
            );

            setStudents(students?.data);
            currentStudents = students?.data;
          }
        });
    }

    if (currentPeriods !== null && currentStudents !== null) {
      setAttendence(
        currentStudents?.map((student) => ({
          studentId: student?.id,
          name: student.fullName,
          date: date,
          year: year,
          academicyear: academicyear,
          subjects: currentPeriods?.map((period) => ({
            time: period?.time,
            subject: period?.subject,
            present: false,
          })),
        }))
      );
    }
  };

  const handleYearChange = async (e = null) => {
    let currentPeriods = null;
    let currentStudents = null;
    let year;
    if (e == null) {
      year = selectYear;
    } else {
      setSelectYear(e.target.value);
      year = e.target.value;
      setYear(year);
    }

    const academicyear = selectAcademic;

    if (year && academicyear) {
      await API.get(
        `/timetable/getTimetableBYyearAndAcademicyear?year=${year}&academicyear=${academicyear}`
      )
        .then(async (response) => {
          setTimetable(
            response?.data?.Days.filter((day) => day.day == today)[0]
          );
          setPeriods(
            response?.data?.Days.filter((day) => day.day == today)[0]?.Periods
          );
          currentPeriods = response?.data?.Days.filter(
            (day) => day.day == today
          )[0]?.Periods;
          const periodsArray = currentPeriods?.map((period) => period.time);
          setPeriodTimeArray(periodsArray || periodTimeArray);
        })
        .then(async () => {
          if (year && academicyear && date !== null) {
            const students = await API.get(
              `/student/getStudentByYearAndAcademicYear?year=${year}&academicyear=${academicyear}`
            );

            setStudents(students?.data);
            currentStudents = students?.data;
          }
        });
    }

    if (currentPeriods !== null && currentStudents !== null) {
      setAttendence(
        currentStudents?.map((student) => ({
          studentId: student?.id,
          name: student.fullName,
          date: date,
          year: year,
          academicyear: academicyear,
          subjects: currentPeriods?.map((period) => ({
            time: period?.time,
            subject: period?.subject,
            present: false,
          })),
        }))
      );
    }
  };

  const getSelect = async () => {
    const response = await API.get(
      "/timetable/getTimetableYearAndAcademicyear"
    );
    setYearValue(response?.data?.years);

    setAcademicYearValue(response?.data?.academicyears);
  };

  const handleAttendence = (e) => {
    const studentId = e?.target?.id;
    const subjectClassName = e?.target?.className;

    // Extract time and subject name from the class name
    const [time, subjectName] = subjectClassName.split("@");

    // Find the student in the attendance array
    const targetStudent = attendence.find(
      (student) => student.studentId === studentId
    );

    if (targetStudent) {
      // Find the subject in the subjects array of the student
      const targetSubjectIndex = targetStudent.subjects.findIndex(
        (subject) => subject.time === time && subject.subject === subjectName
      );

      if (targetSubjectIndex !== -1) {
        // Toggle the 'present' value for the subject
        targetStudent.subjects[targetSubjectIndex].present =
          !targetStudent.subjects[targetSubjectIndex].present;

        // Update the state with the modified attendance array
        setAttendence([...attendence]);
      }
    }
  };

  const handleSaveAttendence = async () => {
    try {
      const response = await API.post(
        "/attendance/createAttendance",
        attendence
      );

      if (response.status == 208) {
        toast.error("Attendence Already Marked");
        setNotification({
          message: "Attendance Already Marked!",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);
        setSelectedCheckboxes({});
        handleAcademicChange();
      }
      if (response.status == 200) {
        setNotification({
          message: "Attendance Saved",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);

        toast.success("Attendence Saved");
      } else {
      }
    } catch (error) {
      setNotification({
        message: "Failed to Save Attendance",
        type: "error",
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);

      toast.error("Failed to Save Attendence");
    }
  };

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

  const handleSelectAll = (e, time) => {
    const isChecked = e.target.checked;
    const updatedSelectedCheckboxes = { ...selectedCheckboxes };
    updatedSelectedCheckboxes[time] = isChecked;
    setSelectedCheckboxes(updatedSelectedCheckboxes);

    const updatedAttendance = attendence?.map((student) => ({
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
    setAttendence(updatedAttendance);
  };

  const handleIndividualSelect = (e) => {
    const { id, className } = e.target;
    const [time, subject] = className.split("@");

    const updatedAttendance = attendence?.map((student) => {
      if (student.id === id) {
        const updatedSubjects = student?.subjects?.map((subj) => {
          if (subj.time === time && subj.subject === subject) {
            return {
              ...subj,
              present: !subj.present, // Toggle the present value
            };
          }
          return subj;
        });
        return {
          ...student,
          subjects: updatedSubjects,
        };
      }
      return student;
    });

    setAttendence(updatedAttendance);
  };

  const handleEdit = () => {
    //editAttendance
  };

  const getEditAttendance = async () => {
    try {
      const response = await API.post(
        "/attendance/getAttendenceByYearAcademicyearId",
        {
          year: year,
          academicYear: academicyear,
          date: date,
        }
      );

      if (response?.data?.length !== 0) {
        setPopup(true);
      }

      console.log("editable attendence", response);
      // setEditAttendance(response?.data);

      // setPeriodsArray(
      //   response?.data[0]?.subjects?.map((period) => period.time) ||
      //     periodsArray
      // );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setPopup(false); // Close popup on cancel
  };

  useEffect(() => {
    const year = selectYear;
    const academicyear = selectAcademic;
    if (year && academicyear && date) {
      // getAttendenceByYearAcademicyearId

      getEditAttendance();
    }
  }, [date, selectYear, selectAcademic]);

  useEffect(() => {
    getSelect();
  }, []);
  return (
    <div className=" bg-adminAttendence attendence min-h-[calc(100vh-140px)] pb-20 containerattendence min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <h1 className="mb-3 text-xl font-medium text-adminyellow">Attendence</h1>
      {notification.message && <Notification {...notification} />}
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
        <input
          type="date"
          id="dateField"
          required
          onChange={handleDateChange}
        />
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
              <th>{periodTimeArray[0]}</th>
              <th>{periodTimeArray[1]}</th>
              <th>{periodTimeArray[2]}</th>

              <th>{periodTimeArray[3]}</th>
              <th>{periodTimeArray[4]}</th>
              <th>{periodTimeArray[5]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              {periods?.map((period, index) => (
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

            <div className="popup-container ">
              {/* <button onClick={handleButtonClick}>Delete</button> */}
              {popup && (
                <div className="popup-overlay">
                  <div className="popup ">
                    <p className="text-black mt-4">
                      Attendance for this date has been marked, do you want to
                      edit it?
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
                      <Link
                        to="/editattendance"
                        state={{
                          yearEdit: selectYear,
                          academicyearEdit: selectAcademic,
                          dateEdit: date,
                          periodEdit: periods,
                        }}
                      >
                        <button
                          // onClick={handleDelete}
                          style={{
                            backgroundColor: "rgba(189, 68, 46, 1)",
                            color: "white",
                          }}
                        >
                          Update
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {attendence?.map((att, index) => (
              <tr onClick={(e) => handleAttendence(e)}>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {att.name}
                </td>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {att.studentId}
                </td>
                {att.subjects?.map((period) => (
                  <td>
                    <input
                      type="checkbox"
                      checked={period?.present}
                      className={`${period?.time}@${period?.subject}`}
                      id={att?.studentId}
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
          className="bg-skyblue hover:bg-sky-500 active:outline active:outline-sky-300 m-5  me-0 px-4 text-center w-20 rounded-sm"
          onClick={handleSaveAttendence}
        >
          Save
        </button>
        {/* <button className="bg-skyblue hover:bg-sky-500 active:outline active:outline-sky-300 m-5 ms-2 px-4 text-center w-20 rounded-sm">
          <Link to="/editattendance">Edit</Link>
        </button> */}
      </div>
    </div>
  );
};

export default Attendence;
