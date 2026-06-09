import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";

import API from "../../api/axios";

function AddFaculty() {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      department: "",
      designation: "",
      phone: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/faculties",
          formData
        );

        alert(
          "Faculty Added"
        );

        navigate(
          "/faculties"
        );
      } catch (error) {
        alert(
          "Failed to add faculty"
        );
      }
    };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-5xl font-serif text-yellow-400 mb-10">
          Add Faculty
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl bg-white/5 border border-white/10 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            "name",
            "email",
            "department",
            "designation",
            "phone",
          ].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={
                formData[
                  field
                ]
              }
              onChange={
                handleChange
              }
              placeholder={field}
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />
          ))}

          <button className="md:col-span-2 py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-300 text-black font-bold">
            Save Faculty
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFaculty;