import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import {
  ArrowLeft, BookOpen, Building2,
  Phone, MapPin, Mail, Hash,
  GraduationCap, CalendarDays, Pencil,
} from "lucide-react";
import { motion } from "framer-motion";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sd-root * { box-sizing: border-box; }
  .sd-root { font-family: 'DM Sans', sans-serif; }
  .sd-display { font-family: 'Cormorant Garamond', serif; }
  .sd-mono    { font-family: 'DM Mono', monospace; }

  /* ── BACK LINK ── */
  .sd-back {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 10px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700; text-decoration: none;
    transition: box-shadow 0.22s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .sd-back::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .sd-back:hover { box-shadow: 0 5px 20px rgba(251,191,36,0.38); transform: translateY(-1px); }
  .sd-back:hover::after { opacity: 1; }

  .sd-edit-link {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 10px;
    background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2);
    color: #93c5fd; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
  }
  .sd-edit-link:hover { background: rgba(96,165,250,0.18); transform: translateY(-1px); }

  /* ── INFO TILE ── */
  .sd-tile {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 18px 20px;
    display: flex; flex-direction: column; gap: 6px;
    position: relative; overflow: hidden;
    transition: border-color 0.22s, transform 0.2s;
  }
  .sd-tile:hover { border-color: rgba(251,191,36,0.18); transform: translateY(-2px); }
  .sd-tile::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0), transparent);
    transition: background 0.3s;
  }
  .sd-tile:hover::before { background: linear-gradient(90deg, transparent, rgba(251,191,36,0.28), transparent); }

  .sd-tile-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    text-transform: uppercase; letter-spacing: 0.22em;
    color: rgba(255,255,255,0.28);
    display: flex; align-items: center; gap: 6px;
  }

  .sd-tile-value {
    font-size: clamp(15px, 2vw, 18px);
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* ── SKELETON ── */
  @keyframes sd-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .sd-skeleton {
    border-radius: 10px;
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 1200px 100%;
    animation: sd-shimmer 1.5s infinite linear;
  }

  /* ── ORB ── */
  @keyframes sd-orb {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(-20px,15px) scale(1.04); }
  }
  .sd-orb { position:fixed; border-radius:50%; filter:blur(100px); pointer-events:none; animation:sd-orb 18s ease-in-out infinite; z-index:0; }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .sd-hero-row { flex-direction: column-reverse !important; align-items: flex-start !important; }
    .sd-avatar   { width: 64px !important; height: 64px !important; font-size: 26px !important; border-radius: 16px !important; }
    .sd-tile-grid { grid-template-columns: 1fr !important; }
    .sd-inner     { padding: 20px 16px 40px !important; }
  }
`;

/* deterministic hue from name */
const avatarHue = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

function SkeletonDetails() {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, padding: "clamp(20px,4vw,40px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 16 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="sd-skeleton" style={{ height: 52, width: "55%" }} />
            <div className="sd-skeleton" style={{ height: 14, width: "38%" }} />
          </div>
          <div className="sd-skeleton" style={{ width: 96, height: 96, borderRadius: "50%", flexShrink: 0 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sd-tile" style={{ gap: 8 }}>
              <div className="sd-skeleton" style={{ height: 10, width: "40%" }} />
              <div className="sd-skeleton" style={{ height: 18, width: "65%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await API.get(`/students/${id}`);
        setStudent(res.data.student);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  return (
    <>
      <style>{STYLES}</style>

      <div className="sd-root flex min-h-screen" style={{ background: "#070707", color: "#fff", position: "relative" }}>
        {/* bg orbs */}
        <div className="sd-orb" style={{ width: 400, height: 400, background: "rgba(251,191,36,0.06)", top: "-8%", right: "8%", zIndex: 0 }} />
        <div className="sd-orb" style={{ width: 280, height: 280, background: "rgba(167,139,250,0.04)", bottom: "10%", left: "12%", animationDelay: "-9s", zIndex: 0 }} />

        <Sidebar />

        <div className="sd-inner flex-1 p-5 sm:p-8 lg:p-10" style={{ position: "relative", zIndex: 1 }}>

          {/* ── BACK BREADCRUMB ── */}
          <Link to="/students" className="sd-back" style={{ marginBottom: 20, display: "inline-flex" }}>
            <ArrowLeft size={13} /> Back to Students
          </Link>

          {/* ── LOADING ── */}
          {loading && <SkeletonDetails />}

          {/* ── NOT FOUND ── */}
          {!loading && !student && (
            <div style={{ maxWidth: 780, margin: "40px auto", textAlign: "center" }}>
              <GraduationCap size={48} color="rgba(255,255,255,0.15)" style={{ margin: "0 auto 14px" }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>Student not found.</p>
              <Link to="/students" className="sd-back" style={{ marginTop: 20, display: "inline-flex" }}>
                <ArrowLeft size={13} /> Back to Students
              </Link>
            </div>
          )}

          {/* ── CONTENT ── */}
          {!loading && student && (() => {
            const hue = avatarHue(student.name || "");
            const tiles = [
              { icon: <BookOpen size={12} />,      label: "Course",     value: student.course     },
              { icon: <Building2 size={12} />,     label: "Department", value: student.department },
              { icon: <Hash size={12} />,           label: "Roll No.",   value: student.rollNumber },
              { icon: <Phone size={12} />,          label: "Phone",      value: student.phone      },
              { icon: <MapPin size={12} />,         label: "Address",    value: student.address    },
              { icon: <CalendarDays size={12} />,   label: "Semester",   value: student.semester ? `Semester ${student.semester}` : null },
            ].filter((t) => t.value);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{ maxWidth: 780, margin: "0 auto" }}
              >
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: "clamp(20px,4vw,40px)",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* card top shimmer */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg, transparent, hsl(${hue},50%,50%)35, transparent)`,
                  }} />

                  {/* corner orb tinted to avatar */}
                  <div style={{
                    position: "absolute", top: -60, right: -60,
                    width: 200, height: 200, borderRadius: "50%",
                    background: `radial-gradient(circle, hsl(${hue},40%,45%)10 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />

                  {/* ── HERO ROW ── */}
                  <div
                    className="sd-hero-row"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 28, position: "relative" }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {/* eyebrow */}
                      <p className="sd-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.28em", marginBottom: 8 }}>
                        Student Profile
                      </p>

                      <h1 className="sd-display" style={{
                        fontSize: "clamp(30px,6vw,58px)", color: "#fff",
                        lineHeight: 1.05, margin: "0 0 8px",
                      }}>
                        {student.name}
                      </h1>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Mail size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {student.email || "No email on record"}
                        </p>
                      </div>

                      {/* dept badge */}
                      {student.department && (
                        <div style={{ marginTop: 12 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "3px 11px", borderRadius: 99,
                            background: `hsl(${hue},35%,16%)`,
                            border: `1px solid hsl(${hue},35%,28%)`,
                            color: `hsl(${hue},60%,65%)`,
                            fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.08em",
                          }}>
                            <Building2 size={10} />
                            {student.department}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="sd-avatar"
                      style={{
                        width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
                        background: `hsl(${hue},40%,20%)`,
                        border: `2px solid hsl(${hue},45%,35%)`,
                        boxShadow: `0 0 32px hsl(${hue},50%,35%)22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 38, fontWeight: 700,
                        color: `hsl(${hue},65%,72%)`,
                      }}
                    >
                      {student.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  </div>

                  {/* ── DIVIDER ── */}
                  <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07) 30%,rgba(255,255,255,0.07) 70%,transparent)", marginBottom: 24 }} />

                  {/* ── INFO TILES ── */}
                  <div
                    className="sd-tile-grid"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}
                  >
                    {tiles.map(({ icon, label, value }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="sd-tile"
                      >
                        <p className="sd-tile-label">
                          <span style={{ color: "rgba(251,191,36,0.5)" }}>{icon}</span>
                          {label}
                        </p>
                        <p className="sd-tile-value">{value || "—"}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* ── ACTIONS ── */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link to="/students" className="sd-back">
                      <ArrowLeft size={13} /> Back
                    </Link>
                    <Link to={`/students/edit/${student._id}`} className="sd-edit-link">
                      <Pencil size={13} /> Edit Student
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </div>
    </>
  );
}

export default StudentDetails;
