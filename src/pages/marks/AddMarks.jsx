import { useEffect, useState } from "react";
import { Trophy, BookOpen } from "lucide-react";

import API from "../../api/axios";
import Sidebar from "../../components/layout/Sidebar";

function AddMarks() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    student: "",
    course: "",
    assignment: "",
    quiz: "",
    midSemester: "",
    finalExam: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentRes = await API.get("/students");
      const courseRes = await API.get("/courses");

      const studentData = Array.isArray(studentRes.data)
        ? studentRes.data
        : studentRes.data.students || [];

      const courseData = Array.isArray(courseRes.data)
        ? courseRes.data
        : courseRes.data.courses || [];

      setStudents(studentData);
      setCourses(courseData);

      console.log("Students:", studentData);
      console.log("Courses:", courseData);
    } catch (err) {
      console.log(err);
      setStudents([]);
      setCourses([]);
    }
  };

  const total =
    Number(form.assignment || 0) +
    Number(form.quiz || 0) +
    Number(form.midSemester || 0) +
    Number(form.finalExam || 0);

  let grade = "F";

  if (total >= 90) grade = "A+";
  else if (total >= 80) grade = "A";
  else if (total >= 70) grade = "B";
  else if (total >= 60) grade = "C";
  else if (total >= 50) grade = "D";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/marks", form);

      alert("Marks Added Successfully");

      setForm({
        student: "",
        course: "",
        assignment: "",
        quiz: "",
        midSemester: "",
        finalExam: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error Saving Marks"
      );
    }
  };

  return (
    <div className="flex bg-[#050505] text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif text-yellow-400 mb-8">
          Academic Evaluation
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl mb-8">
              Enter Marks
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <select
                name="student"
                value={form.student}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-black border border-white/10"
              >
                <option value="">
                  Select Student
                </option>

                {Array.isArray(students) &&
                  students.map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.name ||
                        student.studentName ||
                        student.rollNumber ||
                        "Student"}
                    </option>
                  ))}
              </select>

              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-black border border-white/10"
              >
                <option value="">
                  Select Course
                </option>

                {Array.isArray(courses) &&
                  courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseName ||
                        course.name ||
                        "Course"}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                name="assignment"
                value={form.assignment}
                onChange={handleChange}
                placeholder="Assignment Marks"
                className="w-full p-4 rounded-2xl bg-black border border-white/10"
              />

              <input
                type="number"
                name="quiz"
                value={form.quiz}
                onChange={handleChange}
                placeholder="Quiz Marks"
                className="w-full p-4 rounded-2xl bg-black border border-white/10"
              />

              <input
                type="number"
                name="midSemester"
                value={form.midSemester}
                onChange={handleChange}
                placeholder="Mid Semester Marks"
                className="w-full p-4 rounded-2xl bg-black border border-white/10"
              />

              <input
                type="number"
                name="finalExam"
                value={form.finalExam}
                onChange={handleChange}
                placeholder="Final Exam Marks"
                className="w-full p-4 rounded-2xl bg-black border border-white/10"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold hover:scale-[1.01] transition"
              >
                Save Marks
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <BookOpen
                size={40}
                className="text-yellow-400 mb-4"
              />

              <p className="text-white/50">
                Total Marks
              </p>

              <h2 className="text-6xl font-bold mt-3">
                {total}
              </h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <Trophy
                size={40}
                className="text-emerald-400 mb-4"
              />

              <p className="text-white/50">
                Grade
              </p>

              <h2 className="text-6xl font-bold mt-3">
                {grade}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-emerald-500/20 rounded-3xl p-8 border border-yellow-500/20">
              <h3 className="text-xl font-semibold">
                Academic Insight
              </h3>

              <p className="text-white/60 mt-4 leading-7">
                Marks are calculated live as
                faculty enters evaluation
                scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMarks;