import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import {
  BookOpen,
  Hash,
  Building2,
  Users,
  Star,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ec-root * { box-sizing: border-box; }
  .ec-root { font-family: 'DM Sans', sans-serif; }
  .ec-font-display { font-family: 'Cormorant Garamond', serif; }
  .ec-font-mono    { font-family: 'DM Mono', monospace; }

  /* ── INPUT ── */
  .ec-field { display: flex; flex-direction: column; gap: 7px; }

  .ec-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ec-input-wrap { position: relative; }

  .ec-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.22);
    pointer-events: none;
    transition: color 0.2s;
  }

  .ec-input-wrap:focus-within .ec-input-icon { color: rgba(251,191,36,0.65); }

  .ec-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 12px 14px 12px 42px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
    appearance: none;
  }

  .ec-input::placeholder { color: rgba(255,255,255,0.18); }

  .ec-input:focus {
    border-color: rgba(251,191,36,0.48);
    background: rgba(251,191,36,0.035);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }

  .ec-input.dirty {
    border-color: rgba(251,191,36,0.28);
    background: rgba(251,191,36,0.025);
  }

  /* ── STEPPER ── */
  .ec-stepper {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  .ec-stepper:focus-within {
    border-color: rgba(251,191,36,0.4);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  .ec-step-btn {
    width: 44px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04);
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 18px;
    font-weight: 300;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
    line-height: 1;
  }

  .ec-step-btn:hover { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .ec-step-btn:active { background: rgba(251,191,36,0.2); }

  .ec-step-val {
    flex: 1;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    background: none;
    border: none;
    outline: none;
    padding: 0;
  }

  /* ── SUBMIT BUTTON ── */
  .ec-submit {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #fbbf24, #f59e0b 50%, #d97706);
    color: #000;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: box-shadow 0.25s, transform 0.15s, opacity 0.2s;
    position: relative; overflow: hidden;
  }

  .ec-submit::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }

  .ec-submit:not(:disabled):hover { box-shadow: 0 6px 28px rgba(251,191,36,0.38); transform: translateY(-1px); }
  .ec-submit:not(:disabled):hover::after { opacity: 1; }
  .ec-submit:not(:disabled):active { transform: translateY(0); }
  .ec-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── CHANGED BADGE ── */
  .ec-changed-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px;
    background: rgba(251,191,36,0.08);
    border: 1px solid rgba(251,191,36,0.2);
    border-radius: 99px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(251,191,36,0.7);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ── DIFF ROW ── */
  .ec-diff-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    gap: 10px;
  }
  .ec-diff-row:last-child { border-bottom: none; }

  /* ── SKELETON ── */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .ec-skeleton {
    border-radius: 12px;
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
  }

  /* ── ORB ── */
  @keyframes orb-drift {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(20px,-15px) scale(1.04); }
  }
  .ec-orb {
    position: absolute; border-radius: 50%; filter: blur(90px);
    pointer-events: none;
    animation: orb-drift 16s ease-in-out infinite;
  }

  /* ── SUCCESS ── */
  @keyframes success-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  .success-icon { animation: success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* ── LOADER DOTS ── */
  @keyframes ldot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  .ldot { display:inline-block; width:5px; height:5px; border-radius:50%; background:#000; margin:0 2px; }
  .ldot:nth-child(1){animation:ldot 1s 0.0s infinite}
  .ldot:nth-child(2){animation:ldot 1s 0.15s infinite}
  .ldot:nth-child(3){animation:ldot 1s 0.3s infinite}

  /* ── LAYOUT ── */
  .ec-layout {
    display: grid;
    grid-template-columns: 1fr 290px;
    gap: 22px;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .ec-layout { grid-template-columns: 1fr !important; }
    .ec-changes-panel { order: -1; }
  }

  @media (max-width: 768px) {
    .ec-inner { padding: 20px 16px 40px !important; }
    .ec-form-grid { grid-template-columns: 1fr !important; }
  }
`;

const FIELD_META = {
  courseCode: { label: "Course Code", icon: Hash,       placeholder: "e.g. CS-301" },
  courseName: { label: "Course Name", icon: BookOpen,   placeholder: "e.g. Data Structures" },
  department: { label: "Department",  icon: Building2,  placeholder: "e.g. Computer Science" },
  faculty:    { label: "Faculty",     icon: Users,      placeholder: "e.g. Dr. Sharma" },
};

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseCode: "", courseName: "", department: "",
    credits: 3, semester: 1, faculty: "",
  });
  const [original, setOriginal] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchCourse(); }, []);

  const fetchCourse = async () => {
    try {
      setFetching(true);
      const { data } = await API.get(`/courses/${id}`);
      setForm(data);
      setOriginal(data);
    } catch {
      alert("Failed to load course");
    } finally {
      setFetching(false);
    }
  };

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.put(`/courses/${id}`, form);
      setSuccess(true);
      setTimeout(() => navigate("/courses"), 1600);
    } catch {
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // track which fields changed
  const changedFields = original
    ? Object.keys(form).filter(
        (k) => String(form[k]) !== String(original[k])
      )
    : [];

  const hasChanges = changedFields.length > 0;

  return (
    <>
      <style>{STYLES}</style>

      <div className="ec-root flex min-h-screen" style={{ background: "#070707", color: "#fff" }}>
        <Sidebar />

        <div className="ec-inner flex-1 p-6 sm:p-10 overflow-x-hidden" style={{ position: "relative" }}>

          {/* Back */}
          <button className="ec-back" onClick={() => navigate("/courses")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "rgba(255,255,255,0.35)",
            background: "none", border: "none", cursor: "pointer",
            padding: 0, fontFamily: "'DM Sans', sans-serif",
            marginBottom: 10, transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.65)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          >
            <ArrowLeft size={14} /> Back to Courses
          </button>

          {/* Header */}
          <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <RefreshCw size={18} color="#fbbf24" />
                </div>
                <h1 className="ec-font-display" style={{ fontSize: "clamp(28px,5vw,46px)", color: "#fbbf24", lineHeight: 1 }}>
                  Edit Course
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, paddingLeft: 2 }}>
                Modify course details and save your changes
              </p>
            </div>

            {/* Changed badge */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="ec-changed-badge"
                >
                  ● {changedFields.length} unsaved change{changedFields.length > 1 ? "s" : ""}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "fixed", inset: 0, zIndex: 100,
                  background: "rgba(7,7,7,0.92)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 16, textAlign: "center",
                }}
              >
                <CheckCircle size={60} color="#22c55e" className="success-icon" />
                <h2 className="ec-font-display" style={{ fontSize: 36, color: "#fff" }}>Course Updated!</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Redirecting to courses…</p>
                <div style={{ width: 220, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: "100%" }}
                    transition={{ duration: 1.6, ease: "linear" }}
                    style={{ height: "100%", background: "linear-gradient(90deg,#fbbf24,#22c55e)" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main layout */}
          <div className="ec-layout">

            {/* ── FORM ── */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "clamp(20px,4vw,34px)",
              position: "relative", overflow: "hidden",
            }}>
              <div className="ec-orb" style={{ width: 240, height: 240, background: "rgba(251,191,36,0.06)", top: -70, right: -50 }} />
              <div className="ec-orb" style={{ width: 160, height: 160, background: "rgba(52,211,153,0.04)", bottom: -40, left: -30, animationDelay: "-8s" }} />

              {fetching ? (
                /* Skeleton */
                <div className="ec-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, position: "relative", zIndex: 1 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      <div className="ec-skeleton" style={{ height: 12, width: "40%", borderRadius: 6 }} />
                      <div className="ec-skeleton" style={{ height: 46, borderRadius: 12 }} />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="ec-skeleton" style={{ height: 52, borderRadius: 12 }} />
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} style={{ position: "relative", zIndex: 1 }}>
                  <div className="ec-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

                    {/* Text fields */}
                    {Object.entries(FIELD_META).map(([key, meta]) => {
                      const Icon = meta.icon;
                      const isDirty = original && String(form[key]) !== String(original[key]);
                      return (
                        <div key={key} className="ec-field">
                          <label className="ec-label">
                            <Icon size={11} style={{ opacity: 0.55 }} />
                            {meta.label}
                            {isDirty && <span style={{ color: "#fbbf24", fontSize: 16, lineHeight: 0.8 }}>·</span>}
                          </label>
                          <div className="ec-input-wrap">
                            <Icon size={15} className="ec-input-icon" />
                            <input
                              type="text"
                              placeholder={meta.placeholder}
                              value={form[key]}
                              onChange={(e) => set(key, e.target.value)}
                              className={`ec-input${isDirty ? " dirty" : ""}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Semester stepper */}
                    <div className="ec-field">
                      <label className="ec-label">
                        <CalendarDays size={11} style={{ opacity: 0.55 }} />
                        Semester
                        {original && String(form.semester) !== String(original.semester) && (
                          <span style={{ color: "#fbbf24", fontSize: 16, lineHeight: 0.8 }}>·</span>
                        )}
                      </label>
                      <div className="ec-stepper">
                        <button type="button" className="ec-step-btn" onClick={() => set("semester", Math.max(1, Number(form.semester) - 1))}>−</button>
                        <span className="ec-step-val">{form.semester}</span>
                        <button type="button" className="ec-step-btn" onClick={() => set("semester", Math.min(8, Number(form.semester) + 1))}>+</button>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: 2 }}>Range: 1 – 8</p>
                    </div>

                    {/* Credits stepper */}
                    <div className="ec-field">
                      <label className="ec-label">
                        <Star size={11} style={{ opacity: 0.55 }} />
                        Credits
                        {original && String(form.credits) !== String(original.credits) && (
                          <span style={{ color: "#fbbf24", fontSize: 16, lineHeight: 0.8 }}>·</span>
                        )}
                      </label>
                      <div className="ec-stepper">
                        <button type="button" className="ec-step-btn" onClick={() => set("credits", Math.max(1, Number(form.credits) - 1))}>−</button>
                        <span className="ec-step-val">{form.credits}</span>
                        <button type="button" className="ec-step-btn" onClick={() => set("credits", Math.min(6, Number(form.credits) + 1))}>+</button>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: 2 }}>Range: 1 – 6</p>
                    </div>

                  </div>

                  {/* Credits bar */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="ec-font-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Credit weight</span>
                      <span className="ec-font-mono" style={{ fontSize: 10, color: "rgba(251,191,36,0.55)" }}>{form.credits}/6</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div
                        animate={{ width: `${(Number(form.credits) / 6) * 100}%` }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#fbbf24,#f59e0b)" }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading || !hasChanges}
                    whileHover={{ scale: (loading || !hasChanges) ? 1 : 1.015 }}
                    whileTap={{ scale: (loading || !hasChanges) ? 1 : 0.985 }}
                    className="ec-submit"
                    style={!hasChanges ? { opacity: 0.45, cursor: "not-allowed" } : {}}
                  >
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        Saving changes
                        <span className="ldot" /><span className="ldot" /><span className="ldot" />
                      </span>
                    ) : (
                      <>
                        <RefreshCw size={15} />
                        Update Course
                        <ArrowRight size={15} />
                      </>
                    )}
                  </motion.button>

                  {!hasChanges && !loading && (
                    <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                      No changes made yet
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* ── CHANGES PANEL ── */}
            <div className="ec-changes-panel" style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Current values snapshot */}
              <div>
                <p className="ec-font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 10 }}>
                  Current Values
                </p>
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: 14,
                }}>
                  {fetching ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
                        <div className="ec-skeleton" style={{ height: 10, width: "35%", borderRadius: 5 }} />
                        <div className="ec-skeleton" style={{ height: 10, width: "45%", borderRadius: 5 }} />
                      </div>
                    ))
                  ) : (
                    [
                      { label: "Code",     value: form.courseCode || "—" },
                      { label: "Name",     value: form.courseName || "—" },
                      { label: "Dept",     value: form.department || "—" },
                      { label: "Faculty",  value: form.faculty    || "—" },
                      { label: "Semester", value: `Sem ${form.semester}` },
                      { label: "Credits",  value: `${form.credits} hrs` },
                    ].map(({ label, value }) => {
                      const key = label === "Code" ? "courseCode"
                        : label === "Name" ? "courseName"
                        : label === "Dept" ? "department"
                        : label === "Semester" ? "semester"
                        : label === "Credits" ? "credits"
                        : "faculty";
                      const isDirty = original && String(form[key]) !== String(original[key]);
                      return (
                        <div key={label} className="ec-diff-row">
                          <span className="ec-font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                            {label}
                          </span>
                          <span style={{
                            fontSize: 12,
                            color: isDirty ? "#fbbf24" : "rgba(255,255,255,0.5)",
                            fontFamily: isDirty ? "'DM Mono', monospace" : "inherit",
                            textAlign: "right", maxWidth: 140,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            transition: "color 0.2s",
                          }}>
                            {isDirty && <span style={{ marginRight: 4, opacity: 0.6 }}>✎</span>}
                            {value}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Changes summary */}
              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      background: "rgba(251,191,36,0.05)",
                      border: "1px solid rgba(251,191,36,0.14)",
                      borderRadius: 14, padding: 14,
                    }}
                  >
                    <p className="ec-font-mono" style={{ fontSize: 9, color: "rgba(251,191,36,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                      {changedFields.length} Pending Change{changedFields.length > 1 ? "s" : ""}
                    </p>
                    {changedFields.map((key) => (
                      <div key={key} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fbbf24", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", color: "#fbbf24", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.08em" }}>{key}</span>
                        <span style={{ opacity: 0.4, fontSize: 10 }}>modified</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No changes note */}
              {!hasChanges && !fetching && (
                <div style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <CheckCircle size={14} color="#4ade80" />
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.4 }}>
                    No changes yet. Edit any field to track modifications.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default EditCourse;
