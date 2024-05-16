import React, { useEffect } from "react";
import "../Results/Results.css";
import { useState, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { editActions } from "../../../redux/Edit";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Notification from "../../Notification";
// import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { API } from "../../Student/Student";

const Results = () => {
  const buttonRef = useRef(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [yearValue, setYearValue] = useState([]);
  const [academicyearValue, setAcademicYearValue] = useState([]);
  const [selectAcademic, setSelectAcademic] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [newexam, setNewexam] = useState("");
  const [current, setCurrent] = useState("");
  const [currentAssessment, setCurrentAssessment] = useState("");
  const [editedName, setEditedName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deletePopupId, setDeletePopupId] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);

    // Trigger click event on the button element
  };

  const handleYearChange = async (e) => {
    setSelectYear(e.target.value);
    const year = e.target.value;
    const academicyear = selectAcademic;
    if (year !== null && academicyear !== null) {
      const response = await API.get(
        `/result/getAssessments?year=${year}&academicyear=${academicyear}`
      );
      setAssessments(response?.data);
    }
  };
  const handleAcademicChange = async (e) => {
    const year = selectYear;
    const academicyear = e.target.value;
    setSelectAcademic(e.target.value);
    const response = await API.get(
      `/result/getAssessments?year=${year}&academicyear=${academicyear}`
    );
    setAssessments(response?.data);
  };

  const uploaded = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;

    const response = await API.get(
      `/result/getAssessments?year=${year}&academicyear=${academicyear}`
    );
    setAssessments(response?.data);
  };

  const getSelect = async () => {
    const response = await API.get("/result/getAssessmentyearAndAcademicyear");
    setYearValue(response?.data?.years);
    setAcademicYearValue(response?.data?.academicyears);
  };

  const sortMBBSValues = (a, b) => {
    // Extract the alphabetic part from the strings
    const getAlphabeticPart = (str) => str?.split("-")[1];

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
      return parseInt(academicYear?.split("-")[1]);
    };

    // Sort by descending order of last year
    return getLastYear(b) - getLastYear(a);
  };

  const sortedAcademicYears = academicyearValue.sort(compareAcademicYears);

  const handleAddExam = (e, nameChange = null) => {
    if (newexam?.length !== 0) {
      if (nameChange !== null) {
        const updatedAssessments = assessments.map((assessment) => {
          if (assessment.name === editedName) {
            return { ...assessment, name: newexam };
          }
          return assessment;
        });
        setAssessments(updatedAssessments);
        setNewexam("");
      } else {
        const existingIndex = assessments.findIndex(
          (assessment) => assessment.name === newexam
        );
        if (existingIndex !== -1) {
          // Assessment already exists, don't add it again

          return;
        }
        // Add new assessment
        setAssessments([
          ...assessments,
          { name: newexam, assessment: "assessment" },
        ]);
        setCurrent(newexam);
        setNewexam("");
      }
    } else {
      toast.error("Enter Exam Name");
    }
  };

  const handleSubmit = async (e, name) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("excelFile", file);
    formData.append("name", name);

    try {
      let response;
      if (file !== null) {
        response = await API.post("/result/createResults", formData);
        if (response.status == 200) {
          setNotification({
            message: "Results Upload Successfully!",
            type: "success",
          });
          setTimeout(() => {
            setNotification({
              message: "",
              type: "",
            });
          }, 3000);

          toast.success("File uploaded successfully");

          setFile(null);
          e.target.reset();
          getSelect();
          uploaded();
        } else {
          toast.error("Failed to upload file");
        }
      }
    } catch (error) {
      setNotification({
        message: "Failed to Upload Results",
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

  const handleEdit = async (e) => {
    const data = {
      year: selectYear,
      academicyear: selectAcademic,
      assessment: e.target.id,
    };
    const response = dispatch(editActions.editList(data));
    navigate("/list");
  };

  const handleChangeName = (assessment) => {
    setEditedName(assessment.name);
    setCurrentAssessment(assessment);
    if (currentAssessment) {
      const input = document.getElementById("input");
      input.value = currentAssessment.name;
      const inputbtn = document.getElementById("inputbtn");
      inputbtn.innerText = "Update Name";
      input.focus();
    }
  };

  useEffect(() => {
    if (currentAssessment) {
      const input = document.getElementById("input");
      input.value = currentAssessment.name;
      const inputbtn = document.getElementById("inputbtn");
      inputbtn.innerText = "Update Name";
      input.focus();
    }
  }, [currentAssessment]);

  const handleUpdateName = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;

    if (year && academicyear && currentAssessment) {
      try {
        const response = await API.post("/result/updateAssessmentName", {
          year: year,
          academicyear: academicyear,
          assessment: currentAssessment.assessment,
          newName: newexam,
        });
        if (response.status == 200) {
          toast.success("Assessment Name Updated");
          setNotification({
            message: "Assessment Name Updated",
            type: "success",
          });
          setTimeout(() => {
            setNotification({
              message: "",
              type: "",
            });
          }, 3000);
          setNewexam("");
          uploaded();
        }
      } catch (error) {
        const updatedAssessments = assessments.map((assessment) => {
          if (assessment.name === editedName) {
            return { ...assessment, name: newexam };
          }
          return assessment;
        });

        setAssessments(updatedAssessments);
        setNewexam("");
        setNotification({
          message: "Assessment Name Updated Locally",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);

        toast.success("Assessment Name Updated Locally");
      }
    } else {
      assessments.forEach((assessment) => {
        if (assessment.name === editedName) {
          handleAddExam("e", assessment.name);
        }
      });
    }
    const input = document.getElementById("input");
    input.value = "";
    const inputbtn = document.getElementById("inputbtn");
    inputbtn.innerText = "Create New Exam";
  };

  const handleSelectClick = () => {
    // Clear the file input when the "select" button is clicked
    setFile(null);
  };

  const getBtn = () => {
    const inputbtn = document.getElementById("inputbtn");
    return inputbtn?.textContent?.trim();
  };

  const handleDelete = async (assessment) => {
    const year = selectYear;
    const academicyear = selectAcademic;

    try {
      const response = await API.post("/result/deleteAssessment", {
        year: year,
        academicyear: academicyear,
        assessment: assessment,
      });
      if (response.status == 200) {
        toast.success("Assessment Deleted");
        setNotification({
          message: "Assessment Deleted!",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);
        setIsOpen(false);
        getSelect();
        uploaded();
      } else {
      }
    } catch (error) {
      setNotification({
        message: error.message,
        type: "error",
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);
      toast.error(error.message);
      setIsOpen(false);
    }
    setDeletePopupId(null);
    setIsOpen(false);
  };

  // for storting of assessments
  const sortOrder = [
    "I-Internal Assessment",
    "II-Internal Assessment",
    "III-Internal Assessment",
    "Prefinal Assessment",
    "Final Assessment",
  ];

  const customSort = (a, b) => {
    const orderA = sortOrder.indexOf(a.name);
    const orderB = sortOrder.indexOf(b.name);
    return orderA - orderB;
  };

  const sortedData = assessments?.sort(customSort);

  const handleButtonClick = (assessmentId) => {
    setDeletePopupId(assessmentId);
    setIsOpen(true); // Open popup on button click
  };

  const handleCancel = () => {
    setIsOpen(false); // Close popup on cancel
  };

  useEffect(() => {
    getSelect();
  }, []);

  return (
    <div className="  bg-adminresuls min-h-[calc(100vh-140px)] pb-20 results min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <h1 className="mb-3 text-adminyellow text-lg font-medium">
        Student Results
      </h1>
      {notification.message && <Notification {...notification} />}
      <div className="details">
        <input
          id="input"
          type="text"
          placeholder="Type Exam Name"
          onChange={(e) => setNewexam(e.target.value)}
          value={newexam}
          className=" placeholder-black px-1 text-sm min-w-40 bg-adminlightblue"
        />
        <small
          id="inputbtn"
          onClick={
            getBtn() === "Create New Exam" ? handleAddExam : handleUpdateName
          }
          className=" bg-adminlightblue px-2 py-1 cursor-pointer hover:bg-blue-500 active:outline-blue-200 active:outline text-nowrap rounded-sm"
        >
          Create New Exam
        </small>
      </div>
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
        <button className="bg-white p-1 rounded-sm">
          <Link to="/promote">Promote Students</Link>
        </button>
      </div>
      <div className="Table">
        <table className="table-auto ">
          <thead className="resultsHead">
            <tr>
              <th className="left-align">EXAM</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className="resultsTable">
            {sortedData?.map((assessment) => (
              <tr>
                <td className="left-align">{assessment.name}</td>
                <td>
                  {" "}
                  <button onClick={() => handleChangeName(assessment)}>
                    <CiEdit
                      style={{
                        color: "white",

                        height: 20,
                        width: 20,
                      }}
                    />
                  </button>
                </td>
                <td>
                  {/* <button onClick={() => handleDelete(assessment.assessment)}>
                    <FaRegCircleXmark
                      style={{
                        color: "white",

                        height: 20,
                        width: 20,
                      }}
                    />
                  </button> */}
                  <div className="popup-container">
                    <button
                      onClick={() => handleButtonClick(assessment.assessment)}
                    >
                      <FaRegCircleXmark
                        style={{ color: "white", height: 20, width: 20 }}
                      />
                    </button>
                    {isOpen && deletePopupId === assessment.assessment && (
                      <div className="popup-overlay">
                        <div className="popup">
                          <p className="text-black mt-4">
                            <span>Are you sure you want to delete?</span>
                            <div className="mt-2">
                              Note: Deleting this Results,
                              <br /> You will lose the Results records
                            </div>
                          </p>
                          <div className="flex justify-between mt-4 pop">
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
                              onClick={() =>
                                handleDelete(assessment.assessment)
                              }
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
                </td>
                <td style={{ padding: 0 }}>
                  <form
                    onSubmit={(e) => handleSubmit(e, assessment.name)}
                    encType="multipart/form-data"
                  >
                    <button className="  bg-slate-800 hover:bg-slate-500 active:outline active:outline-slate-300 p-1 rounded-sm">
                      <label htmlFor="excel" onClick={handleSelectClick}>
                        Select
                      </label>
                    </button>
                    <button
                      type="submit"
                      className=" bg-slate-800 ms-1  hover:bg-slate-500 active:outline active:outline-slate-300 p-1  "
                      disabled={assessment.assessment !== "assessment"}
                      style={
                        assessment.assessment !== "assessment"
                          ? {
                              backgroundColor: "rgba(30,41,59,0.6)",
                              outline: "none",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                    >
                      Upload
                    </button>

                    <input
                      id="excel"
                      type="file"
                      name="excelFile"
                      className=" absolute -top-full"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                    />
                  </form>
                </td>
                <td>
                  <button
                    className="me-2 bg-slate-800  hover:bg-slate-500 active:outline active:outline-slate-300  p-1 rounded-sm"
                    onClick={handleEdit}
                    id={assessment.assessment}
                  >
                    Edit List
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
