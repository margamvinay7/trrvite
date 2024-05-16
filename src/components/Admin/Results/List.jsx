import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Results.css";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { API } from "../../Student/Student";
import { GoArrowLeft } from "react-icons/go";

const List = () => {
  const data = useSelector((state) => state.editReducer);
  const [count, setCount] = useState([]);

  const [list, setList] = useState([]);
  const [searchlist, setSearchList] = useState([]);

  const getAssessmentList = async () => {
    // http://localhost:5000/result/getAssessmentList/Mbbs-1/2024-2030/internal-15
    const response = await API.get(
      `/result/getAssessmentList?year=${data.year}&academicyear=${data.academicyear}&assessment=${data.assessment}`
    );
    setList(response.data);

    setSearchList(response.data);
  };

  const handleSearch = (e) => {
    const serachResults = list.filter((item) => {
      return (
        item.studentId.includes(e.target.value) ||
        item.studentName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setSearchList(serachResults);
  };

  useEffect(() => {
    if (data.year && data.academicyear && data.assessment) {
      getAssessmentList();
    }
  }, [data]);
  return (
    <div className=" bg-adminresuls relative pb-20 min-h-[calc(100vh-140px)] results min-w-[80%] flex  mx-1 flex-col items-center pt-7">
      <Link
        className="absolute top-5 left-10 bg-adminlightdark p-2 rounded-full"
        to="/results"
      >
        <GoArrowLeft style={{ color: "white", height: 30, width: 30 }} />
      </Link>
      <div className="flex items-center bg-white pe-2 rounded-md">
        <input
          className="w-[55vw] rounded-md text-black ps-4 py-1 placeholder-slate-600"
          onChange={handleSearch}
          placeholder="Search By Name Or Roll No"
        />
        <FiSearch
          style={{
            color: "black",

            height: 25,
            width: 25,
          }}
        />
      </div>
      <div className="m-5 text-white text-lg">{data.assessment}</div>
      <div className="Table ms-1">
        <table className=" table-auto">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "30px" }}>
                Roll No
              </th>
              <th style={{ textAlign: "left", paddingLeft: "30px" }}>
                Student Name
              </th>

              {/* {count?.map((subject) => (
                <th>{`${subject.subject} TM PM`}</th>
              ))} */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {searchlist?.map((item) => (
              <tr>
                <td style={{ textAlign: "left", paddingLeft: "30px" }}>
                  {item.studentId}
                </td>
                <td style={{ textAlign: "left", paddingLeft: "30px" }}>
                  {item?.studentName}
                </td>

                {/* {item?.AssessmentSubject?.map((subject) => (
                  <td>{`${subject.subject} ${subject.theoryMarks} ${subject.practicalMarks}`}</td>
                ))} */}
                <td style={{ paddingLeft: "20px" }}>
                  <button>
                    <Link
                      to="/edit"
                      state={{
                        id: `${item?.id}`,
                        name: `${item?.studentName}`,
                        studentId: `${item?.studentId}`,
                      }}
                    >
                      <CiEdit
                        style={{
                          color: "white",

                          height: 25,
                          width: 25,
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

export default List;
