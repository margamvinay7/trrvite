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

  const handleYearChange = async () => {
    const response = await API.get(
      `/result/getAssessmentsByYearAndId?id=${username}&year=${year}`
    );

    setAssessments(response?.data);
  };

  const handleAssessmentChange = async (e) => {
    setSelectAssessment(e.target.value);
    const assessmentName = e.target.value;

    const response = await API.get(
      `/result/getAssessmentByYearAndIdAndAssessment?id=${username}&year=${year}&assessment=${assessmentName}`
    );

    setAssessmentSubjects(response?.data?.assessmentSubjects);
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
  }, [year]);
  return (
    <div className="studentResults min-h-[calc(100vh-232px)] pb-20">
      <div className="exam">
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
      <div className="Table table-container">
        <div className="text-white">{selectAssessment}</div>
        <table className="table-auto scroll-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "20px" }}>
                DEPARTMENT
              </th>
              {/* Wrap THEORY content in two lines */}
              <th>
                THEORY <br />
                100 Marks
              </th>
              {/* Wrap PRACTICAL content in two lines */}
              <th>
                PRACTICAL <br />
                100 Marks
              </th>
            </tr>
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
