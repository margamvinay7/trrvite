import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../Student/Student";
import { GoArrowLeft } from "react-icons/go";
import Notification from "../../Notification";

const Edit = () => {
  let { state } = useLocation();
  const id = state.id;
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [subjects, setSubjects] = useState([]);
  const [assessment, setAssessment] = useState({});

  const getAssessment = async () => {
    const response = await API.get(`/result/getAssessmentById?id=${state.id}`);

    setSubjects(response?.data);
  };

  const handleSend = async () => {
    try {
      let response;

      response = await API.post(`/result/updateAssessment?id=${id}`, subjects);
      if (response.status == 200) {
        setNotification({
          message: "Assessment Edited!",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);

        toast.success("Assessment Edited");

        getAssessment();
      } else {
      }
    } catch (error) {
      setNotification({
        message: "Failed to Edit Assessment",
        type: "error",
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);
      toast.error("Failed to upload file");
    }
  };

  useEffect(() => {
    if (state.id) {
      getAssessment();
    }
  }, [state]);

  const handleUpdate = (id, propertyname, propertyvalue) => {
    setSubjects(
      subjects?.map((item) =>
        item.id === id
          ? { ...item, [propertyname.trim()]: propertyvalue.trim() }
          : item
      )
    );
  };
  return (
    <div className=" bg-adminresuls relative mx-1 flex min-h-[calc(100vh-140px)] p-2 pt-10 pb-20 flex-col items-center ">
      <Link
        className="absolute top-5 left-10 bg-adminlightdark p-2 rounded-full"
        to="/list"
      >
        <GoArrowLeft style={{ color: "white", height: 30, width: 30 }} />
      </Link>
      {notification.message && <Notification {...notification} />}
      <div className="text-white mt-1 text-xl">Edit Assessment</div>
      <div className="flex mt-5 flex-col gap-y-1">
        <div className="text-white m text-sm">
          <span className=" font-medium text-yellow-400">Student Name</span>
          &nbsp;&nbsp;: {`${state.name}`}
        </div>
        <div className="text-white mb-5 text-sm">
          <span className=" font-medium text-yellow-400">Student Id</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
          {`${state.studentId}`}
        </div>
      </div>

      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-x-6">
        {subjects?.map((item) => (
          <div>
            <hr />
            <div className="mb-2 my-2">
              <label htmlFor="subject" className="me-4 text-base text-white">
                Subject&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <input
                type="text"
                id="subject"
                className="text-center  text-sm py-1 rounded-md"
                value={item.subject}
                onChange={(e) =>
                  handleUpdate(item.id, "subject", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="theory" className="me-4 text-base text-white">
                Theory Marks&nbsp;&nbsp;
              </label>
              <input
                type="text"
                id="theory"
                className="text-center  text-sm py-1 rounded-md"
                value={item.theoryMarks}
                onChange={(e) =>
                  handleUpdate(item.id, "theoryMarks", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="practical" className="me-4  text-base text-white">
                Practical Marks
              </label>
              <input
                type="text"
                id="practical"
                className="text-center  text-sm py-1 rounded-md "
                value={item.practicalMarks}
                onChange={(e) =>
                  handleUpdate(item.id, "practicalMarks", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="subject" className="me-4 text-base text-white">
                Status{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <input
                type="text"
                id="status"
                className="text-center  text-sm py-1 rounded-md "
                value={item.status}
                onChange={(e) =>
                  handleUpdate(item.id, "status", e.target.value)
                }
              />
            </div>
            <hr />
          </div>
        ))}
      </div>
      <button
        onClick={handleSend}
        className="bg-slate-800 text-white text-sm hover:bg-slate-700 active:outline active:outline-slate-900 rounded-md my-5 p-2"
      >
        Update
      </button>
    </div>
  );
};

export default Edit;
