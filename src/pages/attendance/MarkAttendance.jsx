import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

function MarkAttendance() {
  const [students,
    setStudents] =
    useState([]);

  const [courses,
    setCourses] =
    useState([]);

  const [form,
    setForm] =
    useState({
      student: "",
      course: "",
      status: "Present",
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      try {
        const studentsRes =
          await API.get(
            "/students"
          );

        const coursesRes =
          await API.get(
            "/courses"
          );

        setStudents(
          studentsRes.data
        );

        setCourses(
          coursesRes.data
        );
      } catch (err) {
        console.log(err);
      }
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/attendance",
          form
        );

        alert(
          "Attendance Saved"
        );

        setForm({
          student: "",
          course: "",
          status:
            "Present",
        });
      } catch (err) {
        alert(
          "Error saving attendance"
        );
      }
    };

  return (
    <div className="p-10 text-white">
      <h1 className="text-5xl font-serif text-yellow-400 mb-10">
        Mark Attendance
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="max-w-2xl bg-[#111] rounded-3xl p-8 space-y-6"
      >
        <select
          value={
            form.student
          }
          onChange={(e) =>
            setForm({
              ...form,
              student:
                e.target
                  .value,
            })
          }
          className="w-full bg-black rounded-xl p-4"
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
              </option>
            )
          )}
        </select>

        <select
          value={
            form.course
          }
          onChange={(e) =>
            setForm({
              ...form,
              course:
                e.target
                  .value,
            })
          }
          className="w-full bg-black rounded-xl p-4"
        >
          <option value="">
            Select Course
          </option>

          {courses.map(
            (course) => (
              <option
                key={
                  course._id
                }
                value={
                  course._id
                }
              >
                {
                  course.courseName
                }
              </option>
            )
          )}
        </select>

        <select
          value={
            form.status
          }
          onChange={(e) =>
            setForm({
              ...form,
              status:
                e.target
                  .value,
            })
          }
          className="w-full bg-black rounded-xl p-4"
        >
          <option>
            Present
          </option>

          <option>
            Absent
          </option>
        </select>

        <button
          className="px-8 py-4 bg-yellow-500 text-black rounded-2xl font-semibold"
        >
          Save Attendance
        </button>
      </form>
    </div>
  );
}

export default MarkAttendance;