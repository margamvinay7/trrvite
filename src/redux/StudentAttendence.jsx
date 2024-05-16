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
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      return;
    },
    setDate: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      return;
    },
    setMonth: (state, action) => {},
  },
});
