import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Plus, Eye, Pencil, Trash2,
  GraduationCap, Phone, Hash, Building2,
  LayoutGrid, List, BookOpen,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sl-root * { box-sizing: border-box; }
  .sl-root { font-family: 'DM Sans', sans-serif; }
  .sl-display { font-family: 'Cormorant Garamond', serif; }
  .sl-mono    { font-family: 'DM Mono', monospace; }

  /* ── ADD BUTTON ── */
  .sl-add-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 20px; border-radius: 12px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 700; text-decoration: none;
    white-space: nowrap; flex-shrink: 0;
    transition: box-shadow 0.22s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .sl-add-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .sl-add-btn:hover { box-shadow: 0 6px 24px rgba(251,191,36,0.38); transform: translateY(-1px); }
  .sl-add-btn:hover::after { opacity: 1; }
  .sl-add-btn:active { transform: translateY(0); }

  /* ── SEARCH ── */
  .sl-search-wrap { position: relative; flex: 1; min-width: 0; }
  .sl-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.28); pointer-events: none; transition: color 0.2s;
  }
  .sl-search-wrap:focus-within .sl-search-icon { color: rgba(251,191,36,0.6); }
  .sl-search {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 11px 16px 11px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none;
  }
  .sl-search::placeholder { color: rgba(255,255,255,0.2); }
  .sl-search:focus {
    border-color: rgba(251,191,36,0.45);
    background: rgba(251,191,36,0.03);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  /* ── VIEW TOGGLE ── */
  .sl-view-btn {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent; color: rgba(255,255,255,0.32);
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .sl-view-btn.active, .sl-view-btn:hover {
    background: rgba(251,191,36,0.1);
    border-color: rgba(251,191,36,0.22);
    color: #fbbf24;
  }

  /* ── STUDENT CARD (GRID) ── */
  .sl-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; padding: 22px;
    display: flex; flex-direction: column; gap: 0;
    position: relative; overflow: hidden;
    transition: transform 0.2s ease, border-color 0.25s, box-shadow 0.25s;
  }
  .sl-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0), transparent);
    transition: background 0.3s;
  }
  .sl-card:hover { transform: translateY(-3px); border-color: rgba(251,191,36,0.2); box-shadow: 0 10px 36px rgba(0,0,0,0.4); }
  .sl-card:hover::before { background: linear-gradient(90deg, transparent, rgba(251,191,36,0.32), transparent); }

  /* ── AVATAR ── */
  .sl-avatar {
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; flex-shrink: 0;
    font-family: 'Cormorant Garamond', serif;
  }

  /* ── META ROW ── */
  .sl-meta-row {
    display: flex; align-items: center; gap: 9px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 13px;
  }
  .sl-meta-row:last-child { border-bottom: none; }
  .sl-meta-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    text-transform: uppercase; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.22); width: 68px; flex-shrink: 0;
  }

  /* ── ACTION BUTTONS ── */
  .sl-view-link {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 13px; border-radius: 9px;
    background: rgba(52,211,153,0.09); border: 1px solid rgba(52,211,153,0.18);
    color: #6ee7b7; font-size: 12px; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sl-view-link:hover { background: rgba(52,211,153,0.17); transform: translateY(-1px); }

  .sl-edit-link {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 13px; border-radius: 9px;
    background: rgba(96,165,250,0.09); border: 1px solid rgba(96,165,250,0.18);
    color: #93c5fd; font-size: 12px; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sl-edit-link:hover { background: rgba(96,165,250,0.17); transform: translateY(-1px); }

  .sl-del-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 13px; border-radius: 9px;
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.16);
    color: #fca5a5; font-size: 12px; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sl-del-btn:hover { background: rgba(239,68,68,0.15); transform: translateY(-1px); }

  /* ── LIST ROW ── */
  .sl-list-row {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.15s;
  }
  .sl-list-row:last-child { border-bottom: none; }
  .sl-list-row:hover { background: rgba(255,255,255,0.035); }

  /* ── DEPT BADGE ── */
  .sl-dept-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 9px; border-radius: 99px;
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.06em;
  }

  /* ── SKELETON ── */
  @keyframes sl-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .sl-skeleton {
    border-radius: 10px;
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 1200px 100%;
    animation: sl-shimmer 1.5s infinite linear;
  }

  /* ── ORB ── */
  @keyframes sl-orb {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(-25px,18px) scale(1.04); }
  }
  .sl-orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; animation:sl-orb 18s ease-in-out infinite; z-index:0; }

  /* ── STAT CARD ── */
  .sl-stat {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: transform 0.2s;
  }
  .sl-stat:hover { transform: translateY(-2px); }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .sl-header-row { flex-direction: column !important; align-items: flex-start !important; }
    .sl-add-btn    { width: 100%; justify-content: center; }
    .sl-controls   { flex-wrap: wrap; }
    .sl-stat-grid  { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 500px) {
    .sl-grid { grid-template-columns: 1fr !important; }
  }
`;

/* deterministic avatar hue */
const avatarHue = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

function SkeletonCard() {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div className="sl-skeleton" style={{ height: 20, width: "60%" }} />
          <div className="sl-skeleton" style={{ height: 12, width: "40%" }} />
        </div>
        <div className="sl-skeleton" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {[70, 55, 65, 45].map((w, i) => (
          <div key={i} className="sl-skeleton" style={{ height: 10, width: `${w}%` }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3].map((i) => <div key={i} className="sl-skeleton" style={{ height: 34, flex: 1, borderRadius: 9 }} />)}
      </div>
    </div>
  );
}

function StudentList() {
  const [students, setStudents]           = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [view, setView]                   = useState("grid");

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      const data = Array.isArray(res.data) ? res.data : res.data?.students || [];
      setStudents(data);
      setFilteredStudents(data);
    } catch {
      setStudents([]); setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredStudents(
      students.filter((s) =>
        s?.name?.toLowerCase().includes(q) ||
        s?.rollNumber?.toLowerCase().includes(q) ||
        s?.department?.toLowerCase().includes(q)
      )
    );
  }, [search, students]);

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await API.delete(`/students/${id}`);
      const updated = students.filter((s) => s._id !== id);
      setStudents(updated);
      setFilteredStudents(updated);
    } catch {
      alert("Delete failed");
    }
  };

  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))];

  return (
    <>
      <style>{STYLES}</style>

      <div className="sl-root flex min-h-screen" style={{ background: "#070707", color: "#fff", position: "relative" }}>
        <div className="sl-orb" style={{ width: 420, height: 420, background: "rgba(251,191,36,0.05)", top: "-8%", right: "5%" }} />
        <div className="sl-orb" style={{ width: 300, height: 300, background: "rgba(167,139,250,0.04)", bottom: "10%", left: "12%", animationDelay: "-9s" }} />

        <Sidebar />

        <div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden" style={{ position: "relative", zIndex: 1 }}>

          {/* ── HEADER ── */}
          <div className="sl-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Users size={18} color="#fbbf24" />
                </div>
                <h1 className="sl-display" style={{ fontSize: "clamp(28px,5vw,46px)", color: "#fbbf24", lineHeight: 1, margin: 0 }}>
                  Students
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 4 }}>
                Manage student records and profiles
              </p>
            </div>

            <Link to="/students/add" className="sl-add-btn">
              <Plus size={15} /> Add Student
            </Link>
          </div>

          {/* ── STATS ── */}
          <div className="sl-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Students",  value: students.length,     accent: "#fbbf24", icon: Users,         bg: "rgba(251,191,36,0.07)",  border: "rgba(251,191,36,0.15)" },
              { label: "Departments",     value: departments.length,  accent: "#a78bfa", icon: Building2,     bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.14)" },
              { label: "Search Results",  value: filteredStudents.length, accent: "#34d399", icon: Search,    bg: "rgba(52,211,153,0.06)",  border: "rgba(52,211,153,0.14)" },
            ].map(({ label, value, accent, icon: Icon, bg, border }) => (
              <div key={label} className="sl-stat" style={{ background: bg, border: `1px solid ${border}` }}>
                <div style={{ position: "absolute", top: -25, right: -25, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${accent}1e 0%,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <p className="sl-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.22em", margin: 0 }}>{label}</p>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}14`, border: `1px solid ${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={14} color={accent} />
                  </div>
                </div>
                <h2 className="sl-display" style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: accent, lineHeight: 1, margin: 0, textShadow: `0 0 20px ${accent}35` }}>
                  {value}
                </h2>
                <div style={{ position: "absolute", bottom: 0, left: "1.2rem", right: "1.2rem", height: 2, borderRadius: 1, background: `linear-gradient(90deg,transparent,${accent}45,transparent)` }} />
              </div>
            ))}
          </div>

          {/* ── SEARCH + VIEW TOGGLE ── */}
          <div className="sl-controls" style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
            <div className="sl-search-wrap">
              <Search size={15} className="sl-search-icon" />
              <input
                className="sl-search"
                type="text"
                placeholder="Search by name, roll number, or department…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className={`sl-view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}><LayoutGrid size={15} /></button>
              <button className={`sl-view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}><List size={15} /></button>
            </div>
          </div>

          {/* ── LOADING SKELETONS ── */}
          {loading && (
            <div className="sl-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18, padding: "60px 24px", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCap size={26} color="rgba(251,191,36,0.5)" />
              </div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                {search ? "No students match your search" : "No students yet"}
              </p>
              {!search && (
                <Link to="/students/add" className="sl-add-btn" style={{ marginTop: 4 }}>
                  <Plus size={14} /> Add first student
                </Link>
              )}
            </motion.div>
          )}

          {/* ── GRID VIEW ── */}
          {!loading && filteredStudents.length > 0 && view === "grid" && (
            <div className="sl-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
              <AnimatePresence>
                {filteredStudents.map((student, index) => {
                  const hue = avatarHue(student.name);
                  return (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ delay: index * 0.04, duration: 0.35 }}
                      className="sl-card"
                    >
                      {/* Top row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h2 className="sl-display" style={{ fontSize: 22, color: "#fff", lineHeight: 1.2, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {student.name || "Unknown Student"}
                          </h2>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {student.email || "No email"}
                          </p>
                        </div>
                        <div
                          className="sl-avatar"
                          style={{
                            width: 48, height: 48, marginLeft: 12,
                            background: `hsl(${hue},40%,22%)`,
                            border: `1px solid hsl(${hue},40%,35%)`,
                            color: `hsl(${hue},70%,72%)`,
                            fontSize: 22,
                          }}
                        >
                          {student.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                      </div>

                      {/* Dept badge */}
                      {student.department && (
                        <div style={{ marginBottom: 14 }}>
                          <span className="sl-dept-badge" style={{
                            background: `hsl(${hue},35%,18%)`,
                            border: `1px solid hsl(${hue},35%,28%)`,
                            color: `hsl(${hue},60%,65%)`,
                          }}>
                            <Building2 size={10} />
                            {student.department}
                          </span>
                        </div>
                      )}

                      {/* Meta */}
                      <div style={{ marginBottom: 16 }}>
                        {[
                          { icon: <Hash size={12} />,         label: "Roll",    value: student.rollNumber || "N/A" },
                          { icon: <BookOpen size={12} />,     label: "Course",  value: student.course     || "N/A" },
                          { icon: <GraduationCap size={12} />,label: "Dept",    value: student.department || "N/A" },
                          { icon: <Phone size={12} />,        label: "Phone",   value: student.phone      || "N/A" },
                        ].map(({ icon, label, value }) => (
                          <div key={label} className="sl-meta-row">
                            <span className="sl-meta-label">{label}</span>
                            <span style={{ color: "rgba(255,255,255,0.58)", display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "rgba(255,255,255,0.22)", flexShrink: 0 }}>{icon}</span>
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 7, marginTop: "auto", flexWrap: "wrap" }}>
                        <Link to={`/students/${student._id}`} className="sl-view-link" style={{ flex: 1, justifyContent: "center" }}>
                          <Eye size={12} /> View
                        </Link>
                        <Link to={`/students/edit/${student._id}`} className="sl-edit-link" style={{ flex: 1, justifyContent: "center" }}>
                          <Pencil size={12} /> Edit
                        </Link>
                        <button onClick={() => deleteStudent(student._id)} className="sl-del-btn" style={{ flex: 1, justifyContent: "center" }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {!loading && filteredStudents.length > 0 && view === "list" && (
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
              {/* List header */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 120px",
                padding: "10px 16px", gap: 12,
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                {["Student", "Roll No.", "Department", "Phone", ""].map((h) => (
                  <span key={h} className="sl-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em" }}>{h}</span>
                ))}
              </div>

              {filteredStudents.map((student, index) => {
                const hue = avatarHue(student.name);
                return (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.025 }}
                    className="sl-list-row"
                    style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 120px", gap: 12 }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        className="sl-avatar"
                        style={{
                          width: 32, height: 32, fontSize: 14,
                          background: `hsl(${hue},40%,20%)`,
                          border: `1px solid hsl(${hue},40%,30%)`,
                          color: `hsl(${hue},65%,68%)`,
                          flexShrink: 0,
                        }}
                      >
                        {student.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {student.name || "Unknown"}
                        </p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {student.email || "—"}
                        </p>
                      </div>
                    </div>

                    <span className="sl-mono" style={{ fontSize: 12, color: "#fbbf24", display: "flex", alignItems: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {student.rollNumber || "—"}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                      {student.department && (
                        <span className="sl-dept-badge" style={{
                          background: `hsl(${hue},35%,16%)`,
                          border: `1px solid hsl(${hue},35%,26%)`,
                          color: `hsl(${hue},55%,62%)`,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {student.department}
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {student.phone || "—"}
                    </span>

                    <div style={{ display: "flex", gap: 5, justifyContent: "flex-end", alignItems: "center" }}>
                      <Link to={`/students/${student._id}`} className="sl-view-link" style={{ padding: "5px 9px" }}><Eye size={12} /></Link>
                      <Link to={`/students/edit/${student._id}`} className="sl-edit-link" style={{ padding: "5px 9px" }}><Pencil size={12} /></Link>
                      <button onClick={() => deleteStudent(student._id)} className="sl-del-btn" style={{ padding: "5px 9px" }}><Trash2 size={12} /></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default StudentList;
