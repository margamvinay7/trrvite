import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const StudentSlice = createSlice({
  name: "student",
  initialState: {
    studentId: "",
    year: "MBBS-I",
    navbar: "",
    username: "",
    roles: "",
    student: {},
  },
  reducers: {
    details: (state, action) => {
      state.student = action.payload;
      return state;
    },
    year: (state, action) => {
      state.year = action.payload;
      return;
    },
    navbar: (state, action) => {
      state.navbar = action.payload;
      return;
    },
    login: (state, action) => {
      state.username = action.payload;

      return;
    },
    author: (state, action) => {
      state.roles = action.payload;
      return;
    },
  },
});

export const studentActions = StudentSlice.actions;
export default StudentSlice;
