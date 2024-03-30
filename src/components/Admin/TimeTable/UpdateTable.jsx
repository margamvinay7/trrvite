import React, { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateNew.css";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { GoArrowLeft } from "react-icons/go";

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
      console.log("index", updatedPeriods[index], "ind", index);
      updatedPeriods[index].subject = newValue + selectedOption;
    } else {
      console.log("index 1", updatedPeriods[index], "ind", index);
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
  let { state } = useLocation();
  console.log("state", state);
  const navigate = useNavigate();
  const [selectAcademic, setSelectAcademic] = useState(state.academicyear);
  const [selectYear, setSelectYear] = useState(state.year);
  const [timetable, setTimetable] = useState([]);
  const [year, setYear] = useState(selectYear);
  const [id, setId] = useState(state.id);

  const handleGetTimetable = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;
    try {
      if (year && academicyear) {
        const response = await API.get(
          `/timetable/getTimetableBYyearAndAcademicyear?year=${year}&academicyear=${academicyear}`
        );
        console.log("re u t", response);

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
  //   console.log("sort array", sortedTimetable);
  useEffect(() => {
    if (selectYear && selectAcademic) {
      handleGetTimetable();
    }
  }, [state]);

  const handleUpdateTimetable = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;
    const tableId = id;
    console.log("Updated Timetable:", {
      year,
      academicyear,
      Days: timetable,
    });

    try {
      const response = await API.post(`/timetable/updateTimetable`, {
        id: tableId,
        year,
        academicyear,
        Days: timetable,
      });

      if (response.status == 200) {
        toast.success("Table Edited successfully");
        console.log("File uploaded successfully");
        handleGetTimetable();
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Error:", error);
    }
    // try {
    //   await axios
    //     .post(`http://localhost:5000/timetable/updateTimetable/${tableId}`, {
    //       year,
    //       academicyear,
    //       Days: timetable,
    //     })
    //     .then((res) => {
    //       navigate("/timetable");
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
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

      <div className="mt-5 text-xl">{year}</div>
      <div className="Table table-container">
        <Toaster />
        <table className="table-auto scroll-table">
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
