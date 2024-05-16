import React, { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateNew.css";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { GoArrowLeft } from "react-icons/go";
import Notification from "../../Notification";

const dayOrderMap = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const Periods = ({ periods, onUpdate }) => {
  const handleChange = (e, index, selectedOption = null) => {
    const updatedPeriods = [...periods];

    if (selectedOption !== null && e == null) {
      const newValue = updatedPeriods[index].subject?.split("(")[0];

      updatedPeriods[index].subject = newValue + selectedOption;
    } else {
      updatedPeriods[index].subject = e;
    }

    onUpdate(updatedPeriods);
  };

  return (
    <>
      {periods?.map((period, index) => (
        <td key={index}>
          <div className="flex flex-row">
            <div style={{ marginRight: "5px" }}>
              <input
                className="w-full sm:text-xs sm:py-1 min-w-36 text-center"
                type="text"
                value={period.subject}
                onChange={(e) => handleChange(e.target.value, index)}
              />
            </div>
            <div>
              <select
                style={{ width: "80px" }}
                onChange={(e) => {
                  handleChange(null, index, e.target.value);
                }}
              >
                <option value="(Select)">Select</option>
                <option value="(T)">Theory</option>
                <option value="(P)">Practical</option>
              </select>
            </div>
          </div>
        </td>
      ))}
    </>
  );
};

const UpdateTable = () => {
  const [periodTime, setPeriodTime] = useState(Array(6).fill(""));
  let { state } = useLocation();
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const [selectAcademic, setSelectAcademic] = useState(state.academicyear);
  const [selectYear, setSelectYear] = useState(state.year);
  const [timetable, setTimetable] = useState([]);
  const [year, setYear] = useState(selectYear);
  const [id, setId] = useState(state.id);
  const [periodsTime, setPeriodsTime] = useState([]);

  const handlePeriodTimeChange = (e) => {
    const index = parseInt(e.target.id, 10); // Parse id to integer
    const updatedPeriodTime = [...periodTime]; // Create a copy of the periodTime array
    updatedPeriodTime[index] = e.target.value; // Update the specific index with the new value
    setPeriodTime(updatedPeriodTime);

    const updatedTimetable = [...timetable];
    updatedTimetable.forEach((day) => {
      day.Periods[index].time = e.target.value;
    });
    setTimetable(updatedTimetable);
  };

  const handleGetTimetable = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;
    try {
      if (year && academicyear) {
        const response = await API.get(
          `/timetable/getTimetableBYyearAndAcademicyear?year=${year}&academicyear=${academicyear}`
        );

        const retrievedTimetable = response.data.Days || [];
        const retrievedPeriodTimes = [];

        // Iterate through each day's periods to extract the times
        retrievedTimetable.forEach((day) => {
          day.Periods.forEach((period) => {
            retrievedPeriodTimes.push(period.time);
          });
        });

        // Update the periodTime state with the retrieved period times
        setPeriodsTime(retrievedPeriodTimes);

        setTimetable(
          response?.data?.Days.map((day) => ({
            ...day,
            Periods: [...day.Periods],
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sortedTimetable = timetable?.sort(
    (a, b) => dayOrderMap[a.day] - dayOrderMap[b.day]
  );

  useEffect(() => {
    if (selectYear && selectAcademic) {
      handleGetTimetable();
    }
  }, [state]);

  const handleUpdateTimetable = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;
    const tableId = id;

    try {
      const response = await API.post(`/timetable/updateTimetable`, {
        id: tableId,
        year,
        academicyear,
        Days: timetable,
      });

      if (response.status == 200) {
        toast.success("Table Edited successfully");
        setNotification({
          message: "Table Edited successfully!",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);

        handleGetTimetable();
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      setNotification({
        message: "Failed to Update Timetable",
        type: "error",
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);

      toast.error("Failed to upload file");
    }
  };

  return (
    <div className="bg-admintimeorange relative min-h-[calc(100vh-140px)] createNewTable  min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <Link
        className="absolute top-5 left-10  p-2 rounded-full"
        style={{ backgroundColor: "rgba(269, 153, 80, 1)" }}
        to="/timetable"
      >
        <GoArrowLeft style={{ color: "white", height: 30, width: 30 }} />
      </Link>
      <h1 className="mb-3 font-medium">Time Table</h1>
      {notification.message && <Notification {...notification} />}
      <div className="mt-5 text-xl">{year}</div>
      <div className="Table table-container">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>
                <input
                  id={0}
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[0] === "" ? periodsTime[0] : periodTime[0]}
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm text-black  py-1 text-center"
                  required
                />
              </th>

              <th>
                <input
                  id={1}
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[1] === "" ? periodsTime[1] : periodTime[1]}
                  required
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm text-black  py-1 text-center"
                />
              </th>

              <th>
                <input
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[2] === "" ? periodsTime[2] : periodTime[2]}
                  id={2}
                  required
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm text-black  py-1 text-center"
                />
              </th>

              <th>
                <input
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[3] === "" ? periodsTime[3] : periodTime[3]}
                  id={3}
                  required
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm  text-black py-1 text-center"
                />
              </th>
              <th>
                <input
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[4] === "" ? periodsTime[4] : periodTime[4]}
                  id={4}
                  required
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm  text-black py-1 text-center"
                />
              </th>
              <th>
                <input
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[5] === "" ? periodsTime[5] : periodTime[5]}
                  id={5}
                  required
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm  text-black py-1 text-center"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTimetable?.map((day, index) => (
              <tr key={index}>
                <td
                  style={{
                    textAlign: "left",
                    paddingLeft: "20px",
                    fontSize: "12px",
                  }}
                >
                  {day.day}
                </td>
                <Periods
                  periods={day.Periods}
                  onUpdate={(updatedPeriods) => {
                    const updatedTimetable = [...timetable];
                    updatedTimetable[index].Periods = updatedPeriods;
                    setTimetable(updatedTimetable);
                  }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="update">
        <button
          onClick={handleUpdateTimetable}
          className=" bg-blue-200 hover:bg-sky-900"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateTable;
