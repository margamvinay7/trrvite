import React from "react";
import { MdOutlineLock } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { studentActions } from "../redux/Student";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  // const [user, setUser] = useState({
  //   username: "",
  //   password: "",
  // });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("use", username, password);
    try {
      const response = await axios.post(
        "https://trrmedical.3pixelsonline.in/api/login/loginuser",
        {
          username,
          password,
        }
      );
      if (response.status == 200) {
        toast.success("Login Success");
      } else if (response.status == 201) {
        toast.error("Wrong Password");
      } else if (response.status == 204) {
        toast.error("User Not found");
      } else {
        toast.error("Invalid Username or Password");
      }
      console.log("log", response?.data);
      dispatch(studentActions.login(username));
      sessionStorage.setItem("token", response?.data);
      const token = sessionStorage.getItem("token");
      console.log("token", token);
      let user1;
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        const { user, roles } = decoded.UserInfo;
        user1 = user;
        const role = roles;
        dispatch(studentActions.login(user1));
        dispatch(studentActions.author(role));
      }

      if (user1 === "admin") {
        navigate("/admin");
      }
      if (user1 === "student") {
        navigate("/student");
      }
      console.log("log", response?.data);
    } catch (error) {
      console.error("Invalid Username or Password");
    }
  };

  // const handleChange = (e) => {
  //   setUser({ ...user, [e.target.name]: e.target.value });
  // };

  return (
    <div className="w-[100vw] flex bg-login justify-center  items-center h-[100vh]">
      <div className=" bg-login1 rounded-lg flex justify-center items-center flex-col w-72 h-80">
        <div className="text-white font-bold mb-5">Login</div>
        <Toaster />
        <div className="flex justify-center flex-col gap-y-5 items-center">
          <div className="flex bg-login2 w-48  rounded-[6px] ps-2 items-center">
            <CgProfile
              style={{
                color: "orange",

                height: 20,
                width: 20,
              }}
            />
            <input
              type="text"
              className=" bg-login2 w-[80%] text-sm  focus:outline-none a rounded-e-[6px] ps-2 py-1"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            ></input>
          </div>
          <div className="flex bg-login2 w-48  rounded-[6px] ps-2 items-center">
            <MdOutlineLock
              style={{
                color: "orange",

                height: 20,
                width: 20,
              }}
            />
            <input
              type="password"
              className="bg-login2 w-[80%] text-sm  focus:outline-none   py-1 rounded-[6px] ps-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
        </div>
        {/* <div className="gap-x-1 flex  justify-start me-20 items-center mt-5 ">
          <input id="remember" type="checkbox" />
          <label htmlFor="remember" className="text-white text-xs">
            Remember me
          </label>
        </div> */}
        <div className="flex flex-col justify-center mt-5 items-center">
          <button
            className=" bg-login3 text-white  w-32  mb-4 rounded-[5px] hover:bg-blue-600 py-1 active:outline active:outline-2 active:ring-offset-1  active:outline-blue-800"
            onClick={handleLogin}
          >
            Login
          </button>
          {/* <h1 className="text-white text-xs">Forgot your password?</h1> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
