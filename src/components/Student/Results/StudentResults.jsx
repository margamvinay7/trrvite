import React, { useState, useEffect } from "react";
import "../Results/Results.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { API } from "../Student";

const StudentResults = () => {
  const year = useSelector((state) => state.studentReducer.year);
  const username = useSelector((state) => state.studentReducer.username);
  const [years, setYears] = useState([]);
  const [selectYear, setSelectYear] = useState("");
  const [selectAssessment, setSelectAssessment] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [assessmentSubjects, setAssessmentSubjects] = useState([]);

  // const getSelect = async () => {
  //   const response = await axios.get(
  //     "http://localhost:5000/select/getAssessmentyearAndAcademicyear"
  //   );
  //   setYears(response?.data?.years);

  //   console.log("response", response?.data?.years);
  // };

  const handleYearChange = async () => {
    // const year = e.target.value;
    // setSelectYear(e.target.value);

    const response = await API.get(
      `/result/getAssessmentsByYearAndId?id=${username}&year=${year}`
    );

    setAssessments(response?.data);
    console.log("ass", response.data);
  };

  const handleAssessmentChange = async (e) => {
    setSelectAssessment(e.target.value);
    const assessmentName = e.target.value;

    const response = await API.get(
      `/result/getAssessmentByYearAndIdAndAssessment?id=${username}&year=${year}&assessment=${assessmentName}`
    );
    // setAssessments(response?.data);
    setAssessmentSubjects(response?.data?.assessmentSubjects);
    console.log("assess res", response?.data);
  };

  const sortOrder = [
    "I-Internal Assessment",
    "II-Internal Assessment",
    "III-Internal Assessment",
    "Prefinal Assessment",
    "Final Assessment",
  ];

  const customSort = (a, b) => {
    const orderA = sortOrder.indexOf(a.assessment);
    const orderB = sortOrder.indexOf(b.assessment);
    return orderA - orderB;
  };

  const sortedData = assessments.sort(customSort);

  useEffect(() => {
    if (year) {
      setSelectYear(year);
      handleYearChange();
    }
    setSelectAssessment("");
    setAssessmentSubjects([]);
    // getSelect();
  }, [year]);
  return (
    <div className="studentResults min-h-[calc(100vh-248px)] pb-20">
      <div className="exam">
        {/* <div>
          <h4>Select Year</h4>
          <select value={selectYear} onChange={handleYearChange}>
            <option>select Year</option>
            {years?.map((year) => (
              <option value={year.year}>{year.year}</option>
            ))}
          </select>
        </div> */}
        <div>
          <h4>Select Exam</h4>
          <select value={selectAssessment} onChange={handleAssessmentChange}>
            <option>Select Exam</option>
            {sortedData?.map((assessment) => (
              <option value={assessment?.assessment}>
                {assessment.assessment}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="Table">
        <div className="text-white">{selectAssessment}</div>
        <table className="table-auto">
          <thead>
            <th style={{ textAlign: "left", paddingLeft: "20px" }}>
              DEPARTMENT
            </th>
            <th>THEORY 100 Marks</th>
            <th>PRACTICAL 100 Marks</th>
          </thead>
          <tbody>
            {assessmentSubjects?.map((subject) => (
              <tr>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {subject.subject}
                </td>
                <td>{subject.theoryMarks ? subject.theoryMarks : "-"}</td>
                <td>{subject.practicalMarks ? subject.practicalMarks : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentResults;
