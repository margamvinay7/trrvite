import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API } from "../../Student/Student";
import { GoArrowLeft } from "react-icons/go";
import Notification from "../../Notification";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [student, setStudent] = useState({
    id: "",
    fullName: "",
    year: "",
    academicyear: "",
    email: "",
    gender: "",
    mobile: "",
    joiningyear: "",
    parentName: "",
    parentMobile: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const getStudent = async () => {
    const response = await API.get(
      `/student/getStudentById?id=${state.id}`
    ).then((res) => {
      setStudent(res?.data);
    });
  };
  const { state } = useLocation();

  const handleInputChange = async (event) => {
    const { name, value } = event.target;

    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("id", student.id);
      formData.append("fullName", student.fullName);
      formData.append("year", student.year);
      formData.append("academicyear", student.academicyear);
      formData.append("email", student.email);
      formData.append("gender", student.gender);
      formData.append("mobile", student.mobile);
      formData.append("joiningyear", student.joiningyear);
      formData.append("parentName", student.parentName);
      formData.append("parentMobile", student.parentMobile);
      formData.append("address", student.address);

      // Send updated student data to the server
      const response = await API.post(
        `/student/updateStudent`,

        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        toast.success("Student updated successfully!");
        setNotification({
          message: "Student Updated Successfully!",
          type: "success",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);
        getStudent();
      } else if (response.status == 204) {
        setNotification({
          message: "Image must be lessthan 500X500",
          type: "error",
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: "",
          });
        }, 3000);
        toast.error("Image must be lessthan 500X500");
      }
    } catch (error) {
      setNotification({
        message: "Failed to Update Student",
        type: "error",
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);
      toast.error("Failed to Update Student");
    }
  };

  useEffect(() => {
    if (state.id) {
      getStudent();
    }
  }, [state]);
  return (
    <div className=" bg-adminprofile  relative min-h-[calc(100vh-140px)] flex   justify-center py-10">
      <Link
        className="absolute top-5 left-10 bg-adminprofileblue1 p-2 rounded-full"
        to="/profiles"
      >
        <GoArrowLeft style={{ color: "black", height: 30, width: 30 }} />
      </Link>
      <div className="flex flex-col items-center gap-x-1">
        <h2 className="text-black text-lg mb-5 ">Update Profile</h2>
        {notification.message && <Notification {...notification} />}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex gap-y-2 flex-col"
        >
          <div className=" flex gap-x-2">
            <label>
              Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              type="text"
              name="fullName"
              className=" p-1 rounded-sm"
              value={student.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Roll
              No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              type="text"
              name="id"
              className=" p-1 rounded-sm"
              value={student.id}
              onChange={handleInputChange}
            />
          </div>

          <div className=" flex gap-x-2">
            <label>
              Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="year"
              value={student.year}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>Academic Year&nbsp;&nbsp;:&nbsp;</label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="academicyear"
              value={student.academicyear}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="email"
              value={student.email}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Mobile&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="mobile"
              value={student.mobile}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Gender&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="gender"
              value={student.gender}
              onChange={handleInputChange}
            />
          </div>

          <div className=" flex gap-x-2">
            <label>Parent Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="parentName"
              value={student.parentName}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>Parent Mobile&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="parentMobile"
              value={student.parentMobile}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Joining Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              className=" p-1 rounded-sm"
              type="text"
              name="joiningyear"
              value={student.joiningyear}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <input
              className=" p-1 sm:w-96 w-48 rounded-sm"
              type="text"
              name="address"
              value={student.address}
              onChange={handleInputChange}
            />
          </div>
          <div className=" flex gap-x-2">
            <label>
              Photo&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            </label>
            <label
              htmlFor="studentimage"
              className=" bg-slate-100 p-1 rounded-sm w-48 text-center hover:bg-slate-400"
            >
              {" "}
              Upload Photo
            </label>
            <input
              type="file"
              id="studentimage"
              accept="image/*"
              className=" absolute -top-[1000px] p-1 rounded-sm"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className=" w-48 ms-32 bg-adminprofileblue1 hover:bg-sky-400 p-1 rounded-sm"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
