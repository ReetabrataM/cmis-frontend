import { useEffect, useState } from "react";
import {
  GraduationCap, Trophy, TrendingUp,
  Search, Save, Pencil, Trash2, X,
  BookOpen, BarChart2, ClipboardList,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

/* ─── STYLES ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ml-root * { box-sizing: border-box; }
  .ml-root { font-family: 'DM Sans', sans-serif; }
  .ml-display { font-family: 'Cormorant Garamond', serif; }
  .ml-mono    { font-family: 'DM Mono', monospace; }

  /* ── SELECT ── */
  .ml-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 11px 36px 11px 14px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.65);
    outline: none; cursor: pointer; width: 100%;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ml-select:focus {
    border-color: rgba(251,191,36,0.45);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  /* ── SEARCH ── */
  .ml-search-wrap { position: relative; }
  .ml-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.28); pointer-events: none; transition: color 0.2s;
  }
  .ml-search-wrap:focus-within .ml-search-icon { color: rgba(251,191,36,0.6); }
  .ml-search {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 11px 16px 11px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none;
  }
  .ml-search::placeholder { color: rgba(255,255,255,0.2); }
  .ml-search:focus {
    border-color: rgba(251,191,36,0.45);
    background: rgba(251,191,36,0.03);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  /* ── MARK INPUT ── */
  .ml-mark-input {
    width: 80px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px; padding: 8px 10px;
    font-size: 13px; font-family: 'DM Mono', monospace; color: #fff;
    outline: none; text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
  }
  .ml-mark-input:focus {
    border-color: rgba(251,191,36,0.5);
    background: rgba(251,191,36,0.04);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }
  .ml-mark-input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }

  /* ── BUTTONS ── */
  .ml-load-btn {
    padding: 11px 18px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: box-shadow 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .ml-load-btn:hover { box-shadow: 0 4px 18px rgba(251,191,36,0.35); transform: translateY(-1px); }

  .ml-save-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 18px; border-radius: 11px; border: none;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: box-shadow 0.2s, transform 0.15s;
  }
  .ml-save-btn:hover { box-shadow: 0 4px 18px rgba(34,197,94,0.35); transform: translateY(-1px); }

  .ml-edit-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 11px; border-radius: 8px;
    background: rgba(96,165,250,0.09); border: 1px solid rgba(96,165,250,0.18);
    color: #7dd3fc; font-size: 12px; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .ml-edit-btn:hover { background: rgba(96,165,250,0.17); transform: translateY(-1px); }

  .ml-del-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 11px; border-radius: 8px;
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.16);
    color: #fca5a5; font-size: 12px; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .ml-del-btn:hover { background: rgba(239,68,68,0.15); transform: translateY(-1px); }

  /* ── STAT CARD ── */
  .ml-stat {
    border-radius: 18px; padding: 20px 22px;
    position: relative; overflow: hidden;
    transition: transform 0.2s ease;
  }
  .ml-stat:hover { transform: translateY(-2px); }

  /* ── PANEL ── */
  .ml-panel {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }

  .ml-panel-header {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
  }

  /* ── TABLE ── */
  .ml-tr { transition: background 0.15s; }
  .ml-tr:hover { background: rgba(255,255,255,0.035); }

  /* ── GRADE PILL ── */
  .ml-grade {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 10px;
    font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600;
  }

  /* ── SCORE BAR ── */
  .ml-score-bar-bg {
    height: 3px; background: rgba(255,255,255,0.07);
    border-radius: 99px; overflow: hidden; margin-top: 4px;
  }
  .ml-score-bar-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── MODAL ── */
  .ml-modal-card {
    background: #0d0d0d; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px; padding: 28px; width: 100%; max-width: 440px;
    position: relative;
  }

  .ml-modal-field { display: flex; flex-direction: column; gap: 7px; }

  .ml-modal-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;
    color: rgba(255,255,255,0.3);
  }

  .ml-modal-input {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; padding: 12px 14px;
    font-size: 14px; font-family: 'DM Mono', monospace; color: #fff;
    outline: none; text-align: right;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none; width: 100%;
  }
  .ml-modal-input:focus {
    border-color: rgba(251,191,36,0.45);
    background: rgba(251,191,36,0.03);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }
  .ml-modal-input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }

  /* ── MOBILE ── */
  .ml-desktop-table { display: block; }
  .ml-mobile-cards  { display: none; }
  .ml-bulk-desktop  { display: block; }
  .ml-bulk-mobile   { display: none; }

  @media (max-width: 768px) {
    .ml-desktop-table { display: none !important; }
    .ml-mobile-cards  { display: flex !important; flex-direction: column; gap: 10px; padding: 14px; }
    .ml-bulk-desktop  { display: none !important; }
    .ml-bulk-mobile   { display: flex !important; }
    .ml-header-row    { flex-direction: column !important; align-items: flex-start !important; }
    .ml-stat-grid     { grid-template-columns: 1fr 1fr !important; }
    .ml-filter-grid   { grid-template-columns: 1fr 1fr !important; }
  }

  @media (max-width: 480px) {
    .ml-stat-grid   { grid-template-columns: 1fr !important; }
    .ml-filter-grid { grid-template-columns: 1fr !important; }
  }

  /* ── SECTION LABEL ── */
  .ml-section-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    text-transform: uppercase; letter-spacing: 0.28em;
    color: rgba(255,255,255,0.25);
  }

  /* ── EMPTY ── */
  .ml-empty {
    padding: 60px 20px; text-align: center;
    color: rgba(255,255,255,0.2);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }

  /* ── ORB ── */
  @keyframes ml-orb {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(-20px,15px) scale(1.04); }
  }
  .ml-orb {
    position: fixed; border-radius: 50%; filter: blur(90px);
    pointer-events: none; animation: ml-orb 16s ease-in-out infinite; z-index: 0;
  }

  /* ── LOADER DOTS ── */
  @keyframes ldot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
  .ldot { display:inline-block; width:4px; height:4px; border-radius:50%; background:#000; margin:0 2px; }
  .ldot:nth-child(1){animation:ldot 1s 0.0s infinite}
  .ldot:nth-child(2){animation:ldot 1s 0.15s infinite}
  .ldot:nth-child(3){animation:ldot 1s 0.3s infinite}
`;

/* ─── HELPERS ─────────────────────────────────── */
const gradeColor = (grade) => {
  const map = {
    "A+": { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.22)" },
    "A":  { color: "#4ade80", bg: "rgba(74,222,128,0.10)",  border: "rgba(74,222,128,0.18)" },
    "B":  { color: "#60a5fa", bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.18)" },
    "C":  { color: "#fbbf24", bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.18)" },
    "D":  { color: "#fb923c", bg: "rgba(251,146,60,0.10)",  border: "rgba(251,146,60,0.18)" },
    "F":  { color: "#f87171", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.18)" },
  };
  return map[grade] || { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.14)" };
};

const scorePct = (total, max = 100) => Math.min(100, Math.round((total / max) * 100));

const scoreColor = (pct) => {
  if (pct >= 80) return "linear-gradient(90deg,#22c55e,#4ade80)";
  if (pct >= 60) return "linear-gradient(90deg,#d97706,#fbbf24)";
  return "linear-gradient(90deg,#dc2626,#f87171)";
};

const TH = ({ children, center }) => (
  <th style={{
    padding: "11px 14px", textAlign: center ? "center" : "left",
    fontSize: 9, fontFamily: "'DM Mono',monospace",
    textTransform: "uppercase", letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.25)", fontWeight: 500,
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap",
  }}>
    {children}
  </th>
);

/* ─── COMPONENT ─────────────────────────────────── */
function MarksList() {
  const [marks, setMarks]       = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses]   = useState([]);
  const [search, setSearch]     = useState("");

  const [department, setDepartment]         = useState("");
  const [semester, setSemester]             = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [markRows, setMarkRows]             = useState([]);

  const [editingMark, setEditingMark] = useState(null);
  const [editForm, setEditForm]       = useState({ assignment: 0, quiz: 0, midSemester: 0, finalExam: 0 });
  const [saving, setSaving]           = useState(false);

  const [filterDept, setFilterDept]     = useState("");
  const [filterSem, setFilterSem]       = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [marksRes, studentsRes, coursesRes] = await Promise.all([
        API.get("/marks"), API.get("/students"), API.get("/courses"),
      ]);
      setMarks(Array.isArray(marksRes.data) ? marksRes.data : marksRes.data?.data || marksRes.data?.marks || []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.data || studentsRes.data?.students || []);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data?.data || coursesRes.data?.courses || []);
    } catch (err) { console.log(err); }
  };

  const departments    = [...new Set(students.map((s) => s.department))];
  const filteredCourses = courses.filter(
    (c) => (!department || c.department === department) && (!semester || Number(c.semester) === Number(semester))
  );

  const loadStudents = () => {
    const filtered = students.filter(
      (s) => s.department === department && Number(s.semester) === Number(semester)
    );
    setMarkRows(filtered.map((s) => ({
      student: s._id, studentName: s.name, rollNumber: s.rollNumber,
      assignment: "", quiz: "", midSemester: "", finalExam: "",
    })));
  };

  const handleMarkChange = (index, field, value) => {
    const updated = [...markRows];
    updated[index][field] = value === "" ? "" : Number(value);
    setMarkRows(updated);
  };

  const saveAllMarks = async () => {
    if (!selectedCourse) return alert("Select a course");
    try {
      setSaving(true);
      await API.post("/marks/bulk-save", { course: selectedCourse, records: markRows });
      alert("Marks Saved Successfully");
      fetchData();
    } catch { alert("Failed To Save Marks"); }
    finally { setSaving(false); }
  };

  const deleteMark = async (id) => {
    if (!window.confirm("Delete this mark record?")) return;
    try {
      await API.delete(`/marks/${id}`);
      fetchData();
    } catch { alert("Delete Failed"); }
  };

  const openEdit = (mark) => {
    setEditingMark(mark);
    setEditForm({ assignment: mark.assignment || 0, quiz: mark.quiz || 0, midSemester: mark.midSemester || 0, finalExam: mark.finalExam || 0 });
  };

  const saveEdit = async () => {
    try {
      await API.put(`/marks/${editingMark._id}`, editForm);
      setEditingMark(null);
      fetchData();
      alert("Updated Successfully");
    } catch { alert("Update Failed"); }
  };

  const filteredMarks = marks.filter((mark) => {
    const text = search.toLowerCase();
    const matchesSearch =
      mark.student?.name?.toLowerCase().includes(text) ||
      mark.student?.rollNumber?.toLowerCase().includes(text) ||
      mark.student?.department?.toLowerCase().includes(text);
    const matchesDept   = !filterDept   || mark.student?.department === filterDept;
    const matchesSem    = !filterSem    || Number(mark.student?.semester) === Number(filterSem);
    const matchesCourse = !filterCourse || mark.course?._id === filterCourse;
    return matchesSearch && matchesDept && matchesSem && matchesCourse;
  });

  const averageMarks = filteredMarks.length
    ? (filteredMarks.reduce((a, b) => a + (b.totalMarks || 0), 0) / filteredMarks.length).toFixed(1) : 0;
  const topper = filteredMarks.length
    ? Math.max(...filteredMarks.map((m) => m.totalMarks || 0)) : 0;

  const statCards = [
    { title: "Total Records",  value: filteredMarks.length, icon: GraduationCap, accent: "#fbbf24", bg: "rgba(251,191,36,0.07)",  border: "rgba(251,191,36,0.15)" },
    { title: "Average Marks",  value: averageMarks,          icon: TrendingUp,    accent: "#34d399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.15)" },
    { title: "Highest Score",  value: topper,                icon: Trophy,        accent: "#fb923c", bg: "rgba(251,146,60,0.07)",  border: "rgba(251,146,60,0.15)" },
  ];

  const FIELDS = [
    { key: "assignment",  label: "Assignment", max: 20 },
    { key: "quiz",        label: "Quiz",       max: 20 },
    { key: "midSemester", label: "Mid Sem",    max: 30 },
    { key: "finalExam",   label: "Final Exam", max: 30 },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="ml-root flex min-h-screen" style={{ background: "#070707", color: "#fff", position: "relative" }}>
        <div className="ml-orb" style={{ width: 420, height: 420, background: "rgba(251,191,36,0.05)", top: "-5%", right: "8%" }} />
        <div className="ml-orb" style={{ width: 300, height: 300, background: "rgba(52,211,153,0.04)", bottom: "8%", left: "15%", animationDelay: "-8s" }} />

        <Sidebar />

        <div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden" style={{ position: "relative", zIndex: 1 }}>

          {/* ── HEADER ── */}
          <div className="ml-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChart2 size={18} color="#fbbf24" />
                </div>
                <h1 className="ml-display" style={{ fontSize: "clamp(26px,5vw,44px)", color: "#fbbf24", lineHeight: 1, margin: 0 }}>
                  Academic Performance
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 4 }}>
                Manage student marks, grades and academic records
              </p>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="ml-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
            {statCards.map(({ title, value, icon: Icon, accent, bg, border }) => (
              <div key={title} className="ml-stat" style={{ background: bg, border: `1px solid ${border}` }}>
                <div style={{ position: "absolute", top: -25, right: -25, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${accent}20 0%,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <p className="ml-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.22em", margin: 0 }}>{title}</p>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}14`, border: `1px solid ${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={14} color={accent} />
                  </div>
                </div>
                <h2 className="ml-display" style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: accent, lineHeight: 1, margin: 0, textShadow: `0 0 20px ${accent}35` }}>
                  {value}
                </h2>
                <div style={{ position: "absolute", bottom: 0, left: "1.2rem", right: "1.2rem", height: 2, borderRadius: 1, background: `linear-gradient(90deg,transparent,${accent}42,transparent)` }} />
              </div>
            ))}
          </div>

          {/* ── BULK ENTRY SECTION ── */}
          <div className="ml-panel" style={{ marginBottom: 20 }}>
            <div className="ml-panel-header">
              <div>
                <h2 className="ml-display" style={{ fontSize: 20, color: "#fbbf24", margin: 0 }}>Bulk Mark Entry</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Select cohort and load students to enter marks</p>
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div className="ml-filter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 0 }}>
                <select className="ml-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">Department</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="ml-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="">Semester</option>
                  {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                <select className="ml-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                  <option value="">Select Course</option>
                  {filteredCourses.map((c) => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                </select>
                <button className="ml-load-btn" onClick={loadStudents}>Load Students</button>
              </div>
            </div>

            {/* Bulk table — desktop */}
            {markRows.length > 0 && (
              <>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="ml-bulk-desktop">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <TH>Student</TH>
                          <TH>Roll No.</TH>
                          {FIELDS.map((f) => <TH key={f.key}>{f.label} /{f.max}</TH>)}
                        </tr>
                      </thead>
                      <tbody>
                        {markRows.map((row, index) => (
                          <tr key={row.student} className="ml-tr" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "11px 14px", fontSize: 13 }}>{row.studentName}</td>
                            <td style={{ padding: "11px 14px" }}>
                              <span className="ml-mono" style={{ fontSize: 12, color: "#fbbf24" }}>{row.rollNumber}</span>
                            </td>
                            {FIELDS.map((f) => (
                              <td key={f.key} style={{ padding: "11px 14px" }}>
                                <input
                                  type="number" min={0} max={f.max}
                                  value={row[f.key]}
                                  onChange={(e) => handleMarkChange(index, f.key, e.target.value)}
                                  className="ml-mark-input"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bulk cards — mobile */}
                  <div className="ml-bulk-mobile" style={{ flexDirection: "column", gap: 10, padding: 14 }}>
                    {markRows.map((row, index) => (
                      <div key={row.student} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{row.studentName}</p>
                        <p className="ml-mono" style={{ fontSize: 11, color: "#fbbf24", marginBottom: 12 }}>{row.rollNumber}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {FIELDS.map((f) => (
                            <div key={f.key}>
                              <p className="ml-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 5 }}>
                                {f.label} <span style={{ color: "rgba(255,255,255,0.18)" }}>/{f.max}</span>
                              </p>
                              <input
                                type="number" min={0} max={f.max}
                                value={row[f.key]}
                                onChange={(e) => handleMarkChange(index, f.key, e.target.value)}
                                className="ml-mark-input" style={{ width: "100%" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "flex-end" }}>
                  <button className="ml-save-btn" onClick={saveAllMarks} disabled={saving}>
                    <Save size={15} />
                    {saving ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}>Saving <span className="ldot" /><span className="ldot" /><span className="ldot" /></span> : "Save All Marks"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── EXISTING RECORDS ── */}
          <div className="ml-panel">
            <div className="ml-panel-header">
              <div>
                <h2 className="ml-display" style={{ fontSize: 20, color: "#fbbf24", margin: 0 }}>Existing Records</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{filteredMarks.length} records match current filters</p>
              </div>
            </div>

            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Search */}
              <div className="ml-search-wrap">
                <Search size={15} className="ml-search-icon" />
                <input className="ml-search" placeholder="Search student, roll number, or department…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              {/* Filters */}
              <div className="ml-filter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                <select className="ml-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                  <option value="">All Departments</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="ml-select" value={filterSem} onChange={(e) => setFilterSem(e.target.value)}>
                  <option value="">All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                <select className="ml-select" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                  <option value="">All Courses</option>
                  {courses.map((c) => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                </select>
              </div>
            </div>

            {/* Desktop table */}
            <div className="ml-desktop-table">
              {filteredMarks.length === 0 ? (
                <div className="ml-empty"><ClipboardList size={36} style={{ opacity: 0.25 }} /><p style={{ fontSize: 14 }}>No records match the current filters</p></div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <TH>Student</TH>
                      <TH>Roll</TH>
                      <TH>Course</TH>
                      <TH center>Score</TH>
                      <TH center>Grade</TH>
                      <TH center>Actions</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarks.map((mark) => {
                      const pct = scorePct(mark.totalMarks || 0);
                      const gc  = gradeColor(mark.grade);
                      return (
                        <tr key={mark._id} className="ml-tr" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{mark.student?.name}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span className="ml-mono" style={{ fontSize: 12, color: "#fbbf24" }}>{mark.student?.rollNumber}</span>
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {mark.course?.courseName}
                          </td>
                          <td style={{ padding: "12px 14px", minWidth: 120 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div className="ml-score-bar-bg" style={{ flex: 1 }}>
                                <div className="ml-score-bar-fill" style={{ width: `${pct}%`, background: scoreColor(pct) }} />
                              </div>
                              <span className="ml-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", minWidth: 26, textAlign: "right" }}>{mark.totalMarks}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span className="ml-grade" style={{ background: gc.bg, border: `1px solid ${gc.border}`, color: gc.color }}>
                              {mark.grade}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                              <button className="ml-edit-btn" onClick={() => openEdit(mark)}><Pencil size={12} /></button>
                              <button className="ml-del-btn" onClick={() => deleteMark(mark._id)}><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile cards */}
            <div className="ml-mobile-cards">
              {filteredMarks.length === 0 ? (
                <div className="ml-empty"><ClipboardList size={32} style={{ opacity: 0.25 }} /><p style={{ fontSize: 13 }}>No records found</p></div>
              ) : (
                filteredMarks.map((mark) => {
                  const pct = scorePct(mark.totalMarks || 0);
                  const gc  = gradeColor(mark.grade);
                  return (
                    <div key={mark._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{mark.student?.name}</p>
                          <p className="ml-mono" style={{ fontSize: 11, color: "#fbbf24", marginTop: 2 }}>{mark.student?.rollNumber}</p>
                        </div>
                        <span className="ml-grade" style={{ background: gc.bg, border: `1px solid ${gc.border}`, color: gc.color }}>{mark.grade}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{mark.course?.courseName}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div className="ml-score-bar-bg" style={{ flex: 1 }}>
                          <div className="ml-score-bar-fill" style={{ width: `${pct}%`, background: scoreColor(pct) }} />
                        </div>
                        <span className="ml-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", minWidth: 32 }}>{mark.totalMarks}/100</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="ml-edit-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => openEdit(mark)}><Pencil size={12} /> Edit</button>
                        <button className="ml-del-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => deleteMark(mark._id)}><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── EDIT MODAL ── */}
        <AnimatePresence>
          {editingMark && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
              onClick={(e) => { if (e.target === e.currentTarget) setEditingMark(null); }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="ml-modal-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h2 className="ml-display" style={{ fontSize: 26, color: "#fbbf24", margin: 0 }}>Edit Marks</h2>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                      {editingMark.student?.name} · {editingMark.student?.rollNumber}
                    </p>
                  </div>
                  <button onClick={() => setEditingMark(null)} style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.45)", flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                  {FIELDS.map((f) => (
                    <div key={f.key} className="ml-modal-field">
                      <label className="ml-modal-label">{f.label} <span style={{ color: "rgba(255,255,255,0.18)" }}>/ {f.max}</span></label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number" min={0} max={f.max}
                          value={editForm[f.key]}
                          onChange={(e) => setEditForm({ ...editForm, [f.key]: Number(e.target.value) })}
                          className="ml-modal-input"
                        />
                      </div>
                      {/* mini bar */}
                      <div className="ml-score-bar-bg">
                        <div className="ml-score-bar-fill" style={{ width: `${Math.min(100,(editForm[f.key]/f.max)*100)}%`, background: "linear-gradient(90deg,#d97706,#fbbf24)" }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live total preview */}
                <div style={{ marginBottom: 18, padding: "10px 14px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.14)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="ml-mono" style={{ fontSize: 10, color: "rgba(251,191,36,0.55)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Projected Total</span>
                  <span className="ml-mono" style={{ fontSize: 16, color: "#fbbf24", fontWeight: 600 }}>
                    {Object.values(editForm).reduce((a, b) => a + Number(b || 0), 0)} / 100
                  </span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={saveEdit} style={{ flex: 1, padding: "13px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#fbbf24,#d97706)", color: "#000", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "box-shadow 0.2s" }}>
                    Save Changes
                  </button>
                  <button onClick={() => setEditingMark(null)} style={{ flex: 1, padding: "13px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default MarksList;
