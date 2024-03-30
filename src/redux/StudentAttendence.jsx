import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const studentAttendence = createSlice({
  name: "studentAttendence",
  initialState: {
    startDate,
    endDate,
    month,
  },
  reducers: {
    setDate: (state, action) => {
      console.log("selected Dates", startDate, endDate);
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      return;
    },
    setDate: (state, action) => {
      console.log("selected Dates", startDate, endDate);
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      return;
    },
    setMonth: (state, action) => {
      console.log("selected Month", action.payload.month);
    },
  },
});
