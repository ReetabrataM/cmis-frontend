import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import { Users, CheckCircle, XCircle, Calendar, BookOpen, GraduationCap } from "lucide-react";

export default function AttendancePage() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, studentRes] = await Promise.all([
        API.get("/courses"),
        API.get("/students"),
      ]);
      setCourses(courseRes.data || []);
      const studentData = studentRes.data.students || [];
      setStudents(studentData);
      const temp = {};
      studentData.forEach((student) => {
        temp[student._id] = "Present";
      });
      setAttendanceMap(temp);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      (!department || c.department === department) &&
      (!semester || Number(c.semester) === Number(semester))
  );

  const filteredStudents = students.filter(
    (student) =>
      (!department || student.department === department) &&
      (!semester || Number(student.semester) === Number(semester))
  );

  const toggleStatus = (studentId) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const markAllPresent = () => {
    const updated = {};
    filteredStudents.forEach((student) => {
      updated[student._id] = "Present";
    });
    setAttendanceMap(updated);
  };

  const markAllAbsent = () => {
    const updated = {};
    filteredStudents.forEach((student) => {
      updated[student._id] = "Absent";
    });
    setAttendanceMap(updated);
  };

  const saveAttendance = async () => {
    if (!course) {
      alert("Select Course");
      return;
    }
    try {
      setLoading(true);
      await API.post("/attendance", {
        course,
        date,
        records: filteredStudents.map((student) => ({
          student: student._id,
          status: attendanceMap[student._id] || "Present",
        })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.log(err);
      alert("Failed To Save Attendance");
    } finally {
      setLoading(false);
    }
  };

  const presentCount = filteredStudents.filter(
    (student) => attendanceMap[student._id] === "Present"
  ).length;
  const absentCount = filteredStudents.length - presentCount;
  const attendanceRate =
    filteredStudents.length > 0
      ? Math.round((presentCount / filteredStudents.length) * 100)
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .attendance-root * {
          box-sizing: border-box;
        }

        .attendance-root {
          font-family: 'DM Sans', sans-serif;
        }

        .page-title {
          font-family: 'Playfair Display', serif;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background: radial-gradient(circle at top left, white, transparent 70%);
          pointer-events: none;
        }

        .select-field {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .select-field:focus {
          outline: none;
          border-color: rgba(251,191,36,0.5);
          background-color: rgba(251,191,36,0.04);
        }

        .date-field:focus {
          outline: none;
          border-color: rgba(251,191,36,0.5);
          background-color: rgba(251,191,36,0.04);
        }

        .date-field::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
          cursor: pointer;
        }

        .student-row {
          transition: background-color 0.15s ease;
        }

        .student-row:hover {
          background-color: rgba(255,255,255,0.04);
        }

        .status-btn {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          position: relative;
          overflow: hidden;
        }

        .status-btn:hover {
          transform: scale(1.05);
        }

        .status-btn:active {
          transform: scale(0.97);
        }

        .status-btn.present {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 2px 12px rgba(34,197,94,0.25);
        }

        .status-btn.absent {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 2px 12px rgba(239,68,68,0.25);
        }

        .save-btn {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          position: relative;
          overflow: hidden;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(245,158,11,0.4);
        }

        .save-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .save-btn.saved-state {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .mark-btn {
          transition: transform 0.15s ease, opacity 0.15s ease;
          font-weight: 500;
        }

        .mark-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .mark-btn:active {
          transform: scale(0.97);
        }

        .progress-bar-bg {
          background: rgba(255,255,255,0.07);
          border-radius: 99px;
          height: 6px;
          overflow: hidden;
          margin-top: 10px;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Mobile card view for students */
        .student-table { display: table; }
        .student-cards { display: none; }

        @media (max-width: 768px) {
          .student-table { display: none; }
          .student-cards { display: flex; flex-direction: column; gap: 10px; padding: 14px; }

          .mobile-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .mobile-header-row .save-btn {
            width: 100%;
            text-align: center;
          }

          .filter-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .stat-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .filter-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .glow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 7px;
          flex-shrink: 0;
        }

        .mobile-student-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: background-color 0.15s ease;
        }

        .mobile-student-card:hover {
          background: rgba(255,255,255,0.07);
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0;
        }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 14px;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: rgba(255,255,255,0.25);
        }
      `}</style>

      <div className="attendance-root min-h-screen flex" style={{ background: "#080808", color: "#fff" }}>
        <Sidebar />

        <div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden">

          {/* HEADER */}
          <div
            className="mobile-header-row flex justify-between items-center mb-8"
            style={{ gap: "12px" }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #f59e0b22, #fbbf2411)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Calendar size={18} color="#fbbf24" />
                </div>
                <h1 className="page-title" style={{ fontSize: "clamp(28px, 5vw, 44px)", color: "#fbbf24", lineHeight: 1 }}>
                  Attendance
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "4px", paddingLeft: "2px" }}>
                Student attendance management
              </p>
            </div>

            <button
              onClick={saveAttendance}
              disabled={loading}
              className={`save-btn ${saved ? "saved-state" : ""}`}
              style={{
                padding: "12px 24px",
                borderRadius: "14px",
                color: "#000",
                fontWeight: "700",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                minWidth: "150px",
              }}
            >
              {loading ? "Saving…" : saved ? "✓ Saved!" : "Save Attendance"}
            </button>
          </div>

          {/* STATS */}
          <div
            className="stat-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}
          >
            {/* Total */}
            <div className="stat-card" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "20px",
              padding: "20px 22px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Total</p>
                  <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: "700", lineHeight: 1 }}>{filteredStudents.length}</h2>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "4px" }}>Students</p>
                </div>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Users size={20} color="rgba(255,255,255,0.6)" />
                </div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Present */}
            <div className="stat-card" style={{
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: "20px",
              padding: "20px 22px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "rgba(34,197,94,0.6)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Present</p>
                  <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: "700", color: "#4ade80", lineHeight: 1 }}>{presentCount}</h2>
                  <p style={{ color: "rgba(74,222,128,0.45)", fontSize: "13px", marginTop: "4px" }}>{attendanceRate}% rate</p>
                </div>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: "rgba(34,197,94,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <CheckCircle size={20} color="#4ade80" />
                </div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{
                  width: `${attendanceRate}%`,
                  background: "linear-gradient(90deg, #22c55e, #4ade80)"
                }} />
              </div>
            </div>

            {/* Absent */}
            <div className="stat-card" style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: "20px",
              padding: "20px 22px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "rgba(239,68,68,0.6)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Absent</p>
                  <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: "700", color: "#f87171", lineHeight: 1 }}>{absentCount}</h2>
                  <p style={{ color: "rgba(248,113,113,0.45)", fontSize: "13px", marginTop: "4px" }}>{100 - attendanceRate}% absent</p>
                </div>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: "rgba(239,68,68,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <XCircle size={20} color="#f87171" />
                </div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{
                  width: `${100 - attendanceRate}%`,
                  background: "linear-gradient(90deg, #ef4444, #f87171)"
                }} />
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "20px 22px",
            marginBottom: "20px",
          }}>
            <p className="section-label">Filters</p>

            <div
              className="filter-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}
            >
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="select-field"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  color: department ? "#fff" : "rgba(255,255,255,0.45)",
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                <option value="">All Departments</option>
                {[...new Set(students.map((s) => s.department))].map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="select-field"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  color: semester ? "#fff" : "rgba(255,255,255,0.45)",
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>

              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="select-field"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  color: course ? "#fff" : "rgba(255,255,255,0.45)",
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                <option value="">Select Course</option>
                {filteredCourses.map((c) => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="date-field"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  color: "#fff",
                  fontSize: "14px",
                  width: "100%",
                  transition: "border-color 0.2s ease",
                  colorScheme: "dark",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
              <button
                onClick={markAllPresent}
                className="mark-btn"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#4ade80",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle size={14} />
                Mark All Present
              </button>

              <button
                onClick={markAllAbsent}
                className="mark-btn"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#f87171",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <XCircle size={14} />
                Mark All Absent
              </button>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div
            className="student-table"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                  {["Name", "Roll", "Department", "Semester", "Status"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 18px",
                        textAlign: i === 4 ? "center" : "left",
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <GraduationCap size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                        <p style={{ fontSize: "14px" }}>No students match the selected filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => (
                    <tr
                      key={student._id}
                      className="student-row"
                      style={{
                        borderBottom: idx < filteredStudents.length - 1
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "none",
                      }}
                    >
                      <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "500" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: `hsl(${student.name.charCodeAt(0) * 7 % 360}, 40%, 30%)`,
                            border: "1px solid rgba(255,255,255,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px", fontWeight: "700", flexShrink: 0,
                            color: "rgba(255,255,255,0.8)"
                          }}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          {student.name}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>
                        {student.rollNumber}
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                        {student.department}
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                        Sem {student.semester}
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleStatus(student._id)}
                          className={`status-btn ${attendanceMap[student._id] === "Present" ? "present" : "absent"}`}
                          style={{
                            padding: "7px 20px",
                            borderRadius: "99px",
                            fontWeight: "600",
                            fontSize: "13px",
                            border: "none",
                            cursor: "pointer",
                            color: "#fff",
                            minWidth: "96px",
                          }}
                        >
                          {attendanceMap[student._id] === "Present" ? "✓ Present" : "✗ Absent"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div
            className="student-cards"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {filteredStudents.length === 0 ? (
              <div className="empty-state">
                <GraduationCap size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                <p style={{ fontSize: "14px" }}>No students match the selected filters</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student._id} className="mobile-student-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: `hsl(${student.name.charCodeAt(0) * 7 % 360}, 40%, 28%)`,
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: "700", flexShrink: 0,
                      color: "rgba(255,255,255,0.85)"
                    }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {student.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "2px" }}>
                        {student.rollNumber} · {student.department} · Sem {student.semester}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(student._id)}
                    className={`status-btn ${attendanceMap[student._id] === "Present" ? "present" : "absent"}`}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "99px",
                      fontWeight: "600",
                      fontSize: "12px",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {attendanceMap[student._id] === "Present" ? "✓ Present" : "✗ Absent"}
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}
