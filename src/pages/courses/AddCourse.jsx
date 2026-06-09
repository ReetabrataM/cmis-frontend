import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ac-root * { box-sizing: border-box; }
  .ac-root { font-family: 'DM Sans', sans-serif; }
  .ac-font-display { font-family: 'Cormorant Garamond', serif; }
  .ac-font-mono { font-family: 'DM Mono', monospace; }

  /* ── INPUT FIELD ── */
  .ac-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ac-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.32);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ac-label-required {
    color: rgba(251,191,36,0.5);
    font-size: 12px;
    line-height: 1;
  }

  .ac-input-wrap {
    position: relative;
  }

  .ac-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.22);
    pointer-events: none;
    transition: color 0.2s ease;
  }

  .ac-input-wrap:focus-within .ac-input-icon {
    color: rgba(251,191,36,0.65);
  }

  .ac-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
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

  .ac-input::placeholder { color: rgba(255,255,255,0.18); }

  .ac-input:focus {
    border-color: rgba(251,191,36,0.48);
    background: rgba(251,191,36,0.035);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }

  .ac-input.filled {
    border-color: rgba(251,191,36,0.22);
    background: rgba(251,191,36,0.02);
  }

  /* number input arrows */
  .ac-input[type=number]::-webkit-inner-spin-button,
  .ac-input[type=number]::-webkit-outer-spin-button {
    opacity: 0.3;
    cursor: pointer;
  }

  /* ── STEPPER (semester / credits) ── */
  .ac-stepper {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  .ac-stepper:focus-within {
    border-color: rgba(251,191,36,0.4);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  .ac-step-btn {
    width: 42px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.04);
    border: none;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    font-size: 18px;
    font-weight: 300;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
    line-height: 1;
  }

  .ac-step-btn:hover {
    background: rgba(251,191,36,0.12);
    color: #fbbf24;
  }

  .ac-step-btn:active { background: rgba(251,191,36,0.2); }

  .ac-step-val {
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
    -webkit-appearance: none;
  }

  /* ── SUBMIT BUTTON ── */
  .ac-submit {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
    color: #000;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: box-shadow 0.25s, transform 0.15s, opacity 0.2s;
    position: relative;
    overflow: hidden;
  }

  .ac-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .ac-submit:not(:disabled):hover {
    box-shadow: 0 6px 28px rgba(251,191,36,0.38);
    transform: translateY(-1px);
  }

  .ac-submit:not(:disabled):hover::after { opacity: 1; }
  .ac-submit:not(:disabled):active { transform: translateY(0); }
  .ac-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── PREVIEW PANEL ── */
  .ac-preview {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ac-preview-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    gap: 12px;
  }

  .ac-preview-row:last-child { border-bottom: none; }

  /* ── BACK LINK ── */
  .ac-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    text-decoration: none;
    transition: color 0.2s;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 10px;
  }

  .ac-back:hover { color: rgba(255,255,255,0.7); }

  /* ── PROGRESS INDICATOR ── */
  .ac-progress-wrap {
    display: flex;
    gap: 6px;
    margin-bottom: 28px;
  }

  .ac-prog-seg {
    height: 3px;
    flex: 1;
    border-radius: 99px;
    background: rgba(255,255,255,0.08);
    transition: background 0.35s;
  }

  .ac-prog-seg.filled {
    background: rgba(251,191,36,0.65);
  }

  /* ── LOADER DOTS ── */
  @keyframes ldot {
    0%,80%,100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
  }

  .ldot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #000; margin: 0 2px; }
  .ldot:nth-child(1) { animation: ldot 1s 0.0s infinite; }
  .ldot:nth-child(2) { animation: ldot 1s 0.15s infinite; }
  .ldot:nth-child(3) { animation: ldot 1s 0.3s infinite; }

  /* ── SUCCESS ── */
  @keyframes success-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  .success-icon { animation: success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* ── ORB ── */
  @keyframes orb-drift {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-20px, 20px) scale(1.05); }
  }

  .ac-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    animation: orb-drift 16s ease-in-out infinite;
  }

  /* ── LAYOUT ── */
  .ac-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    align-items: start;
  }

  /* ── MOBILE ── */
  @media (max-width: 1024px) {
    .ac-layout {
      grid-template-columns: 1fr !important;
    }
    .ac-preview-panel { order: -1; }
  }

  @media (max-width: 768px) {
    .ac-inner {
      padding: 20px 16px 40px !important;
    }
    .ac-form-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

const FIELD_META = {
  courseCode:  { label: "Course Code",  icon: Hash,        placeholder: "e.g. CS-301",           hint: "Unique identifier" },
  courseName:  { label: "Course Name",  icon: BookOpen,    placeholder: "e.g. Data Structures",   hint: "Full course title" },
  department:  { label: "Department",   icon: Building2,   placeholder: "e.g. Computer Science",  hint: "Academic department" },
  faculty:     { label: "Faculty",      icon: Users,       placeholder: "e.g. Dr. Sharma",        hint: "Assigned instructor" },
};

function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    department: "",
    credits: 3,
    semester: 1,
    faculty: "",
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/courses", form);
      setSuccess(true);
      setTimeout(() => navigate("/courses"), 1600);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  // progress = how many of the 4 text fields are filled
  const textFields = ["courseCode", "courseName", "department", "faculty"];
  const filledCount = textFields.filter((k) => form[k].trim()).length;

  return (
    <>
      <style>{STYLES}</style>

      <div className="ac-root flex min-h-screen" style={{ background: "#070707", color: "#fff" }}>
        <Sidebar />

        <div className="ac-inner flex-1 p-6 sm:p-10 overflow-x-hidden" style={{ position: "relative" }}>

          {/* Back */}
          <button className="ac-back" onClick={() => navigate("/courses")}>
            <ArrowLeft size={14} /> Back to Courses
          </button>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <BookOpen size={19} color="#fbbf24" />
              </div>
              <h1 className="ac-font-display" style={{ fontSize: "clamp(28px,5vw,46px)", color: "#fbbf24", lineHeight: 1 }}>
                Create Course
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, paddingLeft: 2 }}>
              Build academic programs and assign faculty
            </p>
          </div>

          {/* Progress */}
          <div className="ac-progress-wrap">
            {textFields.map((_, i) => (
              <div key={i} className={`ac-prog-seg ${i < filledCount ? "filled" : ""}`} />
            ))}
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
                <h2 className="ac-font-display" style={{ fontSize: 36, color: "#fff" }}>Course Created!</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Redirecting to courses…</p>
                <div style={{ width: 220, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6, ease: "linear" }}
                    style={{ height: "100%", background: "linear-gradient(90deg, #fbbf24, #22c55e)" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main layout */}
          <div className="ac-layout">

            {/* ── FORM ── */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "clamp(20px,4vw,36px)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Orb */}
              <div className="ac-orb" style={{ width: 260, height: 260, background: "rgba(251,191,36,0.06)", top: -80, right: -60 }} />
              <div className="ac-orb" style={{ width: 180, height: 180, background: "rgba(52,211,153,0.04)", bottom: -40, left: -40, animationDelay: "-8s" }} />

              <form onSubmit={submit} style={{ position: "relative", zIndex: 1 }}>
                <div
                  className="ac-form-grid"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}
                >

                  {/* Text fields */}
                  {Object.entries(FIELD_META).map(([key, meta]) => {
                    const Icon = meta.icon;
                    const isFilled = form[key].trim().length > 0;
                    return (
                      <div key={key} className="ac-field">
                        <label className="ac-label">
                          <Icon size={11} style={{ opacity: 0.6 }} />
                          {meta.label}
                          <span className="ac-label-required">*</span>
                        </label>
                        <div className="ac-input-wrap">
                          <Icon size={15} className="ac-input-icon" />
                          <input
                            type="text"
                            placeholder={meta.placeholder}
                            value={form[key]}
                            onChange={(e) => set(key, e.target.value)}
                            className={`ac-input${isFilled ? " filled" : ""}`}
                            required
                          />
                        </div>
                        {meta.hint && (
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: 2 }}>{meta.hint}</p>
                        )}
                      </div>
                    );
                  })}

                  {/* Semester stepper */}
                  <div className="ac-field">
                    <label className="ac-label">
                      <CalendarDays size={11} style={{ opacity: 0.6 }} />
                      Semester
                      <span className="ac-label-required">*</span>
                    </label>
                    <div className="ac-stepper">
                      <button
                        type="button"
                        className="ac-step-btn"
                        onClick={() => set("semester", Math.max(1, Number(form.semester) - 1))}
                      >−</button>
                      <span className="ac-step-val">{form.semester}</span>
                      <button
                        type="button"
                        className="ac-step-btn"
                        onClick={() => set("semester", Math.min(8, Number(form.semester) + 1))}
                      >+</button>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: 2 }}>1 – 8</p>
                  </div>

                  {/* Credits stepper */}
                  <div className="ac-field">
                    <label className="ac-label">
                      <Star size={11} style={{ opacity: 0.6 }} />
                      Credits
                      <span className="ac-label-required">*</span>
                    </label>
                    <div className="ac-stepper">
                      <button
                        type="button"
                        className="ac-step-btn"
                        onClick={() => set("credits", Math.max(1, Number(form.credits) - 1))}
                      >−</button>
                      <span className="ac-step-val">{form.credits}</span>
                      <button
                        type="button"
                        className="ac-step-btn"
                        onClick={() => set("credits", Math.min(6, Number(form.credits) + 1))}
                      >+</button>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: 2 }}>1 – 6 credit hours</p>
                  </div>

                </div>

                {/* Credits bar */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      Credit weight
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(251,191,36,0.6)", fontFamily: "'DM Mono', monospace" }}>
                      {form.credits}/6
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${(form.credits / 6) * 100}%` }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#fbbf24,#f59e0b)" }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="ac-submit"
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Creating course
                      <span className="ldot" /><span className="ldot" /><span className="ldot" />
                    </span>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      Create Course
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* ── PREVIEW PANEL ── */}
            <div className="ac-preview-panel" style={{ position: "sticky", top: 24 }}>
              <p className="ac-font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>
                Live Preview
              </p>

              {/* Mini course card */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 18,
                marginBottom: 16,
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Top edge shimmer if name filled */}
                {form.courseName && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)",
                  }} />
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: form.courseName ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.courseName ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.07)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                  }}>
                    <BookOpen size={16} color={form.courseName ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
                  </div>

                  {form.courseCode ? (
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11,
                      color: "#fbbf24",
                      background: "rgba(251,191,36,0.08)",
                      border: "1px solid rgba(251,191,36,0.18)",
                      padding: "2px 9px", borderRadius: 99,
                    }}>
                      {form.courseCode}
                    </span>
                  ) : (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>CODE</span>
                  )}
                </div>

                <p style={{ fontSize: 15, fontWeight: 600, color: form.courseName ? "#fff" : "rgba(255,255,255,0.2)", marginBottom: 4, minHeight: 20 }}>
                  {form.courseName || "Course Name"}
                </p>
                <p style={{ fontSize: 12, color: form.department ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)", marginBottom: 14, minHeight: 16 }}>
                  {form.department || "Department"}
                </p>

                {/* Meta */}
                <div className="ac-preview">
                  {[
                    { label: "Faculty",   value: form.faculty   || "—" },
                    { label: "Semester",  value: `Semester ${form.semester}` },
                    { label: "Credits",   value: `${form.credits} credit hrs` },
                  ].map(({ label, value }) => (
                    <div key={label} className="ac-preview-row">
                      <span className="ac-font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fill progress note */}
              <div style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: filledCount === 4 ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${filledCount === 4 ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.3s",
                }}>
                  <span className="ac-font-mono" style={{ fontSize: 10, color: filledCount === 4 ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                    {filledCount}/4
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                  {filledCount === 4 ? "All fields complete. Ready to create!" : `${4 - filledCount} field${4 - filledCount > 1 ? "s" : ""} remaining`}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AddCourse;
