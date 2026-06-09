import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area,
} from "recharts";
import {
  Users, GraduationCap, ClipboardCheck, TrendingUp,
  Activity, Database, Shield, HardDrive,
  ArrowUpRight, Menu,
} from "lucide-react";

/* ─── DATA (unchanged) ──────────────────────── */
const semData = [
  { name: "Sem 1", students: 120 },
  { name: "Sem 2", students: 98 },
  { name: "Sem 3", students: 140 },
  { name: "Sem 4", students: 170 },
];

const trendData = [
  { month: "Jan", value: 60 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 65 },
  { month: "Apr", value: 88 },
  { month: "May", value: 95 },
  { month: "Jun", value: 92 },
];

const BAR_COLORS = ["#d97706", "#b45309", "#f59e0b", "#fbbf24"];

const stats = [
  { title: "Total Students", value: "2,840", icon: Users,         delta: "+12% this semester", accent: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.18)" },
  { title: "Faculty Members", value: "124",   icon: GraduationCap, delta: "+3 new this month",  accent: "#a78bfa", bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.16)" },
  { title: "Attendance",      value: "92%",   icon: ClipboardCheck,delta: "↑ 4% from last term", accent: "#34d399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.16)" },
  { title: "Pass Rate",       value: "98%",   icon: TrendingUp,    delta: "Highest in 5 years", accent: "#60a5fa", bg: "rgba(96,165,250,0.07)",  border: "rgba(96,165,250,0.16)" },
];

const insights = [
  { label: "New Admissions", value: "48",  pct: 78,  color: "#f59e0b" },
  { label: "Active Courses", value: "32",  pct: 64,  color: "#a78bfa" },
  { label: "Fees Collected", value: "89%", pct: 89,  color: "#34d399" },
];

const sysStatus = [
  { label: "API Services",  status: "Operational", ok: true,  icon: Activity },
  { label: "Database",      status: "Healthy",     ok: true,  icon: Database },
  { label: "Auth Server",   status: "Operational", ok: true,  icon: Shield },
  { label: "Backup",        status: "Running",     ok: true,  icon: HardDrive },
];

/* ─── STYLES ────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .db-root * { box-sizing: border-box; }
  .db-root { font-family: 'DM Sans', sans-serif; }
  .db-display { font-family: 'Cormorant Garamond', serif; }
  .db-mono    { font-family: 'DM Mono', monospace; }

  /* ── STAT CARD ── */
  .db-stat {
    border-radius: 18px;
    padding: 20px 22px;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .db-stat:hover { transform: translateY(-3px); }

  /* ── PANEL (chart / insights / status) ── */
  .db-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 22px 24px;
    backdrop-filter: blur(20px);
  }

  /* ── PROGRESS BAR ── */
  .db-bar-bg {
    height: 5px;
    background: rgba(255,255,255,0.07);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 8px;
  }

  .db-bar-fill {
    height: 100%;
    border-radius: 99px;
    width: 0;
    transition: width 1.2s cubic-bezier(0.4,0,0.2,1) 0.8s;
  }

  .db-bar-fill.loaded { width: var(--pct); }

  /* ── STATUS DOT ── */
  .db-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @keyframes db-pulse {
    0%,100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
    50%      { opacity: 0.7; box-shadow: 0 0 0 3px transparent; }
  }

  .db-dot.ok {
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.7);
    animation: db-pulse 2s infinite;
  }

  /* ── CARD FADE-IN ── */
  @keyframes db-in {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .db-anim { animation: db-in 0.5s ease forwards; opacity: 0; }

  /* ── ORB ── */
  @keyframes db-orb {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(30px,-20px) scale(1.06); }
  }

  .db-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    animation: db-orb 18s ease-in-out infinite;
  }

  /* ── LIVE BADGE ── */
  .db-live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border-radius: 99px;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.2);
    font-size: 11px;
    color: #4ade80;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .db-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: db-pulse 1.5s infinite;
  }

  /* ── LAYOUT ── */
  .db-chart-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
    align-items: start;
  }

  .db-right-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── MOBILE ── */
  @media (max-width: 900px) {
    .db-chart-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 640px) {
    .db-stat-grid {
      grid-template-columns: 1fr 1fr !important;
    }
    .db-header-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 10px !important;
    }
  }

  @media (max-width: 400px) {
    .db-stat-grid {
      grid-template-columns: 1fr !important;
    }
  }

  /* ── SCROLLBAR ── */
  .db-scroll::-webkit-scrollbar { width: 0; }

  /* ── HOVER CARD ── */
  .db-stat-action {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s, transform 0.2s;
  }

  .db-stat:hover .db-stat-action {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* ─── CUSTOM TOOLTIP ─────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(8,8,8,0.95)",
      border: "1px solid rgba(245,158,11,0.3)",
      borderRadius: 10, padding: "10px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>
      <p style={{ color: "#f59e0b", fontFamily: "'Cormorant Garamond',serif", fontSize: 15, margin: 0 }}>{label}</p>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "4px 0 0", fontFamily: "'DM Mono',monospace" }}>
        {payload[0].value} students
      </p>
    </div>
  );
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(8,8,8,0.95)",
      border: "1px solid rgba(52,211,153,0.3)",
      borderRadius: 10, padding: "10px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>
      <p style={{ color: "#34d399", fontSize: 13, margin: 0, fontFamily: "'DM Mono',monospace" }}>{label}</p>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "4px 0 0", fontFamily: "'DM Mono',monospace" }}>
        {payload[0].value}%
      </p>
    </div>
  );
}

/* ─── STAT CARD ─────────────────────────────── */
function StatCard({ title, value, icon: Icon, delta, accent, bg, border, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="db-stat"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.45s ease ${index * 0.08}s, transform 0.45s ease ${index * 0.08}s, box-shadow 0.2s, border-color 0.2s`,
        background: bg,
        border: `1px solid ${border}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${accent}20`; e.currentTarget.style.borderColor = `${accent}40`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = border; }}
    >
      {/* Corner orb */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 100, height: 100, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative" }}>
        <p className="db-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.22em", margin: 0 }}>
          {title}
        </p>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `${accent}14`,
          border: `1px solid ${accent}22`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={15} color={accent} />
        </div>
      </div>

      <h2 className="db-display" style={{
        color: accent, fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 700,
        lineHeight: 1, margin: "0 0 8px",
        textShadow: `0 0 24px ${accent}40`,
      }}>
        {value}
      </h2>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, letterSpacing: "0.04em" }}>
          {delta}
        </p>
        <div className="db-stat-action" style={{ color: accent }}>
          <ArrowUpRight size={12} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: "1.5rem", right: "1.5rem",
        height: 2, borderRadius: 1,
        background: `linear-gradient(90deg, transparent, ${accent}50, transparent)`,
      }} />
    </div>
  );
}

/* ─── DASHBOARD ─────────────────────────────── */
function AdminDashboard() {
  const [ready, setReady] = useState(false);
  const [barsLoaded, setBarsLoaded] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    setReady(true);
    const t = setTimeout(() => setBarsLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{STYLES}</style>

      <div className="db-root db-scroll" style={{ minHeight: "100vh", background: "#060606", color: "#fff", display: "flex" }}>

        {/* Background orbs */}
        <div className="db-orb" style={{ width: 500, height: 500, background: "rgba(245,158,11,0.055)", top: "-10%", right: "5%", zIndex: 0 }} />
        <div className="db-orb" style={{ width: 380, height: 380, background: "rgba(167,139,250,0.04)", bottom: "5%", left: "15%", animationDelay: "-9s", zIndex: 0 }} />

        <Sidebar />

        <div className="db-scroll flex-1" style={{
          padding: "clamp(20px,4vw,48px)",
          position: "relative", zIndex: 1,
          overflowY: "auto", overflowX: "hidden",
        }}>

          {/* ── HEADER ── */}
          <div
            className="db-header-row"
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              marginBottom: 28, gap: 14,
              opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(-12px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            <div>
              <p className="db-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6 }}>
                {greeting}
              </p>
              <h1 className="db-display" style={{
                fontSize: "clamp(32px,6vw,58px)", color: "#f59e0b",
                fontWeight: 700, lineHeight: 1,
                textShadow: "0 0 50px rgba(245,158,11,0.25)",
                margin: 0,
              }}>
                Dashboard
              </h1>
              <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 13, marginTop: 6, letterSpacing: "0.06em" }}>
                Academic Intelligence Platform · CMIS
              </p>
            </div>

            <div className="db-live">
              <span className="db-live-dot" />
              Live
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div
            className="db-stat-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}
          >
            {stats.map((s, i) => <StatCard key={s.title} {...s} index={i} />)}
          </div>

          {/* ── CHART + SIDE PANELS ── */}
          <div className="db-chart-grid">

            {/* LEFT: enrollment chart + trend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Enrollment bar chart */}
              <div
                className="db-panel db-anim"
                style={{ animationDelay: "0.35s" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 className="db-display" style={{ color: "#f59e0b", fontSize: 22, margin: 0 }}>
                      Student Analytics
                    </h2>
                    <p className="db-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 4 }}>
                      Enrollment by semester
                    </p>
                  </div>
                  <span style={{
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.22)",
                    color: "#f59e0b", fontSize: 10, padding: "3px 10px", borderRadius: 99,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    Current Year
                  </span>
                </div>

                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={semData} barCategoryGap="32%">
                      <XAxis dataKey="name" axisLine={false} tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }} />
                      <YAxis axisLine={false} tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.22)", fontSize: 11 }} width={30} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
                      <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                        {semData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]} opacity={0.88} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attendance trend area chart */}
              <div className="db-panel db-anim" style={{ animationDelay: "0.48s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h2 className="db-display" style={{ color: "#34d399", fontSize: 20, margin: 0 }}>
                      Attendance Trend
                    </h2>
                    <p className="db-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 4 }}>
                      Monthly average %
                    </p>
                  </div>
                  <span style={{
                    background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
                    color: "#34d399", fontSize: 10, padding: "3px 10px", borderRadius: 99,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em",
                  }}>
                    6 months
                  </span>
                </div>

                <div style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }} />
                      <YAxis axisLine={false} tickLine={false} domain={[50, 100]}
                        tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} width={28} />
                      <Tooltip content={<TrendTooltip />} cursor={{ stroke: "rgba(52,211,153,0.25)", strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2}
                        fill="url(#trendGrad)" dot={false} activeDot={{ r: 4, fill: "#34d399", stroke: "#060606", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="db-right-col">

              {/* Quick Insights */}
              <div className="db-panel db-anim" style={{ animationDelay: "0.5s" }}>
                <h3 className="db-display" style={{ color: "#f59e0b", fontSize: 18, margin: "0 0 18px" }}>
                  Quick Insights
                </h3>
                {insights.map((item) => (
                  <div key={item.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{item.label}</span>
                      <span className="db-mono" style={{ fontSize: 13, color: item.color, fontWeight: 600 }}>{item.value}</span>
                    </div>
                    <div className="db-bar-bg">
                      <div
                        className={`db-bar-fill${barsLoaded ? " loaded" : ""}`}
                        style={{ "--pct": `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}99, ${item.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="db-panel db-anim" style={{ animationDelay: "0.62s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 className="db-display" style={{ color: "#f59e0b", fontSize: 18, margin: 0 }}>
                    System Status
                  </h3>
                  <span style={{
                    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
                    color: "#4ade80", fontSize: 9, padding: "3px 9px", borderRadius: 99,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.15em", textTransform: "uppercase",
                  }}>
                    All clear
                  </span>
                </div>

                {sysStatus.map(({ label, status, ok, icon: SIcon }, i) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 0",
                    borderBottom: i < sysStatus.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <SIcon size={13} color="rgba(255,255,255,0.3)" />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className={`db-dot ${ok ? "ok" : ""}`} />
                      <span className="db-mono" style={{
                        fontSize: 10, color: ok ? "#4ade80" : "#f87171",
                        background: ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                        border: `1px solid ${ok ? "rgba(74,222,128,0.18)" : "rgba(248,113,113,0.18)"}`,
                        padding: "1px 7px", borderRadius: 99,
                      }}>
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini activity summary */}
              <div className="db-panel db-anim" style={{ animationDelay: "0.72s", background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" }}>
                <p className="db-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: 12 }}>
                  Recent Activity
                </p>
                {[
                  { text: "New student enrolled", time: "2m ago",  dot: "#f59e0b" },
                  { text: "Attendance marked",    time: "18m ago", dot: "#34d399" },
                  { text: "Fee payment received", time: "1h ago",  dot: "#a78bfa" },
                  { text: "Course schedule updated", time: "3h ago", dot: "#60a5fa" },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "7px 0",
                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", flex: 1 }}>{a.text}</span>
                    <span className="db-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
