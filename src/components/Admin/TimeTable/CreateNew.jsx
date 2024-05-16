import React, { useState } from "react";
import "./CreateNew.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../../Student/Student";
import { GoArrowLeft } from "react-icons/go";
import Notification from "../../Notification";
const Timetable = () => {
  const [periodTime, setPeriodTime] = useState(Array(6).fill(""));
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const [year, setYear] = useState(null);
  const [academicyear, setAcademicyear] = useState(null);
  const [timetable, setTimetable] = useState({
    MONDAY: Array(6).fill(""),
    TUESDAY: Array(6).fill(""),
    WEDNESDAY: Array(6).fill(""),
    THURSDAY: Array(6).fill(""),
    FRIDAY: Array(6).fill(""),
    SATURDAY: Array(6).fill(""),
  });

  const handlePeriodTimeChange = (e) => {
    const index = e.target.id;
    const updatedPeriodTime = [...periodTime]; // Create a copy of the periodTime array
    updatedPeriodTime[index] = e.target.value; // Update the specific index with the new value
    setPeriodTime(updatedPeriodTime);
  };

  const days = Object.keys(timetable);

  const handleChange = (day, period, value, selectedOption = null) => {
    const updatedTimetable = { ...timetable };
    // const trimmedString = value?.replace(/\s+/g, " ");
    updatedTimetable[day][period] = value;

    if (selectedOption !== null) {
      // Clear previously selected options by splitting the current value by space and taking only the first part
      const newValue = value?.split("(")[0];
      // const trimmedString = newValue.replace(/\s+/g, " ");
      updatedTimetable[day][period] = newValue + selectedOption;
    }

    setTimetable(updatedTimetable);
  };

  const handleCreate = async () => {
    const newtable = Object.keys(timetable).map((item) => ({
      day: item,
      Periods: [
        { time: periodTime[0]?.trim(), subject: timetable[item][0]?.trim() },
        { time: periodTime[1]?.trim(), subject: timetable[item][1]?.trim() },
        { time: periodTime[2]?.trim(), subject: timetable[item][2]?.trim() },
        { time: periodTime[3]?.trim(), subject: timetable[item][3]?.trim() },
        { time: periodTime[4]?.trim(), subject: timetable[item][4]?.trim() },
        { time: periodTime[5]?.trim(), subject: timetable[item][5]?.trim() },
      ],
    }));

    try {
      let response;
      if (
        year?.trim().length !== 0 &&
        academicyear?.trim().length !== 0 &&
        academicyear !== null &&
        year !== null
      ) {
        response = await API.post("/timetable/createTimetable/", {
          year: year,
          academicyear: academicyear,
          Days: newtable,
        });
      } else {
        // toast.error("Enter the Year and Academic Year fields");
        throw new Error("Enter the year and academic year fields");
      }
      if (response.status == 200) {
        toast.success("Table Created");
        setNotification({
          message: "Table Created!",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);

        setTimeout(() => {
          navigate("/timetable");
        }, 1500);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      toast.error(`${error}`);
      setNotification({
        message: error,
        type: "error",
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);

      console.error("Error:", error);
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
      {notification.message && <Notification {...notification} />}
      <h2 className=" font-medium">Create Timetable</h2>
      <div className=" flex gap-x-1 m-3">
        <div className="flex flex-col ">
          <label>Enter MBBS Year </label>
          <input
            value={year}
            required
            onChange={(e) => setYear(e.target.value.trim())}
            placeholder="Enter MBBS Year"
            className="w-32 placeholder-black/60 rounded-sm ps-1"
          />
        </div>
        <div>
          <label className="flex flex-col ">Enter Academic Year </label>
          <input
            required
            value={academicyear}
            onChange={(e) => setAcademicyear(e.target.value.trim())}
            placeholder="Enter Acad. Year"
            className="w-32 placeholder-black/60 rounded-sm ps-1"
          />
        </div>
      </div>
      <div className="Table table-container">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Day</th>

              <th>
                <input
                  id={0}
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[0]}
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
                  value={periodTime[1]}
                  required
                  type="text"
                  placeholder="Enter Period Time"
                  className=" text-sm text-black  py-1 text-center"
                />
              </th>

              <th>
                <input
                  onChange={(e) => handlePeriodTimeChange(e)}
                  value={periodTime[2]}
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
                  value={periodTime[3]}
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
                  value={periodTime[4]}
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
                  value={periodTime[5]}
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
            {days.map((day) => (
              <tr key={day}>
                <td
                  style={{
                    textAlign: "left",
                    paddingLeft: "20px",
                    fontSize: "12px",
                  }}
                >
                  {day}
                </td>
                {timetable[day].map((activity, index) => (
                  <td>
                    <div className="flex flex-row">
                      <div style={{ marginRight: "5px" }}>
                        <input
                          key={index}
                          className="w-full text-xs min-w-36 py-1 text-center"
                          type="text"
                          placeholder="Enter Subject"
                          value={activity}
                          onChange={(e) =>
                            handleChange(day, index, e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <select
                          style={{ width: "80px" }}
                          onChange={(e) => {
                            handleChange(
                              day,
                              index,
                              timetable[day][index],
                              e.target.value
                            );
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default Timetable;
