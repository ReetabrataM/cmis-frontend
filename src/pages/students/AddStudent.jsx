import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Hash, BookOpen, Building2,
  Phone, MapPin, GraduationCap, ArrowRight,
  ArrowLeft, CheckCircle, CalendarDays,
} from "lucide-react";

/* ─── STYLES ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .as-root * { box-sizing: border-box; }
  .as-root { font-family: 'DM Sans', sans-serif; }
  .as-display { font-family: 'Cormorant Garamond', serif; }
  .as-mono    { font-family: 'DM Mono', monospace; }

  /* ── INPUT ── */
  .as-field { display: flex; flex-direction: column; gap: 7px; }

  .as-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.2em; color: rgba(255,255,255,0.3);
    display: flex; align-items: center; gap: 6px;
  }

  .as-label-req { color: rgba(251,191,36,0.5); font-size: 12px; line-height: 0.8; }

  .as-input-wrap { position: relative; }

  .as-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.22); pointer-events: none; transition: color 0.2s;
  }
  .as-textarea-icon {
    position: absolute; left: 14px; top: 15px;
    color: rgba(255,255,255,0.22); pointer-events: none; transition: color 0.2s;
  }

  .as-input-wrap:focus-within .as-input-icon,
  .as-input-wrap:focus-within .as-textarea-icon { color: rgba(251,191,36,0.65); }

  .as-input {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 12px 14px 12px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none; appearance: none;
  }
  .as-input::placeholder { color: rgba(255,255,255,0.18); }
  .as-input:focus {
    border-color: rgba(251,191,36,0.48);
    background: rgba(251,191,36,0.035);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }
  .as-input.filled {
    border-color: rgba(251,191,36,0.22);
    background: rgba(251,191,36,0.02);
  }
  .as-input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }

  /* ── SEMESTER STEPPER ── */
  .as-stepper {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .as-stepper:focus-within {
    border-color: rgba(251,191,36,0.42);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }
  .as-step-btn {
    width: 44px; height: 46px; display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04); border: none; color: rgba(255,255,255,0.4);
    cursor: pointer; font-size: 18px; font-weight: 300; flex-shrink: 0;
    transition: background 0.15s, color 0.15s; line-height: 1;
  }
  .as-step-btn:hover { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .as-step-btn:active { background: rgba(251,191,36,0.2); }
  .as-step-val {
    flex: 1; text-align: center;
    font-family: 'DM Mono', monospace; font-size: 16px; font-weight: 500;
    color: #fff; background: none; border: none; outline: none; padding: 0;
  }

  /* ── TEXTAREA ── */
  .as-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 12px 14px 12px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none; resize: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }
  .as-textarea::placeholder { color: rgba(255,255,255,0.18); }
  .as-textarea:focus {
    border-color: rgba(251,191,36,0.48);
    background: rgba(251,191,36,0.035);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }
  .as-textarea.filled {
    border-color: rgba(251,191,36,0.2);
    background: rgba(251,191,36,0.02);
  }

  /* ── SUBMIT ── */
  .as-submit {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #fbbf24, #f59e0b 50%, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 0.04em;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: box-shadow 0.25s, transform 0.15s, opacity 0.2s;
    position: relative; overflow: hidden;
  }
  .as-submit::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .as-submit:not(:disabled):hover { box-shadow: 0 6px 28px rgba(251,191,36,0.38); transform: translateY(-1px); }
  .as-submit:not(:disabled):hover::after { opacity: 1; }
  .as-submit:not(:disabled):active { transform: translateY(0); }
  .as-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── BACK ── */
  .as-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: rgba(255,255,255,0.35);
    background: none; border: none; cursor: pointer;
    padding: 0; font-family: 'DM Sans', sans-serif;
    transition: color 0.2s; margin-bottom: 10px; text-decoration: none;
  }
  .as-back:hover { color: rgba(255,255,255,0.65); }

  /* ── PREVIEW CARD ── */
  .as-preview-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 10px;
  }
  .as-preview-row:last-child { border-bottom: none; }

  /* ── ORB ── */
  @keyframes as-orb { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,15px) scale(1.04)} }
  .as-orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; animation:as-orb 16s ease-in-out infinite; z-index:0; }

  /* ── SUCCESS ── */
  @keyframes as-pop {
    0%  { transform:scale(0.5); opacity:0; }
    70% { transform:scale(1.15); }
    100%{ transform:scale(1); opacity:1; }
  }
  .as-success-icon { animation: as-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* ── LOADER DOTS ── */
  @keyframes ldot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  .ldot { display:inline-block; width:5px; height:5px; border-radius:50%; background:#000; margin:0 2px; }
  .ldot:nth-child(1){animation:ldot 1s 0.0s infinite}
  .ldot:nth-child(2){animation:ldot 1s 0.15s infinite}
  .ldot:nth-child(3){animation:ldot 1s 0.3s infinite}

  /* ── LAYOUT ── */
  .as-layout { display:grid; grid-template-columns:1fr 290px; gap:22px; align-items:start; }

  @media (max-width:1024px) {
    .as-layout { grid-template-columns:1fr !important; }
    .as-preview-panel { order:-1; }
  }
  @media (max-width:768px) {
    .as-inner { padding:20px 16px 40px !important; }
    .as-form-grid { grid-template-columns:1fr !important; }
    .as-header-row { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
  }
`;

/* deterministic avatar hue */
const avatarHue = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

const FIELDS = [
  { name: "name",       label: "Full Name",    icon: User,         type: "text",  placeholder: "e.g. John Doe",          required: true },
  { name: "email",      label: "Email",        icon: Mail,         type: "email", placeholder: "e.g. john@example.com",  required: true },
  { name: "rollNumber", label: "Roll Number",  icon: Hash,         type: "text",  placeholder: "e.g. CS2026001",         required: true },
  { name: "course",     label: "Course",       icon: BookOpen,     type: "text",  placeholder: "e.g. B.Tech CSE",        required: true },
  { name: "department", label: "Department",   icon: Building2,    type: "text",  placeholder: "e.g. Computer Science",  required: true },
  { name: "phone",      label: "Phone",        icon: Phone,        type: "text",  placeholder: "e.g. +91 98765 43210",   required: true },
];

function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", course: "", department: "",
    phone: "", address: "", semester: 1, rollNumber: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const setSemester = (val) =>
    setFormData((prev) => ({ ...prev, semester: Math.min(8, Math.max(1, val)) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/students", formData);
      setSuccess(true);
      setTimeout(() => navigate("/students"), 1700);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const requiredFields = ["name", "email", "rollNumber", "course", "department", "phone"];
  const filledCount    = requiredFields.filter((k) => formData[k].trim()).length;
  const hue            = avatarHue(formData.name);

  return (
    <>
      <style>{STYLES}</style>

      <div className="as-root flex min-h-screen" style={{ background: "#070707", color: "#fff", position: "relative" }}>
        <div className="as-orb" style={{ width: 400, height: 400, background: "rgba(251,191,36,0.06)", top: "-7%", right: "7%", zIndex: 0 }} />
        <div className="as-orb" style={{ width: 280, height: 280, background: "rgba(167,139,250,0.04)", bottom: "8%", left: "13%", animationDelay: "-8s", zIndex: 0 }} />

        <Sidebar />

        <div className="as-inner flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden" style={{ position: "relative", zIndex: 1 }}>

          {/* Back */}
          <button className="as-back" onClick={() => navigate("/students")}>
            <ArrowLeft size={14} /> Back to Students
          </button>

          {/* Header */}
          <div className="as-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <GraduationCap size={18} color="#fbbf24" />
                </div>
                <h1 className="as-display" style={{ fontSize: "clamp(28px,5vw,46px)", color: "#fbbf24", lineHeight: 1, margin: 0 }}>
                  Add Student
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, paddingLeft: 2 }}>
                Create a new student academic record
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 5, marginBottom: 22 }}>
            {requiredFields.map((k, i) => (
              <div key={k} style={{
                flex: 1, height: 3, borderRadius: 99,
                background: formData[k].trim() ? "rgba(251,191,36,0.65)" : "rgba(255,255,255,0.08)",
                transition: "background 0.35s",
              }} />
            ))}
          </div>

          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  position: "fixed", inset: 0, zIndex: 100,
                  background: "rgba(7,7,7,0.92)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 16, textAlign: "center",
                }}
              >
                <CheckCircle size={60} color="#22c55e" className="as-success-icon" />
                <h2 className="as-display" style={{ fontSize: 36, color: "#fff" }}>Student Added!</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Redirecting to students…</p>
                <div style={{ width: 220, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: "100%" }}
                    transition={{ duration: 1.7, ease: "linear" }}
                    style={{ height: "100%", background: "linear-gradient(90deg,#fbbf24,#22c55e)" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main layout */}
          <div className="as-layout">

            {/* ── FORM ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "clamp(20px,4vw,34px)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Corner orb */}
              <div style={{ position: "absolute", top: -70, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(251,191,36,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -50, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(167,139,250,0.04)", filter: "blur(70px)", pointerEvents: "none" }} />

              <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
                <div className="as-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

                  {/* Text fields */}
                  {FIELDS.map(({ name, label, icon: Icon, type, placeholder, required }) => {
                    const isFilled = formData[name].trim().length > 0;
                    return (
                      <div key={name} className="as-field">
                        <label className="as-label">
                          <Icon size={11} style={{ opacity: 0.55 }} />
                          {label}
                          {required && <span className="as-label-req">*</span>}
                        </label>
                        <div className="as-input-wrap">
                          <Icon size={15} className="as-input-icon" />
                          <input
                            type={type} name={name}
                            value={formData[name]} onChange={handleChange}
                            placeholder={placeholder} required={required}
                            className={`as-input${isFilled ? " filled" : ""}`}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Semester stepper — full width */}
                  <div className="as-field" style={{ gridColumn: "1 / -1" }}>
                    <label className="as-label">
                      <CalendarDays size={11} style={{ opacity: 0.55 }} />
                      Semester
                      <span className="as-label-req">*</span>
                    </label>
                    <div className="as-stepper">
                      <button type="button" className="as-step-btn" onClick={() => setSemester(Number(formData.semester) - 1)}>−</button>
                      <span className="as-step-val">{formData.semester}</span>
                      <button type="button" className="as-step-btn" onClick={() => setSemester(Number(formData.semester) + 1)}>+</button>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: 2 }}>Range: 1 – 8</p>
                  </div>

                  {/* Address — full width */}
                  <div className="as-field" style={{ gridColumn: "1 / -1" }}>
                    <label className="as-label">
                      <MapPin size={11} style={{ opacity: 0.55 }} />
                      Address
                    </label>
                    <div className="as-input-wrap">
                      <MapPin size={15} className="as-textarea-icon" />
                      <textarea
                        name="address" rows={3}
                        value={formData.address} onChange={handleChange}
                        placeholder="e.g. 123 Main Street, Mumbai, India"
                        className={`as-textarea${formData.address.trim() ? " filled" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.012 }}
                  whileTap={{ scale: loading ? 1 : 0.988 }}
                  className="as-submit"
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Saving student
                      <span className="ldot" /><span className="ldot" /><span className="ldot" />
                    </span>
                  ) : (
                    <><GraduationCap size={16} /> Save Student <ArrowRight size={15} /></>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* ── PREVIEW PANEL ── */}
            <div className="as-preview-panel" style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }}>

              <div>
                <p className="as-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 10 }}>
                  Live Preview
                </p>

                {/* mini student card */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16, padding: 18,
                  position: "relative", overflow: "hidden",
                }}>
                  {formData.name && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: `linear-gradient(90deg,transparent,hsl(${hue},50%,55%)40,transparent)`,
                    }} />
                  )}

                  {/* Avatar + name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: formData.name ? `hsl(${hue},40%,20%)` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${formData.name ? `hsl(${hue},40%,30%)` : "rgba(255,255,255,0.08)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700,
                      color: formData.name ? `hsl(${hue},65%,70%)` : "rgba(255,255,255,0.2)",
                      transition: "all 0.3s",
                    }}>
                      {formData.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: formData.name ? "#fff" : "rgba(255,255,255,0.2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.2s" }}>
                        {formData.name || "Student Name"}
                      </p>
                      <p style={{ fontSize: 11, color: formData.email ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.15)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {formData.email || "email@example.com"}
                      </p>
                    </div>
                  </div>

                  {/* Meta rows */}
                  {[
                    { label: "Roll",    value: formData.rollNumber },
                    { label: "Course",  value: formData.course },
                    { label: "Dept",    value: formData.department },
                    { label: "Phone",   value: formData.phone },
                    { label: "Sem",     value: `Semester ${formData.semester}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="as-preview-row">
                      <span className="as-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.24)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</span>
                      <span style={{ fontSize: 12, color: value ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.16)", transition: "color 0.2s", textAlign: "right", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion tracker */}
              <div style={{
                padding: "12px 14px",
                background: filledCount === 6 ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${filledCount === 6 ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 12,
                display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.3s",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: filledCount === 6 ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${filledCount === 6 ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}>
                  <span className="as-mono" style={{ fontSize: 10, color: filledCount === 6 ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                    {filledCount}/6
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                  {filledCount === 6
                    ? "All required fields complete!"
                    : `${6 - filledCount} required field${6 - filledCount > 1 ? "s" : ""} remaining`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddStudent;
