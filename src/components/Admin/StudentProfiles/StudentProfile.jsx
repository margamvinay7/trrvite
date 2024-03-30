import React, { useEffect } from "react";
import "../StudentProfiles/StudentProfile.css";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import { API } from "../../Student/Student";
import { FiSearch } from "react-icons/fi";

const StudentProfile = () => {
  const [file, setFile] = useState(null);
  const [yearValue, setYearValue] = useState([]);
  const [academicyearValue, setAcademicYearValue] = useState([]);
  const [selectAcademic, setSelectAcademic] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [students, setStudents] = useState([]);
  const [searchlist, setSearchList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  console.log("studentprofile");

  const handleButtonClick = () => {
    setIsOpen(true); // Open popup on button click
  };

  const handleDelete = async () => {
    const year = selectYear;
    const academicyear = selectAcademic;

    if (year && academicyear) {
      try {
        const response = await API.post(`/student/deleteStudents`, {
          year: year.toUpperCase(),
          academicyear: academicyear,
        });
        if (response.status == 200) {
          toast.success("Student Data Deleted  successfully! ");
          console.log("Student updated successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.log("err", error);
        toast.error("Failed to  Delete Students Data");
      }

      console.log("Item deleted!");
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false); // Close popup on cancel
  };

  const handleYearChange = async (e) => {
    setSelectYear(e.target.value);
    const year = e.target.value;
    const academicyear = selectAcademic;
    // const response = await API.get(
    //   `/student/getStudentByYearAndAcademicYear?year=MBBS-I&academicyear=2024-2025`
    // );
    let response;

    if (year && academicyear) {
      console.log("res1", year, academicyear);
      response = await API.get(
        `/student/getStudentByYearAndAcademicYear?year=${year}&academicyear=${academicyear}`
      );
      setStudents(response?.data);
      setSearchList(response?.data);
      console.log("stude", response);
    }

    // setStudents(response?.data);
    // console.log("stude", response);
  };
  const handleAcademicChange = async (e) => {
    const year = selectYear;
    const academicyear = e.target.value;
    setSelectAcademic(e.target.value);
    // const response = await API.get(
    //   `/student/getStudentByYearAndAcademicYear?year=MBBS-I&academicyear=2024-2025`
    // );
    let response;

    if (year && academicyear) {
      console.log("res1", year, academicyear);
      response = await API.get(
        `/student/getStudentByYearAndAcademicYear?year=${year}&academicyear=${academicyear}`
      );
      setStudents(response?.data);
      setSearchList(response?.data);
      console.log("stude", response);
    }

    // setStudents(response?.data);
    // console.log("stude", response);
  };

  const handleSearch = (e) => {
    const serachResults = students.filter((item) => {
      return (
        item.id.includes(e.target.value) ||
        item.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.mobile.includes(e.target.value) ||
        item.joiningyear.includes(e.target.value) ||
        item.academicyear.includes(e.target.value)
      );
    });
    setSearchList(serachResults);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getSelect = async () => {
    const response = await API.get("/student/getYearAndAcademicYear");
    setYearValue(response?.data?.years);
    setAcademicYearValue(response?.data?.academicyears);
    // setSelectAcademic(response?.data?.academicyears[0]);
    // setSelectYear(response?.data?.years[0]);
    console.log("response", response?.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("excelFile", file);

    try {
      if (file !== null) {
        const response = await API.post(
          "/student/createStudent",
          formData
        ).then((res) => {
          // toast.success("File uploaded successfully");
          if (res.status == 200) {
            toast.success("File uploaded successfully");
            console.log("File uploaded successfully", res);

            setFile(null);
            e.target.reset();

            getSelect();
          } else {
            console.log(res);
            toast.error("Failed to upload file , Check File");

            setFile(null);
            e.target.reset();
            console.error("Failed to upload file");
          }
        });
      }
    } catch (error) {
      toast.error("Failed to upload file , Check File");
      console.error("Error:", error);
      setFile(null);
      e.target.reset();
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

  const handleSelectClick = () => {
    // Clear the file input when the "select" button is clicked
    setFile(null);
  };

  useEffect(() => {
    getSelect();
  }, []);

  return (
    <div className="bg-adminprofile min-h-[calc(100vh-140px)] profiles pb-20  min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <h1 className="mb-3 font-medium ">Student Profiles</h1>
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
        <Toaster />
        <div>
          <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
            <button className="me-1">
              <label htmlFor="excel" onClick={handleSelectClick}>
                Select
              </label>
            </button>
            <button type="submit">Upload</button>

            <input
              id="excel"
              type="file"
              name="excelFile"
              className=" absolute -top-full"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </form>
        </div>

        {/* delete students profiles
         <div className="popup-container ">
          <button onClick={handleButtonClick}>Delete</button>
          {isOpen && (
            <div className="popup-overlay">
              <div className="popup ">
                <p className="text-black mt-4">
                  Are you sure you want to delete?
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
                  <button
                    onClick={handleDelete}
                    style={{
                      backgroundColor: "rgba(189, 68, 46, 1)",
                      color: "white",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div> */}
        <div className="flex items-center bg-white pe-2 rounded-md">
          <input
            className="w-[15vw] rounded-md text-black ps-2 p-1  placeholder-slate-600"
            onChange={handleSearch}
            placeholder="Search Student"
          />
          <FiSearch
            style={{
              color: "black",

              height: 25,
              width: 25,
            }}
          />
        </div>
      </div>
      <div className="Table table-container ">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>
              <th>Gender</th>
              <th style={{ textAlign: "left", paddingLeft: "30px" }}>Mobile</th>

              <th style={{ textAlign: "left", paddingLeft: "40px" }}>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {searchlist?.map((student) => (
              <tr>
                <td>{student.id} </td>
                <td>{student.fullName == null ? "-" : student.fullName}</td>
                <td>{student.gender == null ? "-" : student.gender} </td>
                <td>{student.mobile == null ? "-" : student.mobile} </td>
                <td>{student.email == null ? "-" : student.email}</td>
                <td>
                  <button>
                    <Link to="/updateProfile" state={{ id: `${student.id}` }}>
                      <CiEdit
                        style={{
                          color: "black",

                          height: 20,
                          width: 20,
                        }}
                      />
                    </Link>
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

export default StudentProfile;
