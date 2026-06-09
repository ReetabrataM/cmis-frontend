import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, GraduationCap, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100svh;
    background: #050505;
    color: #fff;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    position: relative;
  }

  /* ─── LEFT PANEL ─── */
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(32px, 5vw, 64px);
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(251,191,36,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 90%, rgba(34,197,94,0.05) 0%, transparent 60%),
      #080808;
  }

  .login-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  .login-left::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.2) 30%, rgba(251,191,36,0.2) 70%, transparent 100%);
  }

  /* ─── RIGHT PANEL ─── */
  .login-right {
    width: 520px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(28px, 4vw, 56px) clamp(24px, 4vw, 52px);
    background: #040404;
    border-left: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
  }

  /* ─── MOBILE: stack vertically ─── */
  @media (max-width: 768px) {
    .login-root {
      flex-direction: column;
    }
    .login-left {
      flex: none;
      min-height: 220px;
      padding: 32px 24px 28px;
      border-right: none;
    }
    .login-left::after { display: none; }
    .login-left .left-feature-list { display: none; }
    .login-left .left-tagline { font-size: clamp(28px, 7vw, 42px) !important; }
    .login-right {
      width: 100%;
      flex: 1;
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 28px 20px 40px;
    }
  }

  /* ─── TYPOGRAPHY ─── */
  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-mono    { font-family: 'DM Mono', monospace; }

  /* ─── INPUT ─── */
  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    outline: none;
    transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    -webkit-appearance: none;
  }

  .login-input::placeholder { color: rgba(255,255,255,0.2); }

  .login-input:focus {
    border-color: rgba(251,191,36,0.5);
    background: rgba(251,191,36,0.04);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
  }

  .login-input-password { padding-right: 48px; }

  /* ─── SUBMIT BTN ─── */
  .login-submit {
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
    transition: box-shadow 0.25s ease, opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .login-submit:not(:disabled):hover {
    box-shadow: 0 6px 30px rgba(251,191,36,0.4);
  }

  .login-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .login-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.25s;
  }

  .login-submit:not(:disabled):hover::after { opacity: 1; }

  /* ─── TOGGLE BTN ─── */
  .pw-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.35);
    display: flex;
    align-items: center;
    padding: 4px;
    transition: color 0.2s;
  }

  .pw-toggle:hover { color: #fbbf24; }

  /* ─── FEATURE CHIP ─── */
  .feature-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    transition: border-color 0.2s, background 0.2s;
  }

  .feature-chip:hover {
    border-color: rgba(251,191,36,0.2);
    background: rgba(251,191,36,0.04);
    color: rgba(255,255,255,0.75);
  }

  /* ─── DEMO BOX ─── */
  .demo-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* ─── SCROLLBAR ─── */
  .login-right::-webkit-scrollbar { width: 0; }

  /* ─── ANIMATED ORB ─── */
  @keyframes orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 15px) scale(0.97); }
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: orb-drift 12s ease-in-out infinite;
  }

  /* ─── LOADER DOTS ─── */
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-5px); }
  }

  .dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #000; margin: 0 2px; }
  .dot:nth-child(1) { animation: dot-bounce 1s 0.0s infinite; }
  .dot:nth-child(2) { animation: dot-bounce 1s 0.15s infinite; }
  .dot:nth-child(3) { animation: dot-bounce 1s 0.3s infinite; }
`;

const features = [
  { emoji: "🎓", label: "Student lifecycle management" },
  { emoji: "📊", label: "Real-time attendance tracking" },
  { emoji: "💰", label: "Fee & finance automation" },
  { emoji: "📝", label: "Marks & grade analytics" },
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="login-root">

        {/* ─── LEFT PANEL ─── */}
        <div className="login-left">
          {/* Animated orbs */}
          <div className="orb" style={{ width: 400, height: 400, background: "rgba(251,191,36,0.07)", top: "-100px", left: "-100px" }} />
          <div className="orb" style={{ width: 300, height: 300, background: "rgba(34,197,94,0.05)", bottom: "-80px", right: "40px", animationDelay: "-6s" }} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, #fbbf24, #92400e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(251,191,36,0.3)",
                flexShrink: 0,
              }}>
                <GraduationCap size={22} color="#000" strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="font-display" style={{ fontSize: 28, color: "#fbbf24", letterSpacing: "0.06em", lineHeight: 1 }}>
                  CMIS
                </h1>
                <p className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 3 }}>
                  University ERP
                </p>
              </div>
            </div>
          </motion.div>

          {/* Central tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 0" }}
          >
            <p className="font-mono" style={{ fontSize: 11, color: "rgba(251,191,36,0.6)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>
              Campus Management Intelligence Suite
            </p>

            <h2 className="font-display left-tagline" style={{ fontSize: "clamp(38px, 4.5vw, 62px)", lineHeight: 1.1, color: "#fff", fontWeight: 600, maxWidth: 480 }}>
              Where academia
              <br />
              <em style={{ color: "#fbbf24", fontStyle: "italic" }}>meets precision.</em>
            </h2>

            <p style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.35)", maxWidth: 380, lineHeight: 1.7 }}>
              A unified platform for managing students, courses, attendance, marks and finance — built for modern universities.
            </p>

            {/* Feature chips */}
            <div className="left-feature-list" style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 440 }}>
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="feature-chip"
                >
                  <span style={{ fontSize: 16 }}>{f.emoji}</span>
                  {f.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.18)",
              borderRadius: 99,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span className="font-mono" style={{ fontSize: 10, color: "rgba(34,197,94,0.8)", letterSpacing: "0.15em" }}>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="login-right">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{ width: "100%", maxWidth: 420 }}
          >
            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 600, lineHeight: 1.1, color: "#fff" }}>
                Welcome back
              </h2>
              <p style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                Sign in to your administrator account to continue.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(251,191,36,0.25), transparent)", marginBottom: 28 }} />

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  style={{
                    marginBottom: 20,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "#f87171",
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Email */}
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@cmis.com"
                  required
                  className="login-input"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="login-input login-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pw-toggle"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: loading ? 1 : 0.985 }}
                disabled={loading}
                className="login-submit"
                style={{ marginTop: 4 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Authenticating
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register link */}
            <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#fbbf24", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fde68a"}
                onMouseLeave={e => e.target.style.color = "#fbbf24"}
              >
                Register here
              </Link>
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

            {/* Demo credentials */}
            <div>
              <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", textAlign: "center", marginBottom: 12 }}>
                Demo Credentials
              </p>
              <div className="demo-box">
                {[["Email", "admin@cmis.com"], ["Password", "123456"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{k}</span>
                    <span className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}

export default Login;
