import { configureStore } from "@reduxjs/toolkit";
import EditAssessmentSlice from "./Edit";
import StudentSlice from "./Student";

const store = configureStore({
  reducer: {
    editReducer: EditAssessmentSlice.reducer,
    studentReducer: StudentSlice.reducer,
  },
});

export default store;
