import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowLeft,
  Save,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";

function AddFee() {
  const navigate = useNavigate();

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      student: "",
      totalFees: "",
      paidAmount: "",
      dueDate: "",
      paymentMethod: "Cash",
    });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } =
        await API.get("/students");

      setStudents(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post(
        "/fees",
        formData
      );

      alert(
        "Fee record created successfully"
      );

      navigate("/fees");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to create fee record"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar />

      <div className="flex-1 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-5xl font-bold">
              Add Fee Record
            </h1>

            <p className="text-white/50 mt-2">
              Create a new fee entry
              for a student
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/fees")
            }
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-2xl
              border border-white/10
              bg-white/5
              hover:bg-white/10
            "
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </div>

        {/* FORM CARD */}
        <div className="
          max-w-4xl
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
          backdrop-blur-xl
        ">

          <div className="
            flex items-center gap-4
            mb-8
          ">
            <div className="
              w-14 h-14
              rounded-2xl
              bg-gradient-to-br
              from-yellow-400
              to-amber-700
              flex items-center
              justify-center
            ">
              <Wallet
                className="text-black"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                Financial Information
              </h2>

              <p className="text-white/50">
                Enter fee details
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* STUDENT */}
            <div>
              <label className="block mb-2 text-white/70">
                Student
              </label>

              <select
                name="student"
                value={
                  formData.student
                }
                onChange={
                  handleChange
                }
                required
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  px-5 py-4
                  outline-none
                "
              >
                <option value="">
                  Select Student
                </option>

                {students.map(
                  (student) => (
                    <option
                      key={
                        student._id
                      }
                      value={
                        student._id
                      }
                    >
                      {
                        student.rollNumber
                      }
                      {" - "}
                      {
                        student.department
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            {/* TOTAL FEES */}
            <div>
              <label className="block mb-2 text-white/70">
                Total Fees
              </label>

              <input
                type="number"
                name="totalFees"
                value={
                  formData.totalFees
                }
                onChange={
                  handleChange
                }
                required
                placeholder="50000"
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  px-5 py-4
                  outline-none
                "
              />
            </div>

            {/* PAID AMOUNT */}
            <div>
              <label className="block mb-2 text-white/70">
                Paid Amount
              </label>

              <input
                type="number"
                name="paidAmount"
                value={
                  formData.paidAmount
                }
                onChange={
                  handleChange
                }
                required
                placeholder="20000"
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  px-5 py-4
                  outline-none
                "
              />
            </div>

            {/* DUE DATE */}
            <div>
              <label className="block mb-2 text-white/70">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={
                  formData.dueDate
                }
                onChange={
                  handleChange
                }
                required
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  px-5 py-4
                  outline-none
                "
              />
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <label className="block mb-2 text-white/70">
                Payment Method
              </label>

              <select
                name="paymentMethod"
                value={
                  formData.paymentMethod
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  px-5 py-4
                  outline-none
                "
              >
                <option>
                  Cash
                </option>

                <option>
                  UPI
                </option>

                <option>
                  Card
                </option>

                <option>
                  Bank Transfer
                </option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="
                w-full
                mt-4
                py-4
                rounded-2xl
                flex
                items-center
                justify-center
                gap-3
                text-black
                font-semibold
                bg-gradient-to-r
                from-yellow-400
                via-amber-300
                to-yellow-600
                shadow-[0_10px_40px_rgba(250,204,21,0.35)]
              "
            >
              <Save size={18} />

              {loading
                ? "Creating..."
                : "Create Fee Record"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddFee;