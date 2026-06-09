import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Plus,
  GraduationCap,
  Users,
  Hash,
  Star,
  Pencil,
  Trash2,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cl-root * { box-sizing: border-box; }

  .cl-root {
    font-family: 'DM Sans', sans-serif;
  }

  .cl-font-display { font-family: 'Cormorant Garamond', serif; }
  .cl-font-mono    { font-family: 'DM Mono', monospace; }

  /* ── SEARCH INPUT ── */
  .cl-search-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .cl-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.28);
    pointer-events: none;
    transition: color 0.2s;
  }

  .cl-search-wrap:focus-within .cl-search-icon {
    color: rgba(251,191,36,0.6);
  }

  .cl-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 11px 16px 11px 42px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }

  .cl-search::placeholder { color: rgba(255,255,255,0.22); }

  .cl-search:focus {
    border-color: rgba(251,191,36,0.45);
    background: rgba(251,191,36,0.04);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }

  /* ── ADD BUTTON ── */
  .cl-add-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #000;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: box-shadow 0.25s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .cl-add-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .cl-add-btn:hover {
    box-shadow: 0 6px 24px rgba(251,191,36,0.35);
    transform: translateY(-1px);
  }

  .cl-add-btn:hover::after { opacity: 1; }
  .cl-add-btn:active { transform: translateY(0); }

  /* ── STAT CARD ── */
  .cl-stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }

  .cl-stat:hover {
    transform: translateY(-2px);
  }

  .cl-stat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top left, rgba(255,255,255,0.03), transparent 60%);
    pointer-events: none;
  }

  /* ── COURSE CARD ── */
  .cl-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
    position: relative;
    overflow: hidden;
  }

  .cl-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0.0), transparent);
    transition: background 0.3s;
  }

  .cl-card:hover {
    border-color: rgba(251,191,36,0.22);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  .cl-card:hover::before {
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0.35), transparent);
  }

  /* ── CARD BADGES ── */
  .cl-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  /* ── META ROW ── */
  .cl-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    padding: 5px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .cl-meta-row:last-child { border-bottom: none; }

  .cl-meta-label {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.22);
    width: 70px;
    flex-shrink: 0;
  }

  /* ── ACTION BUTTONS ── */
  .cl-edit-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 10px;
    background: rgba(99,179,237,0.1);
    border: 1px solid rgba(99,179,237,0.18);
    color: #7dd3fc;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
  }

  .cl-edit-btn:hover {
    background: rgba(99,179,237,0.18);
    border-color: rgba(99,179,237,0.35);
    transform: translateY(-1px);
  }

  .cl-del-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 10px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.16);
    color: #fca5a5;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
  }

  .cl-del-btn:hover {
    background: rgba(239,68,68,0.16);
    border-color: rgba(239,68,68,0.32);
    transform: translateY(-1px);
  }

  /* ── VIEW TOGGLE ── */
  .cl-view-btn {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .cl-view-btn.active,
  .cl-view-btn:hover {
    background: rgba(251,191,36,0.1);
    border-color: rgba(251,191,36,0.2);
    color: #fbbf24;
  }

  /* ── EMPTY STATE ── */
  .cl-empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 14px;
    color: rgba(255,255,255,0.2);
    text-align: center;
  }

  /* ── LIST VIEW ── */
  .cl-list-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    transition: border-color 0.2s, background 0.2s;
  }

  .cl-list-row:hover {
    border-color: rgba(251,191,36,0.18);
    background: rgba(255,255,255,0.05);
  }

  /* ── PROGRESS BAR (credits visual) ── */
  .cl-credits-bar {
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 4px;
  }

  .cl-credits-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── DEPT COLOR DOTS ── */
  .dept-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cl-card-anim {
    animation: card-in 0.35s ease forwards;
  }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .cl-header-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 14px !important;
    }

    .cl-controls {
      width: 100%;
      flex-wrap: wrap;
    }

    .cl-search-wrap { flex: 1 1 100%; }

    .cl-add-btn { width: 100%; justify-content: center; }

    .cl-stat-grid {
      grid-template-columns: 1fr 1fr !important;
    }

    .cl-course-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 480px) {
    .cl-stat-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

/* deterministic hue from string */
const deptColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h}, 55%, 55%)`;
};

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); // "grid" | "list"

  const fetchCourses = async () => {
    try {
      const { data } = await API.get("/courses");
      setCourses(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Delete Failed");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    course.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
    course.department?.toLowerCase().includes(search.toLowerCase())
  );

  const departments = [...new Set(courses.map((c) => c.department))];

  return (
    <>
      <style>{STYLES}</style>

      <div className="cl-root flex min-h-screen" style={{ background: "#070707", color: "#fff" }}>
        <Sidebar />

        <div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden">

          {/* ── HEADER ── */}
          <div
            className="cl-header-row"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 16 }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BookOpen size={17} color="#fbbf24" />
                </div>
                <h1 className="cl-font-display" style={{ fontSize: "clamp(28px,5vw,44px)", color: "#fbbf24", lineHeight: 1 }}>
                  Courses
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, paddingLeft: 2 }}>
                Manage academic curriculum
              </p>
            </div>

            <div className="cl-controls" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* View toggle */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button className={`cl-view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>
                  <LayoutGrid size={15} />
                </button>
                <button className={`cl-view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>
                  <List size={15} />
                </button>
              </div>

              {/* Search */}
              <div className="cl-search-wrap">
                <Search size={15} className="cl-search-icon" />
                <input
                  type="text"
                  placeholder="Search courses…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="cl-search"
                />
              </div>

              {/* Add */}
              <Link to="/courses/add" className="cl-add-btn">
                <Plus size={15} />
                Add Course
              </Link>
            </div>
          </div>

          {/* ── STATS ── */}
          <div
            className="cl-stat-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}
          >
            {/* Total */}
            <div className="cl-stat">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p className="cl-font-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                    Total
                  </p>
                  <p style={{ fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, color: "#fbbf24", lineHeight: 1 }}>
                    {courses.length}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Courses</p>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={17} color="#fbbf24" />
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="cl-stat" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p className="cl-font-mono" style={{ fontSize: 10, color: "rgba(52,211,153,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                    Depts
                  </p>
                  <p style={{ fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, color: "#34d399", lineHeight: 1 }}>
                    {departments.length}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(52,211,153,0.4)", marginTop: 4 }}>Departments</p>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={17} color="#34d399" />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="cl-stat" style={{ background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p className="cl-font-mono" style={{ fontSize: 10, color: "rgba(129,140,248,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                    Results
                  </p>
                  <p style={{ fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, color: "#a5b4fc", lineHeight: 1 }}>
                    {filteredCourses.length}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(129,140,248,0.4)", marginTop: 4 }}>Matches</p>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Filter size={17} color="#a5b4fc" />
                </div>
              </div>
            </div>
          </div>

          {/* ── GRID VIEW ── */}
          {view === "grid" && (
            <div
              className="cl-course-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}
            >
              {filteredCourses.length === 0 ? (
                <div className="cl-empty">
                  <BookOpen size={40} style={{ opacity: 0.25 }} />
                  <p style={{ fontSize: 15 }}>No courses found</p>
                  <p style={{ fontSize: 13, opacity: 0.5 }}>Try adjusting your search</p>
                </div>
              ) : (
                filteredCourses.map((course, idx) => {
                  const dColor = deptColor(course.department);
                  const credits = Math.min(course.credits || 0, 6);
                  return (
                    <div
                      key={course._id}
                      className="cl-card cl-card-anim"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      {/* Top row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: `${dColor}18`,
                          border: `1px solid ${dColor}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <BookOpen size={19} color={dColor} />
                        </div>

                        <span className="cl-badge" style={{
                          background: "rgba(251,191,36,0.08)",
                          border: "1px solid rgba(251,191,36,0.18)",
                          color: "#fbbf24",
                        }}>
                          {course.courseCode}
                        </span>
                      </div>

                      {/* Name */}
                      <h2 style={{ fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>
                        {course.courseName}
                      </h2>

                      {/* Dept pill */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                        <span className="dept-dot" style={{ background: dColor }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{course.department}</span>
                      </div>

                      {/* Meta */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 16 }}>
                        {[
                          { label: "Semester", value: `Semester ${course.semester}`, icon: <Hash size={12} /> },
                          { label: "Faculty", value: course.faculty || "—", icon: <Users size={12} /> },
                          { label: "Credits", value: course.credits, icon: <Star size={12} /> },
                        ].map(({ label, value, icon }) => (
                          <div key={label} className="cl-meta-row">
                            <span className="cl-meta-label">{label}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                              {icon} {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Credits bar */}
                      <div className="cl-credits-bar" style={{ marginBottom: 16 }}>
                        <div className="cl-credits-fill" style={{ width: `${(credits / 6) * 100}%` }} />
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                        <Link to={`/courses/edit/${course._id}`} className="cl-edit-btn" style={{ flex: 1, justifyContent: "center" }}>
                          <Pencil size={13} /> Edit
                        </Link>
                        <button onClick={() => deleteCourse(course._id)} className="cl-del-btn" style={{ flex: 1, justifyContent: "center" }}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                padding: "10px 18px",
                gap: 12,
              }}>
                {["Course", "Code", "Department", "Faculty", ""].map((h) => (
                  <span key={h} className="cl-font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                    {h}
                  </span>
                ))}
              </div>

              {filteredCourses.length === 0 ? (
                <div className="cl-empty" style={{ gridColumn: "unset" }}>
                  <BookOpen size={40} style={{ opacity: 0.25 }} />
                  <p style={{ fontSize: 15 }}>No courses found</p>
                </div>
              ) : (
                filteredCourses.map((course, idx) => {
                  const dColor = deptColor(course.department);
                  return (
                    <div
                      key={course._id}
                      className="cl-list-row cl-card-anim"
                      style={{
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                        display: "grid",
                        gap: 12,
                        animationDelay: `${idx * 0.03}s`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9,
                          background: `${dColor}18`,
                          border: `1px solid ${dColor}28`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <BookOpen size={14} color={dColor} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {course.courseName}
                        </span>
                      </div>

                      <span className="cl-font-mono" style={{ fontSize: 12, color: "#fbbf24", display: "flex", alignItems: "center" }}>
                        {course.courseCode}
                      </span>

                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="dept-dot" style={{ background: dColor }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.department}</span>
                      </span>

                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {course.faculty || "—"}
                      </span>

                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
                        <Link to={`/courses/edit/${course._id}`} className="cl-edit-btn" style={{ padding: "6px 10px" }}>
                          <Pencil size={12} />
                        </Link>
                        <button onClick={() => deleteCourse(course._id)} className="cl-del-btn" style={{ padding: "6px 10px" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default CourseList;
