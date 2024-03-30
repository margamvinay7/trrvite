import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const EditAssessmentSlice = createSlice({
  name: "edit",
  initialState: {
    year: "",
    academicyear: "",
    assessment: "",
  },
  reducers: {
    editList: (state, action) => {
      state.year = action.payload.year;
      state.academicyear = action.payload.academicyear;
      state.assessment = action.payload.assessment;
      return state;
    },
  },
});

export const editActions = EditAssessmentSlice.actions;
export default EditAssessmentSlice;
