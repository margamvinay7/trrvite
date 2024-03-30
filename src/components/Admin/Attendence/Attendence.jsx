import React, { useEffect, useState } from "react";
import "../Attendence/Attendence.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { Link } from "react-router-dom";

///select/getTimetableYear
const Attendence = () => {
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
  // const [acad, setAcad] = useState("");
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
          // console.log("r e s t", response);
          // console.log(
          //   "new",
          //   response?.data?.Days.filter((day) => day.day == today)[0]?.Periods
          // );
          setTimetable(
            response?.data?.Days.filter((day) => day.day == today)[0]
          );
          setPeriods(
            response?.data?.Days.filter((day) => day.day == today)[0]?.Periods
          );
          currentPeriods = response?.data?.Days.filter(
            (day) => day.day == today
          )[0]?.Periods;
          // const year = response?.data?.year;
          // setYear(year);
          // console.log("it is response ac", academicyear, year);
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

  // var attendence = [];

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
          // console.log("r e s t", response);
          // console.log(

          //   response?.data?.Days.filter((day) => day.day == today)[0]?.Periods
          // );
          setTimetable(
            response?.data?.Days.filter((day) => day.day == today)[0]
          );
          setPeriods(
            response?.data?.Days.filter((day) => day.day == today)[0]?.Periods
          );
          currentPeriods = response?.data?.Days.filter(
            (day) => day.day == today
          )[0]?.Periods;
          // const academicyearv = response?.data?.academicyear;
          // setAcademicyear(academicyearv);
          // console.log("it is response", academicyear, year);
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

    // setSelectYear(response?.data?.years);
    // setAcademicYearValue(["2019-2020", "2021-2022", "2018-2019", "2020-2021"]);
    setAcademicYearValue(response?.data?.academicyears);
  };

  console.log("predefined", attendence);

  /**
   * The function `handleAttendence` toggles the 'present' value for a specific subject of a student in
   * an attendance array based on the event target.
   */
  // const handleAttendence = (e) => {
  //   const subject = e?.target?.className.split("@");
  //   const studentId = e?.target?.id;
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
  //       console.log(
  //         "present value",
  //         attendence[targetStudentIndex].subjects[existingSubjectIndex].present
  //       );
  //     }
  //   }
  // };

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

        console.log(
          "present value",
          targetStudent.subjects[targetSubjectIndex].present
        );

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
      console.log("res", response);
      if (response.status == 208) {
        toast.error("Attendence Already Marked");
        setSelectedCheckboxes({});
        handleAcademicChange();
      }
      if (response.status == 200) {
        toast.success("Attendence Saved");
        console.log("File uploaded successfully");
      } else {
        console.error("Failed to Save Attendence");
      }
    } catch (error) {
      toast.error("Failed to Save Attendence");
      console.error("Error:", error);
    }
    // await API
    //   .post("/attendence", attendence)
    //   .then(window.location.reload());
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

  useEffect(() => {
    getSelect();
  }, []);
  return (
    <div className=" bg-adminAttendence attendence min-h-[calc(100vh-140px)] pb-20 containerattendence min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <h1 className="mb-3 text-xl font-medium text-adminyellow">Attendence</h1>
      <div className="input">
        <Toaster />
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
              <th>9am-11am</th>
              <th>11am-12noon</th>
              <th>12pm-1pm</th>

              <th>2pm-4pm</th>
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
        <button className="bg-skyblue hover:bg-sky-500 active:outline active:outline-sky-300 m-5 ms-2 px-4 text-center w-20 rounded-sm">
          <Link to="/editattendance">Edit</Link>
        </button>
      </div>
    </div>
  );
};

export default Attendence;
