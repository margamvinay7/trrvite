import React from "react";

import "./Admin.css";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { studentActions } from "../../redux/Student";
import { useLocation, useNavigate } from "react-router-dom";

const Admin = () => {
  const path = useLocation().pathname;
  console.log(path);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navbar = useSelector((state) => state.studentReducer.navbar);
  // const user = useSelector((state) => state.studentReducer.username);
  // if (user === "") {
  //   navigate("/login");
  // }
  //   const isActive = useLocation().pathname == path;

  //   const handlePath = (path) => {
  //     if (isActive == path) {
  //       return true;
  //     }
  //     return false;
  //   };
  dispatch(studentActions.navbar(path));
  const handleNavbar = (e) => {
    // dispatch(studentActions.navbar(path));
  };
  return (
    <div className="Admin">
      <div className="custom-heading">
        <h1>Admin Login</h1>
      </div>
      <div className="custom-nav" onClick={(e) => handleNavbar(e)}>
        <button
          style={
            navbar == "/attendance"
              ? { backgroundColor: "rgba(18, 51, 77, 1)", marginBottom: 0 }
              : { backgroundColor: "rgba(18, 51, 77, 1)" }
          }
        >
          <Link to="/attendance" id="attendance">
            Attendance
          </Link>
        </button>
        <button
          style={
            navbar == "/results" || navbar == "/edit" || navbar == "/list"
              ? { backgroundColor: "rgba(26, 79, 123, 1)", marginBottom: 0 }
              : { backgroundColor: "rgba(26, 79, 123, 1)" }
          }
        >
          <Link to="/results" id="adminresult">
            Results
          </Link>
        </button>
        <button
          style={
            navbar == "/profiles" || navbar == "/updateProfile"
              ? { backgroundColor: "rgba(48, 139, 131, 1)", marginBottom: 0 }
              : { backgroundColor: "rgba(48, 139, 131, 1)" }
          }
        >
          <Link to="/profiles" id="adminprofile">
            Student Profiles
          </Link>
        </button>
        <button
          style={
            navbar == "/timetable" ||
            navbar == "/createNew" ||
            navbar == "/updatetimetable"
              ? { backgroundColor: "rgba(249, 133, 60, 1)", marginBottom: 0 }
              : { backgroundColor: "rgba(249, 133, 60, 1)" }
          }
        >
          <Link to="/timetable" id="admintimetable">
            Time Table
          </Link>
        </button>
        <button
          style={
            navbar == "/Reports"
              ? // navbar == "/ReportAttendance" ||
                // navbar == "/ReportResults"
                { backgroundColor: "rgba(48, 139, 131, 1)", marginBottom: 0 }
              : { backgroundColor: "rgba(48, 139, 131, 1)" }
          }
        >
          <Link to="/Reports" id="Reports">
            Reports
          </Link>
        </button>
        <button
          style={
            navbar == "/logout"
              ? { backgroundColor: "rgba(189, 68, 46, 1)", marginBottom: 0 }
              : { backgroundColor: "rgba(189, 68, 46, 1)" }
          }
        >
          <Link to="/logout" id="adminlogout">
            Log out
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Admin;
