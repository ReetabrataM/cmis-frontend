import { useEffect, useState } from "react";
import {
  Wallet, TrendingUp, AlertTriangle, CheckCircle,
  Plus, Pencil, Trash2, Search, X, ChevronDown,
  IndianRupee, Calendar, User,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

/* ─── STYLES ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .fp-root * { box-sizing: border-box; }
  .fp-root { font-family: 'DM Sans', sans-serif; }
  .fp-display { font-family: 'Cormorant Garamond', serif; }
  .fp-mono    { font-family: 'DM Mono', monospace; }

  /* ── STAT CARD ── */
  .fp-stat {
    border-radius: 18px;
    padding: 20px 22px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .fp-stat:hover { transform: translateY(-2px); }

  /* ── ADD BUTTON ── */
  .fp-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 20px; border-radius: 12px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    border: none; cursor: pointer; white-space: nowrap;
    transition: box-shadow 0.2s, transform 0.15s;
    position: relative; overflow: hidden; flex-shrink: 0;
  }
  .fp-add-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .fp-add-btn:hover { box-shadow: 0 6px 24px rgba(251,191,36,0.38); transform: translateY(-1px); }
  .fp-add-btn:hover::after { opacity: 1; }

  /* ── SEARCH ── */
  .fp-search-wrap { position: relative; flex: 1; min-width: 0; }
  .fp-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.28); pointer-events: none; transition: color 0.2s;
  }
  .fp-search-wrap:focus-within .fp-search-icon { color: rgba(251,191,36,0.6); }
  .fp-search {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 11px 16px 11px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none;
  }
  .fp-search::placeholder { color: rgba(255,255,255,0.2); }
  .fp-search:focus {
    border-color: rgba(251,191,36,0.45);
    background: rgba(251,191,36,0.03);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  /* ── SELECT ── */
  .fp-select {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 11px 36px 11px 14px;
    font-size: 13px; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.7);
    outline: none; cursor: pointer; flex-shrink: 0;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .fp-select:focus {
    border-color: rgba(251,191,36,0.4);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  /* ── STATUS PILL ── */
  .fp-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px;
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    letter-spacing: 0.06em; white-space: nowrap;
  }

  /* ── PROGRESS BAR ── */
  .fp-prog-bg {
    height: 4px; background: rgba(255,255,255,0.07);
    border-radius: 99px; overflow: hidden; margin-top: 6px;
  }
  .fp-prog-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── TABLE ── */
  .fp-table-wrap {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }

  .fp-tr { transition: background 0.15s; }
  .fp-tr:hover { background: rgba(255,255,255,0.04); }

  /* ── ACTION BTNS ── */
  .fp-edit-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px;
    background: rgba(96,165,250,0.09); border: 1px solid rgba(96,165,250,0.18);
    color: #7dd3fc; font-size: 12px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .fp-edit-btn:hover { background: rgba(96,165,250,0.17); transform: translateY(-1px); }

  .fp-del-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px;
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.16);
    color: #fca5a5; font-size: 12px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .fp-del-btn:hover { background: rgba(239,68,68,0.15); transform: translateY(-1px); }

  /* ── MODAL ── */
  .fp-modal-card {
    background: #0d0d0d;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px; padding: 28px;
    width: 100%; max-width: 480px;
    position: relative; overflow: hidden;
    max-height: 90vh; overflow-y: auto;
  }
  .fp-modal-card::-webkit-scrollbar { width: 0; }

  .fp-modal-input {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; padding: 12px 14px 12px 40px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff;
    outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none;
  }
  .fp-modal-input::placeholder { color: rgba(255,255,255,0.2); }
  .fp-modal-input:focus {
    border-color: rgba(251,191,36,0.45);
    background: rgba(251,191,36,0.03);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  .fp-modal-select {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; padding: 12px 36px 12px 40px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.7);
    outline: none; cursor: pointer;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .fp-modal-select:focus {
    border-color: rgba(251,191,36,0.45);
    box-shadow: 0 0 0 3px rgba(251,191,36,0.07);
  }

  .fp-modal-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.25); pointer-events: none; transition: color 0.2s;
  }

  .fp-modal-field:focus-within .fp-modal-input-icon { color: rgba(251,191,36,0.55); }

  .fp-submit-btn {
    flex: 1; padding: 13px;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 700; cursor: pointer;
    transition: box-shadow 0.2s, transform 0.15s;
  }
  .fp-submit-btn:hover { box-shadow: 0 4px 20px rgba(251,191,36,0.35); transform: translateY(-1px); }

  .fp-cancel-btn {
    flex: 1; padding: 13px;
    border-radius: 11px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55);
    font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .fp-cancel-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

  /* ── MOBILE CARD VIEW ── */
  .fp-desktop-table { display: block; }
  .fp-mobile-cards  { display: none; }

  @media (max-width: 768px) {
    .fp-desktop-table { display: none; }
    .fp-mobile-cards  { display: flex; flex-direction: column; gap: 10px; padding: 14px; }
    .fp-header-row    { flex-direction: column !important; align-items: flex-start !important; }
    .fp-add-btn       { width: 100%; justify-content: center; }
    .fp-filter-row    { flex-direction: column !important; }
    .fp-stat-grid     { grid-template-columns: 1fr 1fr !important; }
  }

  @media (max-width: 480px) {
    .fp-stat-grid { grid-template-columns: 1fr !important; }
  }

  /* ── MOBILE FEE CARD ── */
  .fp-fee-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 14px 16px;
    transition: border-color 0.2s, background 0.2s;
  }
  .fp-fee-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(251,191,36,0.15);
  }

  /* ── EMPTY STATE ── */
  .fp-empty {
    padding: 60px 20px; text-align: center;
    color: rgba(255,255,255,0.2);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }

  /* ── ORB ── */
  @keyframes fp-orb {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-20px,15px) scale(1.04); }
  }
  .fp-orb {
    position: fixed; border-radius: 50%; filter: blur(90px);
    pointer-events: none; animation: fp-orb 16s ease-in-out infinite; z-index: 0;
  }

  /* ── LOADER DOTS ── */
  @keyframes ldot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
  .ldot { display:inline-block; width:4px; height:4px; border-radius:50%; background:#000; margin:0 2px; }
  .ldot:nth-child(1){animation:ldot 1s 0.0s infinite}
  .ldot:nth-child(2){animation:ldot 1s 0.15s infinite}
  .ldot:nth-child(3){animation:ldot 1s 0.3s infinite}
`;

/* ─── HELPERS ─────────────────────────────────── */
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN");

const pctPaid = (fee) => {
  const total = Number(fee.totalFees || 0);
  const paid  = Number(fee.paidAmount || 0);
  return total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
};

const feeStatus = (fee) => {
  const pct     = pctPaid(fee);
  const overdue = fee.dueDate && new Date(fee.dueDate) < new Date() && pct < 100;
  if (pct >= 100)  return { label: "Paid",    color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.2)" };
  if (overdue)     return { label: "Overdue",  color: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)"  };
  if (pct > 0)     return { label: "Partial",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)" };
  return            { label: "Unpaid",  color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.14)" };
};

/* ─── COMPONENT ────────────────────────────────── */
function FeesPage() {
  const [fees, setFees]               = useState([]);
  const [students, setStudents]       = useState([]);
  const [search, setSearch]           = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee]   = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  const [form, setForm] = useState({
    student: "", totalFees: "", paidAmount: "", dueDate: "",
  });

  useEffect(() => { fetchFees(); fetchStudents(); }, []);

  const fetchFees = async () => {
    try {
      const res = await API.get("/fees");
      const arr = res?.data?.data || res?.data || [];
      setFees(Array.isArray(arr) ? arr : []);
    } catch { setFees([]); }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      const arr = res?.data?.students || res?.data?.data || res?.data || [];
      setStudents(Array.isArray(arr) ? arr : []);
    } catch { setStudents([]); }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        student: form.student,
        totalFees: Number(form.totalFees),
        paidAmount: Number(form.paidAmount),
        dueDate: form.dueDate,
      };
      if (editingFee) {
        await API.put(`/fees/${editingFee._id}`, payload);
      } else {
        await API.post("/fees", payload);
      }
      setIsModalOpen(false);
      setEditingFee(null);
      setForm({ student: "", totalFees: "", paidAmount: "", dueDate: "" });
      fetchFees();
    } catch (err) {
      alert("Operation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteFee = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    try {
      await API.delete(`/fees/${id}`);
      fetchFees();
    } catch { alert("Delete failed"); }
  };

  const openEdit = (fee) => {
    setEditingFee(fee);
    setForm({
      student: fee.student?._id || "",
      totalFees: fee.totalFees || "",
      paidAmount: fee.paidAmount || "",
      dueDate: fee.dueDate?.split("T")[0] || "",
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingFee(null);
    setForm({ student: "", totalFees: "", paidAmount: "", dueDate: "" });
    setIsModalOpen(true);
  };

  const filteredFees = (fees || []).filter((fee) => {
    const roll = fee?.student?.rollNumber?.toLowerCase() || "";
    const dept = (fee?.department || "").toLowerCase();
    const matches = roll.includes(search.toLowerCase()) || dept.includes(search.toLowerCase());
    const matchesDept = selectedDept === "All" || fee.department === selectedDept;
    return matches && matchesDept;
  });

  const totalCollection  = fees.reduce((a, f) => a + Number(f?.paidAmount || 0), 0);
  const totalPending     = fees.reduce((a, f) => a + (Number(f?.totalFees || 0) - Number(f?.paidAmount || 0)), 0);
  const paidStudents     = fees.filter((f) => Number(f.paidAmount) >= Number(f.totalFees)).length;
  const overdueStudents  = fees.filter((f) => f?.dueDate && new Date(f.dueDate) < new Date() && Number(f.paidAmount) < Number(f.totalFees)).length;
  const uniqueDepts      = ["All", ...new Set(fees.map((f) => f.department).filter(Boolean))];

  const statCards = [
    { title: "Total Collected",  value: `₹${fmt(totalCollection)}`, icon: Wallet,        accent: "#fbbf24", bg: "rgba(251,191,36,0.07)",  border: "rgba(251,191,36,0.16)" },
    { title: "Pending Fees",     value: `₹${fmt(totalPending)}`,    icon: TrendingUp,    accent: "#34d399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.16)" },
    { title: "Fully Paid",       value: paidStudents,                icon: CheckCircle,   accent: "#4ade80", bg: "rgba(74,222,128,0.07)",  border: "rgba(74,222,128,0.16)" },
    { title: "Overdue",          value: overdueStudents,             icon: AlertTriangle, accent: "#f87171", bg: "rgba(239,68,68,0.07)",   border: "rgba(239,68,68,0.16)"  },
  ];

  const TH = ({ children, center }) => (
    <th style={{
      padding: "12px 16px", textAlign: center ? "center" : "left",
      fontSize: 9, fontFamily: "'DM Mono',monospace",
      textTransform: "uppercase", letterSpacing: "0.2em",
      color: "rgba(255,255,255,0.28)", fontWeight: 500,
      background: "rgba(255,255,255,0.02)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      {children}
    </th>
  );

  return (
    <>
      <style>{STYLES}</style>

      <div className="fp-root flex min-h-screen" style={{ background: "#070707", color: "#fff", position: "relative" }}>
        {/* bg orbs */}
        <div className="fp-orb" style={{ width: 440, height: 440, background: "rgba(251,191,36,0.05)", top: "-8%", right: "10%" }} />
        <div className="fp-orb" style={{ width: 320, height: 320, background: "rgba(52,211,153,0.04)", bottom: "5%", left: "18%", animationDelay: "-8s" }} />

        <Sidebar />

        <div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden" style={{ position: "relative", zIndex: 1 }}>

          {/* ── HEADER ── */}
          <div className="fp-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Wallet size={18} color="#fbbf24" />
                </div>
                <h1 className="fp-display" style={{ fontSize: "clamp(26px,5vw,44px)", color: "#fbbf24", lineHeight: 1, margin: 0 }}>
                  Fees Management
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 4 }}>
                Department-wise fee tracking system
              </p>
            </div>

            <button className="fp-add-btn" onClick={openAdd}>
              <Plus size={15} /> Add Fee Record
            </button>
          </div>

          {/* ── STATS ── */}
          <div className="fp-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            {statCards.map(({ title, value, icon: Icon, accent, bg, border }, i) => (
              <div key={title} className="fp-stat" style={{ background: bg, border: `1px solid ${border}` }}>
                <div style={{ position: "absolute", top: -25, right: -25, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${accent}22 0%,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <p className="fp-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.22em", margin: 0 }}>{title}</p>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}14`, border: `1px solid ${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={14} color={accent} />
                  </div>
                </div>
                <h2 className="fp-display" style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 700, color: accent, lineHeight: 1, margin: "0 0 4px", textShadow: `0 0 20px ${accent}35` }}>
                  {value}
                </h2>
                <div style={{ position: "absolute", bottom: 0, left: "1.2rem", right: "1.2rem", height: 2, borderRadius: 1, background: `linear-gradient(90deg,transparent,${accent}45,transparent)` }} />
              </div>
            ))}
          </div>

          {/* ── FILTERS ── */}
          <div className="fp-filter-row" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div className="fp-search-wrap">
              <Search size={15} className="fp-search-icon" />
              <input className="fp-search" placeholder="Search by roll or department…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="fp-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              {uniqueDepts.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="fp-table-wrap fp-desktop-table">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <TH>Roll No.</TH>
                  <TH>Department</TH>
                  <TH>Total</TH>
                  <TH>Paid</TH>
                  <TH>Pending</TH>
                  <TH>Progress</TH>
                  <TH center>Status</TH>
                  <TH center>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length === 0 ? (
                  <tr><td colSpan={8}>
                    <div className="fp-empty">
                      <Wallet size={36} style={{ opacity: 0.25 }} />
                      <p style={{ fontSize: 14 }}>No fee records match the current filters</p>
                    </div>
                  </td></tr>
                ) : (
                  filteredFees.map((fee) => {
                    const pct = pctPaid(fee);
                    const status = feeStatus(fee);
                    const pending = (Number(fee.totalFees) || 0) - (Number(fee.paidAmount) || 0);
                    return (
                      <tr key={fee._id} className="fp-tr" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "13px 16px", fontSize: 13 }}>
                          <span className="fp-mono" style={{ color: "#fbbf24" }}>{fee.student?.rollNumber || "—"}</span>
                        </td>
                        <td style={{ padding: "13px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{fee.department || "—"}</td>
                        <td style={{ padding: "13px 16px" }}>
                          <span className="fp-mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>₹{fmt(fee.totalFees)}</span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span className="fp-mono" style={{ fontSize: 13, color: "#4ade80" }}>₹{fmt(fee.paidAmount)}</span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span className="fp-mono" style={{ fontSize: 13, color: pending > 0 ? "#f87171" : "#4ade80" }}>₹{fmt(pending)}</span>
                        </td>
                        <td style={{ padding: "13px 16px", minWidth: 100 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="fp-prog-bg" style={{ flex: 1 }}>
                              <div className="fp-prog-fill" style={{
                                width: `${pct}%`,
                                background: pct >= 100 ? "linear-gradient(90deg,#22c55e,#4ade80)" : pct > 0 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "#374151",
                              }} />
                            </div>
                            <span className="fp-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", minWidth: 28 }}>{pct}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px", textAlign: "center" }}>
                          <span className="fp-pill" style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}>
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                            <button className="fp-edit-btn" onClick={() => openEdit(fee)}><Pencil size={12} /></button>
                            <button className="fp-del-btn" onClick={() => deleteFee(fee._id)}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="fp-mobile-cards">
            {filteredFees.length === 0 ? (
              <div className="fp-empty">
                <Wallet size={32} style={{ opacity: 0.25 }} />
                <p style={{ fontSize: 13 }}>No fee records found</p>
              </div>
            ) : (
              filteredFees.map((fee) => {
                const pct = pctPaid(fee);
                const status = feeStatus(fee);
                const pending = (Number(fee.totalFees) || 0) - (Number(fee.paidAmount) || 0);
                return (
                  <div key={fee._id} className="fp-fee-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <span className="fp-mono" style={{ fontSize: 13, color: "#fbbf24" }}>{fee.student?.rollNumber || "—"}</span>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{fee.department || "—"}</p>
                      </div>
                      <span className="fp-pill" style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                      {[["Total", `₹${fmt(fee.totalFees)}`, "rgba(255,255,255,0.6)"], ["Paid", `₹${fmt(fee.paidAmount)}`, "#4ade80"], ["Pending", `₹${fmt(pending)}`, pending > 0 ? "#f87171" : "#4ade80"]].map(([label, val, color]) => (
                        <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "7px 10px" }}>
                          <p className="fp-mono" style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>{label}</p>
                          <p className="fp-mono" style={{ fontSize: 12, color, fontWeight: 500 }}>{val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="fp-prog-bg" style={{ marginBottom: 10 }}>
                      <div className="fp-prog-fill" style={{
                        width: `${pct}%`,
                        background: pct >= 100 ? "linear-gradient(90deg,#22c55e,#4ade80)" : pct > 0 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "#374151",
                      }} />
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="fp-edit-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => openEdit(fee)}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button className="fp-del-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => deleteFee(fee._id)}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── MODAL ── */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, zIndex: 100,
                background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "16px",
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="fp-modal-card"
              >
                {/* Modal Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                  <div>
                    <h2 className="fp-display" style={{ fontSize: 26, color: "#fbbf24", margin: 0 }}>
                      {editingFee ? "Edit Fee Record" : "Add Fee Record"}
                    </h2>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                      {editingFee ? "Update the fee details below" : "Fill in the student fee details"}
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "rgba(255,255,255,0.45)", flexShrink: 0,
                  }}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Student select */}
                  <div className="fp-modal-field" style={{ position: "relative" }}>
                    <p className="fp-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6 }}>Student</p>
                    <div style={{ position: "relative" }}>
                      <User size={14} className="fp-modal-input-icon" />
                      <select
                        value={form.student}
                        onChange={(e) => setForm({ ...form, student: e.target.value })}
                        className="fp-modal-select"
                      >
                        <option value="">Select student…</option>
                        {students.map((s) => (
                          <option key={s._id} value={s._id}>{s.rollNumber} — {s.department}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Total Fees */}
                  <div className="fp-modal-field">
                    <p className="fp-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6 }}>Total Fees</p>
                    <div style={{ position: "relative" }}>
                      <IndianRupee size={14} className="fp-modal-input-icon" />
                      <input type="number" placeholder="e.g. 50000" value={form.totalFees} onChange={(e) => setForm({ ...form, totalFees: e.target.value })} className="fp-modal-input" />
                    </div>
                  </div>

                  {/* Paid Amount */}
                  <div className="fp-modal-field">
                    <p className="fp-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6 }}>Paid Amount</p>
                    <div style={{ position: "relative" }}>
                      <IndianRupee size={14} className="fp-modal-input-icon" />
                      <input type="number" placeholder="e.g. 25000" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} className="fp-modal-input" />
                    </div>
                    {/* Live preview */}
                    {form.totalFees && form.paidAmount && (
                      <div style={{ marginTop: 8 }}>
                        <div className="fp-prog-bg">
                          <div className="fp-prog-fill" style={{
                            width: `${Math.min(100, Math.round((Number(form.paidAmount) / Number(form.totalFees)) * 100))}%`,
                            background: "linear-gradient(90deg,#d97706,#fbbf24)",
                          }} />
                        </div>
                        <p className="fp-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                          {Math.min(100, Math.round((Number(form.paidAmount) / Number(form.totalFees)) * 100))}% paid
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Due Date */}
                  <div className="fp-modal-field">
                    <p className="fp-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6 }}>Due Date</p>
                    <div style={{ position: "relative" }}>
                      <Calendar size={14} className="fp-modal-input-icon" />
                      <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="fp-modal-input" style={{ colorScheme: "dark" }} />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button className="fp-submit-btn" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          Saving <span className="ldot" /><span className="ldot" /><span className="ldot" />
                        </span>
                      ) : editingFee ? "Update Record" : "Create Record"}
                    </button>
                    <button className="fp-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default FeesPage;
