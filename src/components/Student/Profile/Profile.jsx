import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { useSelector } from "react-redux";
import { API } from "../Student";

const Profile = () => {
  const [per, setPer] = useState();
  const [results, setResults] = useState([]);
  const [attendence, setattendence] = useState([]);
  const student = useSelector((state) => state.studentReducer.student);
  const [status, setStatus] = useState("");
  const getResultStatus = async () => {
    const assessment = "Final Assessment";

    const response = await API.get(
      `/result/getResultByYearsAndAcademicYearAndStudentId?studentId=${student.id}&assessment=${assessment}`
    );
    console.log("results", response?.data);
    setResults(response?.data);

    const set = response?.data?.forEach((item) => {
      if (item.finalstatus !== "Passed" || item.finalstatus == "Pass") {
        setStatus("Fail");
      }
    });
  };

  const getAttendence = async () => {
    const response = await API.get(
      `/attendance/getTotalAttendance?id=${student.id}`
    );
    console.log("tot", response);
    const filterData = response?.data.filter((item) => {
      return item.totalSubjectsCount !== 0;
    });
    setattendence(filterData);
    const set = filterData.forEach((item) => {
      if (
        Number(
          (item.totalTPresentSubjectsCount / item.totalTSubjectsCount) * 100
        ) < 80 ||
        Number(
          (item.totalPPresentSubjectsCount / item.totalPSubjectsCount) * 100
        ) < 75
      ) {
        setPer("ok");
      }
    });
  };

  const sortOrder = ["MBBS-I", "MBBS-II", "MBBS-III", "MBBS-IV"];

  const customSort = (a, b) => {
    const orderA = sortOrder.indexOf(a.year);
    const orderB = sortOrder.indexOf(b.year);
    return orderA - orderB;
  };

  const sortedResults = results.sort(customSort);
  const sortedAttendance = attendence.sort(customSort);
  console.log("values", Number((0 / 0) * 100).toFixed(2));

  useEffect(() => {
    // if (student.id) {
    //   console.log("studentid", student.id);
    //   getResultStatus();
    //   getAttendence();
    // }
    getAttendence();
    getResultStatus();
  }, [student]);

  return (
    <div
      className="min-h-[calc(100vh-248px)] pb-20 bg-adminprofile sProfile flex flex-col pt-16
        text-black"
    >
      <div className="  flex flex-col ps-10 sm:ps-20 md:ps-40">
        <div>
          Full Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
          {student?.fullName}
        </div>
        <div>
          Roll
          No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
          &nbsp;
          {student?.id}
        </div>
        <div>
          Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          : &nbsp;{student?.year}
        </div>
        <div>
          Joining Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
          {student?.joiningyear}
        </div>
        <div>
          Acad. Year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
          {student?.academicyear}
        </div>
        <div>
          Gender&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
          &nbsp;
          {student?.gender}
        </div>
        <div>
          Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
          &nbsp;
          {student?.email}
        </div>
        <div>
          Mobile&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
          &nbsp;
          {student?.mobile}
        </div>
        <div>
          Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
          &nbsp;
          {student?.address}
        </div>
      </div>

      <div className="results">
        <div>Exam Result</div>
        <table className="table-auto">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "20px" }}>COURSE</th>
              <th>Year</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults?.map((result) => (
              <>
                <tr>
                  <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                    {result.year}
                  </td>
                  <td>{result?.academicyear}</td>
                  <td
                    style={result.finalstatus == "Fail" ? { color: "red" } : {}}
                  >
                    {result.finalstatus}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {status == "Fail" && (
          <div className="text-white mt-1 text-sm ms-5 sm:ms-0">
            Parents are advices to contact Dean as your child as failed
          </div>
        )}
      </div>

      <div className="results">
        <div>Over all Attendance</div>
        <table className="table-auto">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "20px" }}>COURSE</th>
              <th>Year</th>
              <th>Theory</th>
              <th>Practical</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttendance?.map((attendence, index) => (
              <tr>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {attendence.year}
                </td>
                <td>{attendence?.academicyear}</td>
                <td
                  style={
                    Number(
                      (attendence.totalTPresentSubjectsCount /
                        attendence.totalTSubjectsCount) *
                        100
                    ) < 80
                      ? { color: "red" }
                      : {}
                  }
                >
                  {attendence.totalTSubjectsCount !== 0
                    ? Number(
                        (attendence.totalTPresentSubjectsCount /
                          attendence.totalTSubjectsCount) *
                          100
                      ).toFixed(2) + "%"
                    : "-"}
                </td>
                <td
                  style={
                    Number(
                      (attendence.totalPPresentSubjectsCount /
                        attendence.totalPSubjectsCount) *
                        100
                    ) < 75
                      ? { color: "red" }
                      : {}
                  }
                >
                  {/* {Number(
                    (attendence.totalPPresentSubjectsCount /
                      attendence.totalPSubjectsCount) *
                      100
                  ).toFixed(2)}
                  % */}
                  {attendence.totalPSubjectsCount !== 0
                    ? Number(
                        (attendence.totalPPresentSubjectsCount /
                          attendence.totalPSubjectsCount) *
                          100
                      ).toFixed(2) + "%"
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {per == "ok" && (
          <div className="text-white mt-1 text-sm ms-5 sm:ms-0">
            Parents are advices to contact Dean as your child as Insufficient
            attendance
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
