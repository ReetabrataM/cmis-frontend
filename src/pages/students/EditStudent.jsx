import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import {
  ArrowLeft, User, Mail, Hash,
  BookOpen, Building2, Phone, MapPin,
  RefreshCw, ArrowRight, CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .es-root * { box-sizing: border-box; }
  .es-root { font-family: 'DM Sans', sans-serif; }
  .es-display { font-family: 'Cormorant Garamond', serif; }
  .es-mono    { font-family: 'DM Mono', monospace; }

  /* ── INPUT ── */
  .es-field { display: flex; flex-direction: column; gap: 7px; }

  .es-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.2em; color: rgba(255,255,255,0.3);
    display: flex; align-items: center; gap: 6px;
  }

  .es-label.dirty { color: rgba(251,191,36,0.55); }

  .es-input-wrap { position: relative; }

  .es-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.22); pointer-events: none; transition: color 0.2s;
  }

  .es-textarea-icon {
    position: absolute; left: 14px; top: 16px;
    color: rgba(255,255,255,0.22); pointer-events: none; transition: color 0.2s;
  }

  .es-input-wrap:focus-within .es-input-icon,
  .es-input-wrap:focus-within .es-textarea-icon { color: rgba(251,191,36,0.65); }

  .es-input {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 12px 14px 12px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }
  .es-input::placeholder { color: rgba(255,255,255,0.18); }
  .es-input:focus {
    border-color: rgba(251,191,36,0.48);
    background: rgba(251,191,36,0.035);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }
  .es-input.dirty {
    border-color: rgba(251,191,36,0.25);
    background: rgba(251,191,36,0.025);
  }

  .es-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 12px 14px 12px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none; resize: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }
  .es-textarea::placeholder { color: rgba(255,255,255,0.18); }
  .es-textarea:focus {
    border-color: rgba(251,191,36,0.48);
    background: rgba(251,191,36,0.035);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }
  .es-textarea.dirty {
    border-color: rgba(251,191,36,0.25);
    background: rgba(251,191,36,0.025);
  }

  /* ── SUBMIT ── */
  .es-submit {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #fbbf24, #f59e0b 50%, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 0.04em;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: box-shadow 0.25s, transform 0.15s, opacity 0.2s;
    position: relative; overflow: hidden;
  }
  .es-submit::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .es-submit:not(:disabled):hover { box-shadow: 0 6px 28px rgba(251,191,36,0.38); transform: translateY(-1px); }
  .es-submit:not(:disabled):hover::after { opacity: 1; }
  .es-submit:not(:disabled):active { transform: translateY(0); }
  .es-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── BACK BTN ── */
  .es-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: rgba(255,255,255,0.35);
    background: none; border: none; cursor: pointer;
    padding: 0; font-family: 'DM Sans', sans-serif;
    transition: color 0.2s; margin-bottom: 10px;
  }
  .es-back:hover { color: rgba(255,255,255,0.65); }

  /* ── CHANGED BADGE ── */
  .es-changed-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px;
    background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2);
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: rgba(251,191,36,0.7); letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ── SKELETON ── */
  @keyframes es-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .es-skeleton {
    border-radius: 10px;
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 1200px 100%; animation: es-shimmer 1.5s infinite linear;
  }

  /* ── ORB ── */
  @keyframes es-orb { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,15px) scale(1.04)} }
  .es-orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; animation:es-orb 16s ease-in-out infinite; z-index:0; }

  /* ── SUCCESS ── */
  @keyframes es-pop {
    0%  { transform:scale(0.5); opacity:0; }
    70% { transform:scale(1.15); }
    100%{ transform:scale(1); opacity:1; }
  }
  .es-success-icon { animation: es-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* ── LOADER DOTS ── */
  @keyframes ldot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  .ldot { display:inline-block; width:5px; height:5px; border-radius:50%; background:#000; margin:0 2px; }
  .ldot:nth-child(1){animation:ldot 1s 0.0s infinite}
  .ldot:nth-child(2){animation:ldot 1s 0.15s infinite}
  .ldot:nth-child(3){animation:ldot 1s 0.3s infinite}

  /* ── PROGRESS DOTS ── */
  .es-prog-seg { height:3px; border-radius:99px; transition: background 0.35s; }

  /* ── DIFF PANEL ── */
  .es-diff-row {
    display:flex; justify-content:space-between; align-items:center;
    padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.05); gap:10px;
  }
  .es-diff-row:last-child { border-bottom:none; }

  /* ── LAYOUT ── */
  .es-layout { display:grid; grid-template-columns:1fr 280px; gap:22px; align-items:start; }

  @media (max-width:1024px) {
    .es-layout { grid-template-columns:1fr !important; }
    .es-side-panel { order:-1; }
  }
  @media (max-width:768px) {
    .es-inner { padding:20px 16px 40px !important; }
    .es-form-grid { grid-template-columns:1fr !important; }
    .es-header-row { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
  }
`;

const avatarHue = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

const FIELD_META = [
  { name: "name",        label: "Full Name",    icon: User,      type: "text",  placeholder: "e.g. John Doe" },
  { name: "email",       label: "Email",        icon: Mail,      type: "email", placeholder: "e.g. john@example.com" },
  { name: "rollNumber",  label: "Roll Number",  icon: Hash,      type: "text",  placeholder: "e.g. CS2024001" },
  { name: "course",      label: "Course",       icon: BookOpen,  type: "text",  placeholder: "e.g. B.Tech CSE" },
  { name: "department",  label: "Department",   icon: Building2, type: "text",  placeholder: "e.g. Computer Science" },
  { name: "phone",       label: "Phone",        icon: Phone,     type: "text",  placeholder: "e.g. +91 98765 43210" },
];

function EditStudent() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [original, setOriginal] = useState(null);

  const [formData, setFormData] = useState({
    name: "", email: "", rollNumber: "",
    course: "", department: "", phone: "", address: "",
  });

  useEffect(() => { fetchStudent(); }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await API.get(`/students/${id}`);
      const s   = res.data?.student || res.data || {};
      const data = {
        name: s.name || "", email: s.email || "",
        rollNumber: s.rollNumber || "", course: s.course || "",
        department: s.department || "", phone: s.phone || "",
        address: s.address || "",
      };
      setFormData(data);
      setOriginal(data);
    } catch {
      alert("Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.put(`/students/${id}`, formData);
      setSuccess(true);
      setTimeout(() => navigate("/students"), 1700);
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const changedFields = original
    ? Object.keys(formData).filter((k) => formData[k] !== original[k])
    : [];
  const hasChanges = changedFields.length > 0;
  const filledCount = Object.values(formData).filter((v) => String(v).trim()).length;
  const hue = avatarHue(formData.name || original?.name || "");

  return (
    <>
      <style>{STYLES}</style>

      <div className="es-root flex min-h-screen" style={{ background: "#070707", color: "#fff", position: "relative" }}>
        <div className="es-orb" style={{ width: 380, height: 380, background: "rgba(251,191,36,0.06)", top: "-6%", right: "8%", zIndex: 0 }} />
        <div className="es-orb" style={{ width: 260, height: 260, background: "rgba(167,139,250,0.04)", bottom: "8%", left: "14%", animationDelay: "-9s", zIndex: 0 }} />

        <Sidebar />

        <div className="es-inner flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden" style={{ position: "relative", zIndex: 1 }}>

          {/* Back */}
          <button className="es-back" onClick={() => navigate("/students")}>
            <ArrowLeft size={14} /> Back to Students
          </button>

          {/* Header */}
          <div className="es-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RefreshCw size={18} color="#fbbf24" />
                </div>
                <h1 className="es-display" style={{ fontSize: "clamp(28px,5vw,46px)", color: "#fbbf24", lineHeight: 1, margin: 0 }}>
                  Edit Student
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, paddingLeft: 2 }}>Update student details and save changes</p>
            </div>

            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                  className="es-changed-badge"
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(7,7,7,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}
              >
                <CheckCircle size={60} color="#22c55e" className="es-success-icon" />
                <h2 className="es-display" style={{ fontSize: 36, color: "#fff" }}>Student Updated!</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Redirecting to students…</p>
                <div style={{ width: 220, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.7, ease: "linear" }}
                    style={{ height: "100%", background: "linear-gradient(90deg,#fbbf24,#22c55e)" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          {loading ? (
            <div className="es-layout">
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "clamp(20px,4vw,34px)" }}>
                <div className="es-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 7, gridColumn: i === 6 ? "1 / -1" : undefined }}>
                      <div className="es-skeleton" style={{ height: 11, width: "38%", borderRadius: 6 }} />
                      <div className="es-skeleton" style={{ height: i === 6 ? 80 : 46, borderRadius: 12 }} />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1" }}><div className="es-skeleton" style={{ height: 52, borderRadius: 12 }} /></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="es-layout">

              {/* ── FORM ── */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "clamp(20px,4vw,34px)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -70, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(251,191,36,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

                {/* Progress fill bar */}
                <div style={{ display: "flex", gap: 5, marginBottom: 22 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="es-prog-seg" style={{
                      flex: 1,
                      background: i < filledCount ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.08)",
                    }} />
                  ))}
                </div>

                <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
                  <div className="es-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

                    {FIELD_META.map(({ name, label, icon: Icon, type, placeholder }) => {
                      const isDirty = original && formData[name] !== original[name];
                      return (
                        <div key={name} className="es-field">
                          <label className={`es-label${isDirty ? " dirty" : ""}`}>
                            <Icon size={11} style={{ opacity: 0.55 }} />
                            {label}
                            {isDirty && <span style={{ color: "#fbbf24", fontSize: 16, lineHeight: 0.8 }}>·</span>}
                          </label>
                          <div className="es-input-wrap">
                            <Icon size={15} className="es-input-icon" />
                            <input
                              type={type} name={name}
                              value={formData[name]} onChange={handleChange}
                              placeholder={placeholder}
                              className={`es-input${isDirty ? " dirty" : ""}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Address — full width */}
                    <div className="es-field" style={{ gridColumn: "1 / -1" }}>
                      <label className={`es-label${original && formData.address !== original.address ? " dirty" : ""}`}>
                        <MapPin size={11} style={{ opacity: 0.55 }} />
                        Address
                        {original && formData.address !== original.address && <span style={{ color: "#fbbf24", fontSize: 16, lineHeight: 0.8 }}>·</span>}
                      </label>
                      <div className="es-input-wrap">
                        <MapPin size={15} className="es-textarea-icon" />
                        <textarea
                          name="address" rows={3}
                          value={formData.address} onChange={handleChange}
                          placeholder="e.g. 123 Main Street, City, State"
                          className={`es-textarea${original && formData.address !== original.address ? " dirty" : ""}`}
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting || !hasChanges}
                    whileHover={{ scale: (submitting || !hasChanges) ? 1 : 1.012 }}
                    whileTap={{ scale: (submitting || !hasChanges) ? 1 : 0.988 }}
                    className="es-submit"
                    style={!hasChanges ? { opacity: 0.42, cursor: "not-allowed" } : {}}
                  >
                    {submitting ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        Saving <span className="ldot" /><span className="ldot" /><span className="ldot" />
                      </span>
                    ) : (
                      <><RefreshCw size={15} /> Update Student <ArrowRight size={15} /></>
                    )}
                  </motion.button>

                  {!hasChanges && !submitting && (
                    <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
                      No changes made yet
                    </p>
                  )}
                </form>
              </div>

              {/* ── SIDE PANEL ── */}
              <div className="es-side-panel" style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Live preview card */}
                <div>
                  <p className="es-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 10 }}>
                    Live Preview
                  </p>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 18, position: "relative", overflow: "hidden" }}>
                    {formData.name && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,hsl(${hue},50%,55%)40,transparent)` }} />
                    )}

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
                        <p style={{ fontSize: 11, color: formData.email ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.15)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.2s" }}>
                          {formData.email || "email@example.com"}
                        </p>
                      </div>
                    </div>

                    {[
                      { label: "Roll",  value: formData.rollNumber },
                      { label: "Dept",  value: formData.department },
                      { label: "Phone", value: formData.phone },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span className="es-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.24)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</span>
                        <span style={{ fontSize: 12, color: value ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)", transition: "color 0.2s" }}>{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Changes summary */}
                <AnimatePresence>
                  {hasChanges && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.14)", borderRadius: 14, padding: 14 }}
                    >
                      <p className="es-mono" style={{ fontSize: 9, color: "rgba(251,191,36,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                        {changedFields.length} Pending Change{changedFields.length > 1 ? "s" : ""}
                      </p>
                      {changedFields.map((key) => (
                        <div key={key} style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fbbf24", flexShrink: 0 }} />
                          <span className="es-mono" style={{ color: "#fbbf24", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.08em" }}>{key}</span>
                          <span style={{ opacity: 0.4, fontSize: 10 }}>modified</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No changes note */}
                {!hasChanges && (
                  <div style={{ padding: "11px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CheckCircle size={14} color="#4ade80" />
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.4 }}>
                      No changes yet. Edit any field to track modifications.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditStudent;
