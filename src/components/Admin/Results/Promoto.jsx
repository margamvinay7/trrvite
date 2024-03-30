import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

const Promoto = () => {
  const navigate = useNavigate();
  const [academicyearValue, setAcademicyearValue] = useState([]);
  const [yearValue, setYearValue] = useState([]);
  const [selectAcademic, setSelectAcademic] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [students, setStudents] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [year, setYear] = useState("");
  const [academicyear, setAcademicyear] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]); // State to store IDs of selected students

  const handleYearChange = async (e) => {
    setSelectYear(e.target.value);
    const year = e.target.value;
    const academicyear = selectAcademic;
    if (year !== null && academicyear !== null) {
      const response = await API.get(
        `/student/getStudentByYearAndAcademicYear?year=${year}&academicyear=${academicyear}`
      );
      setStudents(response?.data);
      setSearchList(response?.data);
    }
  };

  const handleAcademicChange = async (e) => {
    const year = selectYear;
    const academicyear = e.target.value;
    setSelectAcademic(e.target.value);
    const response = await API.get(
      `/student/getStudentByYearAndAcademicYear?year=${year}&academicyear=${academicyear}`
    );
    setStudents(response?.data);
    setSearchList(response?.data);
  };

  const handleSearch = (e) => {
    const searchResults = students.filter((item) => {
      return (
        item.id.includes(e.target.value) ||
        item.fullName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setSearchList(searchResults);
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === searchList.length) {
      setSelectedStudents([]);
      setSearchList(
        searchList.map((student) => ({ ...student, selected: false }))
      );
    } else {
      const allStudentIds = searchList.map((student) => student.id);
      setSelectedStudents(allStudentIds);
      setSearchList(
        searchList.map((student) => ({ ...student, selected: true }))
      );
    }
  };

  const handleIndividualSelect = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
    setSearchList(
      searchList.map((student) =>
        student.id === studentId
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  };

  const handleSubmit = async () => {
    // promotestudents
    console.log("values", year, academicyear);
    if (year !== "" && academicyear !== "" && selectedStudents !== null) {
      try {
        // Send updated student data to the server
        const response = await API.post(`/student/promotestudents`, {
          year: year.toUpperCase(),
          academicyear: academicyear,
          students: selectedStudents,
        });

        console.log("re", response);
        toast.success("Students Promoted successfully!");
        console.log("Student updated successfully!");
        setStudents([]);
        setSearchList([]);
        setYear("");
        setAcademicyear("");
        setSelectedStudents([]);
        setAcademicyearValue([]);
        setYearValue([]);

        getSelect();
      } catch (error) {
        toast.error("Failed to Promte Students");
        console.error("Error updating student:", error);
        setStudents([]);
        setSearchList([]);
        setYear("");
        setAcademicyear("");
        setSelectedStudents([]);
        // setTimeout(() => {
        //   navigate("/results");
        // }, 1000);
      }
    } else if (year == "") {
      toast.error("Year Field Is  Required");
    } else if (academicyear == "") {
      toast.error("Academic Field Is Reequired");
    } else {
      toast.error("Enter Year and Academicyear Fields");
    }

    console.log("promote");
    console.log("submitvalues", year, academicyear);
  };

  const getSelect = async () => {
    const response = await API.get("/student/getYearAndAcademicYear");
    setYearValue(response?.data?.years);
    setAcademicyearValue(response?.data?.academicyears);
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

  useEffect(() => {
    getSelect();
  }, []);

  return (
    <div className="bg-adminresuls relative min-h-[calc(100vh-140px)] pb-20 results min-w-[80%] flex mx-1 flex-col items-center pt-7">
      <Link
        className="absolute top-5 left-10 bg-adminlightdark p-2 rounded-full"
        to="/results"
      >
        <GoArrowLeft style={{ color: "white", height: 30, width: 30 }} />
      </Link>
      <h1 className="mb-3 text-adminyellow text-lg font-medium">
        Promote students
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
          <option>select</option>
          {sortedYears?.map((year) => (
            <option value={year}>{year}</option>
          ))}
        </select>
        <div className="flex items-center bg-white pe-2 rounded-md">
          <input
            className="w-[20vw] rounded-md text-black ps-2 placeholder-slate-600"
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
      <div className="Table ms-1">
        <table className="table-auto">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "30px" }}>
                Roll No
              </th>
              <th style={{ textAlign: "left", paddingLeft: "30px" }}>
                Student Name
              </th>
              <th style={{ textAlign: "left", paddingLeft: "30px" }}>
                <button onClick={handleSelectAll}>
                  {selectedStudents.length === searchList.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {searchList?.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: "left", paddingLeft: "30px" }}>
                  {item.id}
                </td>
                <td style={{ textAlign: "left", paddingLeft: "30px" }}>
                  {item?.fullName}
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleIndividualSelect(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10 flex gap-x-1">
        <input
          value={year}
          className="p-1  bg-adminprofileblue1 placeholder-black rounded-md "
          onChange={(e) => setYear(e.target.value.trim())}
          placeholder="Enter Year To Promote"
        />
        <input
          value={academicyear}
          className="p-1 bg-adminprofileblue1 placeholder-black rounded-md "
          onChange={(e) => setAcademicyear(e.target.value.trim())}
          placeholder="Enter Academicyear To Promote"
        />
        <button
          onClick={handleSubmit}
          className="bg-slate-800 text-white  hover:bg-slate-700 active:outline active:outline-slate-900 rounded-md text-sm p-2"
        >
          Promote
        </button>
      </div>
      {/* <div>
        <h2>Selected Students:</h2>
        <ul>
          {selectedStudents.map((studentId) => (
            <li key={studentId}>{studentId}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default Promoto;
