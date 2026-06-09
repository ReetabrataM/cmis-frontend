import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, GraduationCap, ArrowRight, CheckCircle, User, Mail, Lock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100svh;
    background: #050505;
    color: #fff;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    position: relative;
  }

  /* ── LEFT BRANDING PANEL ── */
  .reg-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(32px, 5vw, 64px);
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse 70% 50% at 80% 20%, rgba(251,191,36,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 70% at 10% 90%, rgba(34,197,94,0.05) 0%, transparent 60%),
      #070707;
  }

  /* Diagonal stripe pattern */
  .reg-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      rgba(251,191,36,0.025) 0px,
      rgba(251,191,36,0.025) 1px,
      transparent 1px,
      transparent 40px
    );
    pointer-events: none;
  }

  /* Right edge glow line */
  .reg-left::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.18) 30%, rgba(251,191,36,0.18) 70%, transparent 100%);
  }

  /* ── RIGHT FORM PANEL ── */
  .reg-right {
    width: 540px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(28px, 4vw, 56px) clamp(24px, 4vw, 52px);
    background: #040404;
    border-left: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
  }

  .reg-right::-webkit-scrollbar { width: 0; }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .reg-root { flex-direction: column; }
    .reg-left {
      flex: none;
      min-height: 200px;
      padding: 28px 20px 24px;
    }
    .reg-left::after { display: none; }
    .reg-left .left-steps { display: none !important; }
    .reg-right {
      width: 100%;
      flex: 1;
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 28px 20px 44px;
      align-items: flex-start;
    }
  }

  /* ── TYPOGRAPHY ── */
  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-mono    { font-family: 'DM Mono', monospace; }

  /* ── INPUTS ── */
  .reg-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 12px 14px 12px 42px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    outline: none;
    transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    -webkit-appearance: none;
  }

  .reg-input::placeholder { color: rgba(255,255,255,0.18); }

  .reg-input:focus {
    border-color: rgba(251,191,36,0.5);
    background: rgba(251,191,36,0.04);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }

  .reg-input.has-error {
    border-color: rgba(239,68,68,0.45);
    background: rgba(239,68,68,0.04);
  }

  .reg-input-pw { padding-right: 46px; }

  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.28);
    pointer-events: none;
    transition: color 0.2s;
  }

  .input-wrap:focus-within .input-icon {
    color: rgba(251,191,36,0.6);
  }

  /* ── SUBMIT BUTTON ── */
  .reg-submit {
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
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.25s ease, transform 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .reg-submit:not(:disabled):hover {
    box-shadow: 0 6px 30px rgba(251,191,36,0.38);
  }

  .reg-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .reg-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .reg-submit:not(:disabled):hover::after { opacity: 1; }

  /* ── PW TOGGLE ── */
  .pw-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    padding: 4px;
    transition: color 0.2s;
  }

  .pw-toggle:hover { color: #fbbf24; }

  /* ── STEP ITEMS ── */
  .step-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .step-item:last-child { border-bottom: none; }

  .step-num {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(251,191,36,0.1);
    border: 1px solid rgba(251,191,36,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #fbbf24;
  }

  /* ── PROGRESS DOTS ── */
  .progress-dots {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
  }

  .pdot {
    height: 3px;
    border-radius: 99px;
    background: rgba(255,255,255,0.12);
    transition: background 0.3s, width 0.3s;
  }

  /* ── LOADER DOTS ── */
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-5px); }
  }

  .ldot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #000; margin: 0 2px; }
  .ldot:nth-child(1) { animation: dot-bounce 1s 0.0s infinite; }
  .ldot:nth-child(2) { animation: dot-bounce 1s 0.15s infinite; }
  .ldot:nth-child(3) { animation: dot-bounce 1s 0.3s infinite; }

  /* ── SUCCESS ── */
  @keyframes success-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  .success-icon { animation: success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* ── ORB ── */
  @keyframes orb-drift {
    0%, 100% { transform: translate(0,0) scale(1); }
    33%       { transform: translate(-25px, 20px) scale(1.04); }
    66%       { transform: translate(20px, -15px) scale(0.97); }
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: orb-drift 14s ease-in-out infinite;
  }

  /* ── PASSWORD STRENGTH ── */
  .strength-bar {
    height: 3px;
    border-radius: 99px;
    transition: width 0.4s ease, background 0.4s ease;
  }
`;

const steps = [
  { num: "01", title: "Fill your details", desc: "Name, email, and a strong password" },
  { num: "02", title: "Create your account", desc: "Instant activation — no email verify needed" },
  { num: "03", title: "Access the platform", desc: "Full ERP dashboard at your fingertips" },
];

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 3) return { score, label: "Fair", color: "#f59e0b" };
  return { score, label: "Strong", color: "#22c55e" };
}

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Minimum 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await API.post("/auth/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      setErrors({ api: error.response?.data?.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const filledCount = [formData.name, formData.email, formData.password].filter(Boolean).length;

  return (
    <>
      <style>{STYLES}</style>

      <div className="reg-root">

        {/* ── LEFT PANEL ── */}
        <div className="reg-left">
          <div className="orb" style={{ width: 360, height: 360, background: "rgba(251,191,36,0.07)", top: "-80px", right: "-60px" }} />
          <div className="orb" style={{ width: 280, height: 280, background: "rgba(34,197,94,0.05)", bottom: "-60px", left: "20px", animationDelay: "-7s" }} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, #fbbf24, #92400e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(251,191,36,0.28)",
                flexShrink: 0,
              }}>
                <GraduationCap size={22} color="#000" strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="font-display" style={{ fontSize: 28, color: "#fbbf24", letterSpacing: "0.06em", lineHeight: 1 }}>CMIS</h1>
                <p className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 3 }}>University ERP</p>
              </div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 0" }}
          >
            <p className="font-mono" style={{ fontSize: 10, color: "rgba(251,191,36,0.55)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>
              Getting started
            </p>

            <h2 className="font-display" style={{ fontSize: "clamp(36px, 4vw, 58px)", lineHeight: 1.1, color: "#fff", fontWeight: 600, maxWidth: 440 }}>
              Join the platform
              <br />
              <em style={{ color: "#fbbf24", fontStyle: "italic" }}>built for excellence.</em>
            </h2>

            <p style={{ marginTop: 18, fontSize: 14, color: "rgba(255,255,255,0.35)", maxWidth: 360, lineHeight: 1.75 }}>
              Set up your administrator account in seconds and gain full access to the CMIS ecosystem.
            </p>

            {/* Steps */}
            <div className="left-steps" style={{ marginTop: 36, maxWidth: 400 }}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="step-item"
                >
                  <div className="step-num">{step.num}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 2 }}>{step.title}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", lineHeight: 1.5 }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Already have account */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
              Already registered?{" "}
              <Link to="/login" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = "#fde68a"}
                onMouseLeave={e => e.target.style.color = "#fbbf24"}
              >
                Sign in instead →
              </Link>
            </p>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-right">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ width: "100%", maxWidth: 420 }}
          >

            {/* Success state */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                  }}
                >
                  <CheckCircle size={56} color="#22c55e" className="success-icon" />
                  <h3 className="font-display" style={{ fontSize: 32, color: "#fff" }}>Account Created!</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Redirecting you to login…</p>
                  <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.8, ease: "linear" }}
                      style={{ height: "100%", background: "linear-gradient(90deg, #fbbf24, #22c55e)" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!success && (
              <>
                {/* Heading */}
                <div style={{ marginBottom: 28 }}>
                  <h2 className="font-display" style={{ fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.1, color: "#fff" }}>
                    Create account
                  </h2>
                  <p style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.36)", lineHeight: 1.6 }}>
                    Set up your CMIS administrator profile.
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="progress-dots" style={{ marginBottom: 24 }}>
                  {["Name", "Email", "Password"].map((label, i) => (
                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                      <div className="pdot" style={{
                        width: "100%",
                        background: i < filledCount ? "rgba(251,191,36,0.7)" : "rgba(255,255,255,0.1)",
                      }} />
                      <span className="font-mono" style={{ fontSize: 9, color: i < filledCount ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* API error */}
                <AnimatePresence>
                  {errors.api && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        marginBottom: 16,
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 10,
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "#f87171",
                      }}
                    >
                      {errors.api}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Name */}
                  <div>
                    <label className="font-mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 7 }}>
                      Full Name
                    </label>
                    <div className="input-wrap">
                      <User size={15} className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="John Doe"
                        onChange={handleChange}
                        className={`reg-input ${errors.name ? "has-error" : ""}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="font-mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 7 }}>
                      Email Address
                    </label>
                    <div className="input-wrap">
                      <Mail size={15} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="john@example.com"
                        onChange={handleChange}
                        className={`reg-input ${errors.email ? "has-error" : ""}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="font-mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 7 }}>
                      Password
                    </label>
                    <div className="input-wrap">
                      <Lock size={15} className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="••••••••"
                        onChange={handleChange}
                        className={`reg-input reg-input-pw ${errors.password ? "has-error" : ""}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="pw-toggle">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {formData.password && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{
                              flex: 1, height: 3, borderRadius: 99,
                              background: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)",
                              transition: "background 0.3s",
                            }} />
                          ))}
                        </div>
                        <p className="font-mono" style={{ fontSize: 10, color: strength.color, letterSpacing: "0.1em" }}>
                          {strength.label} password
                        </p>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ fontSize: 12, color: "#f87171", marginTop: 5 }}>
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Role badge — kept as-is (hardcoded admin) */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                    background: "rgba(251,191,36,0.06)",
                    border: "1px solid rgba(251,191,36,0.14)",
                    borderRadius: 10,
                  }}>
                    <Shield size={14} color="rgba(251,191,36,0.7)" />
                    <span className="font-mono" style={{ fontSize: 11, color: "rgba(251,191,36,0.7)", letterSpacing: "0.1em" }}>
                      ROLE: ADMINISTRATOR
                    </span>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    disabled={loading}
                    className="reg-submit"
                    style={{ marginTop: 4 }}
                  >
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        Creating account
                        <span className="ldot" /><span className="ldot" /><span className="ldot" />
                      </span>
                    ) : (
                      <>Register <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </form>

                {/* Footer */}
                <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: 500 }}
                    onMouseEnter={e => e.target.style.color = "#fde68a"}
                    onMouseLeave={e => e.target.style.color = "#fbbf24"}
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Register;
