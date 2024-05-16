import "./App.css";
import { useEffect, useState } from "react";
import Admin from "./components/Admin/Admin";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Attendence from "./components/Admin/Attendence/Attendence";
import Results from "./components/Admin/Results/Results";
import StudentProfile from "./components/Admin/StudentProfiles/StudentProfile";
import TimeTable from "./components/Admin/TimeTable/TimeTable";

import StudentAttendence from "./components/Student/Attendence/StudentAttendence";
import Profile from "./components/Student/Profile/Profile";
import Student from "./components/Student/Student";
import StudentResults from "./components/Student/Results/StudentResults";
import DateWise from "./components/Student/Attendence/DateWise";
import Logout from "./components/Logout";
import List from "./components/Admin/Results/List";
import Edit from "./components/Admin/Results/Edit";
import CreateNew from "./components/Admin/TimeTable/CreateNew";
import UpdateTable from "./components/Admin/TimeTable/UpdateTable";
import Login from "./components/Login";
import UpdateProfile from "./components/Admin/StudentProfiles/UpdateProfile";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { studentActions } from "./redux/Student";
import Promoto from "./components/Admin/Results/Promoto";
import EditAttendance from "./components/Admin/Attendence/EditAttendance";
import Reports from "./components/Admin/Reports/Reports";

function App() {
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const pathArray = path.split("/");
  const navigate = useNavigate();
  const user = useSelector((state) => state.studentReducer.roles);
  // const user = "student";

  const token = sessionStorage.getItem("token");

  let user1;
  if (token) {
    const decoded = jwtDecode(token);

    const { user, roles } = decoded.UserInfo;
    user1 = user;
    const role = roles;
    dispatch(studentActions.login(user1));
    dispatch(studentActions.author(role));
  }

  const [route, setRoute] = useState(pathArray.includes("student"));

  useEffect(() => {
    if (user == "") {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      {/* {user === "admin" ? <Admin /> : <Login />}
      {user === "student" ? <Student /> : <Login />} */}

      {user === "admin" ? <Admin /> : user === "student" ? <Student /> : ""}

      <Routes>
        {user === "" ? (
          <Route path="/login" element={<Login />} />
        ) : user === "admin" ? (
          <>
            {/* <Admin /> */}
            {/* <Route path="/admin/*" element={<Admin />} /> */}
            <Route path="/updateprofile" element={<UpdateProfile />} />
            <Route path="/attendance" element={<Attendence />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profiles" element={<StudentProfile />} />
            <Route path="/timetable" element={<TimeTable />} />
            <Route path="/promote" element={<Promoto />} />
            <Route path="/createNew" element={<CreateNew />} />
            <Route path="/list" element={<List />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/editattendance" element={<EditAttendance />} />
            <Route path="/updatetimetable" element={<UpdateTable />} />
          </>
        ) : user === "student" ? (
          <>
            {/* <Student /> */}
            {/* <Route path="/student/*" element={<Student />} /> */}
            <Route path="/student/profile" element={<Profile />} />
            <Route
              path="/student/attendance"
              DateWise={DateWise}
              element={<StudentAttendence />}
            />

            <Route path="/student/results" element={<StudentResults />} />
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
