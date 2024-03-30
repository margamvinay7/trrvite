import React, { useState, useEffect } from "react";
import "../../Reports/ReportProfiles.css";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../../Student/Student";

export const YearWise = ({
  academicyear,
  year,
  wise,
  category,
  type,
  search,
}) => {
  const [passedAcademicyear, setPassedAcademicyear] = useState(academicyear);
  const [passedYear, setPassedYear] = useState(year);
  const [passedwise, setPassedwise] = useState(wise);
  const [passedcategory, setPassedcategory] = useState(category);
  const [passedtype, setPassedtype] = useState(type);
  const [passedsearch, setPassedsearch] = useState(search);
  const [students, setStudents] = useState([]);
  const [searchlist, setSearchList] = useState([]);

  const getStudent = async () => {
    const response = await API.get(
      `/student/getStudentByYearAndAcademicYear?year=${passedYear}&academicyear=${passedAcademicyear}`
    );

    console.log("res", response?.data);

    setStudents(response?.data);
    setSearchList(response?.data);
  };

  const handleSearch = (searchString) => {
    console.log("ser", searchString == "");

    const serachResults = students.filter((item) => {
      return (
        item.id.includes(searchString) ||
        item.fullName.toLowerCase().includes(searchString.toLowerCase()) ||
        item.email.toLowerCase().includes(searchString.toLowerCase()) ||
        item.mobile.includes(searchString) ||
        item.joiningyear.includes(searchString) ||
        item.academicyear.includes(searchString)
      );
    });

    setSearchList(serachResults);
  };

  useEffect(() => {
    handleSearch(passedsearch);
  }, [passedsearch]);

  useEffect(() => {
    if (academicyear && year && wise && category && type) {
      setPassedAcademicyear(academicyear);
      setPassedYear(year);
      setPassedwise(wise);
      setPassedcategory(category);
      setPassedtype(type);
      setPassedsearch(search);
      console.log("set values", academicyear, year, wise, category, type);
    }
  }, [academicyear, year, wise, category, type, search]);

  useEffect(() => {
    if (
      passedAcademicyear &&
      passedYear &&
      passedwise &&
      passedcategory &&
      passedtype
    ) {
      console.log(
        "year and academicyear",
        passedAcademicyear,
        passedYear,
        passedwise,
        passedcategory,
        passedtype
      );
      getStudent();
    }
  }, [passedAcademicyear, passedYear, passedwise, passedcategory, passedtype]);
  return (
    <div className="bg-adminprofile  ReportProfiles   min-w-[80%] flex pb-20 mx-1 flex-col items-center pt-7">
      <div className="input">
        <Toaster />
        {/* <div className="flex items-center bg-white pe-2 rounded-md">
          <input
            className="w-[35vw] rounded-md text-black ps-2 p-1  placeholder-slate-600"
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
        </div> */}
      </div>
      <div className="Table table-container ">
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>

              <th style={{ textAlign: "left", paddingLeft: "30px" }}>Mobile</th>
              <th>Parent Name</th>
              <th>Parent Mobile</th>

              <th style={{ textAlign: "left", paddingLeft: "40px" }}>Email</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {searchlist?.map((student) => (
              <tr>
                <td>{student.id} </td>
                <td>{student.fullName == null ? "-" : student.fullName}</td>
                <td>{student.mobile == null ? "-" : student.mobile} </td>
                <td>{student.parentName == null ? "-" : student.parentName}</td>
                <td>
                  {student.parentMobile == null ? "-" : student.parentMobile}{" "}
                </td>
                <td>{student.email == null ? "-" : student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
