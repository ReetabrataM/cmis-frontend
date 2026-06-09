import {
  LayoutDashboard,
  Users,
  BookOpen,
  Wallet,
  ClipboardCheck,
  LogOut,
  GraduationCap,
  Award,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sidebar-root {
    font-family: 'DM Sans', sans-serif;
  }

  .sidebar-logo-text {
    font-family: 'Playfair Display', serif;
  }

  .sidebar-mono {
    font-family: 'DM Mono', monospace;
  }

  /* Scrollbar */
  .sidebar-scroll::-webkit-scrollbar { width: 0px; }

  /* Grain overlay */
  .sidebar-grain::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: inherit;
    z-index: 0;
  }

  .sidebar-nav-item {
    position: relative;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-nav-item .item-arrow {
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s ease;
  }

  .sidebar-nav-item:hover .item-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .sidebar-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #fbbf24, #f59e0b);
    box-shadow: 0 0 10px rgba(251,191,36,0.6);
  }

  /* Mobile overlay backdrop */
  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 40;
  }

  /* Hamburger button */
  .hamburger-btn {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 60;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(251,191,36,0.12);
    border: 1px solid rgba(251,191,36,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fbbf24;
    transition: background 0.2s, transform 0.15s;
  }

  .hamburger-btn:hover {
    background: rgba(251,191,36,0.2);
    transform: scale(1.05);
  }

  .hamburger-btn:active {
    transform: scale(0.95);
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34,197,94,0.8);
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,0.8); }
    50% { opacity: 0.6; box-shadow: 0 0 4px rgba(34,197,94,0.4); }
  }

  .logout-btn {
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .logout-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(239,68,68,0.08);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
    border-radius: inherit;
  }

  .logout-btn:hover::before {
    transform: scaleX(1);
  }

  .logout-btn:hover {
    border-color: rgba(239,68,68,0.45) !important;
    box-shadow: 0 0 20px rgba(239,68,68,0.12);
  }

  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent);
    margin: 4px 0;
  }

  @media (min-width: 769px) {
    .hamburger-btn { display: none !important; }
  }
`;

const menuSections = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    ],
  },
  {
    title: "Academics",
    items: [
      { title: "Students", icon: <Users size={18} />, path: "/students" },
      { title: "Courses", icon: <BookOpen size={18} />, path: "/courses" },
      { title: "Attendance", icon: <ClipboardCheck size={18} />, path: "/attendance" },
      { title: "Marks", icon: <Award size={18} />, path: "/marks" },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Fees", icon: <Wallet size={18} />, path: "/fees" },
    ],
  },
];

function SidebarContent({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.user?.name || user?.name || "Administrator";
  const userEmail = user?.user?.email || user?.email || "admin@cmis.com";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="sidebar-root sidebar-scroll"
      style={{
        width: "270px",
        minHeight: "100vh",
        height: "100%",
        background: "linear-gradient(175deg, #0a0a0a 0%, #060606 100%)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "28px 18px",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* Subtle left accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, bottom: 0,
        width: "1px",
        background: "linear-gradient(180deg, transparent, rgba(251,191,36,0.15) 30%, rgba(251,191,36,0.15) 70%, transparent)",
        pointerEvents: "none",
      }} />

      <div>
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "28px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "48px", height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #fbbf24, #b45309)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(251,191,36,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}>
              <GraduationCap size={22} color="#000" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="sidebar-logo-text" style={{
                fontSize: "26px",
                color: "#fbbf24",
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}>
                CMIS
              </h1>
              <p className="sidebar-mono" style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.3em",
                marginTop: "3px",
                textTransform: "uppercase",
              }}>
                University ERP
              </p>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  marginLeft: "auto",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  width: "30px", height: "30px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>

        {/* USER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{
            marginBottom: "26px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            padding: "14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Card shimmer */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at top left, rgba(251,191,36,0.06), transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: "44px", height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fbbf24, #92400e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: "700", color: "#000",
                boxShadow: "0 2px 12px rgba(251,191,36,0.2)",
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{
                position: "absolute", bottom: "-2px", right: "-2px",
                width: "12px", height: "12px",
                background: "#22c55e",
                borderRadius: "50%",
                border: "2px solid #0a0a0a",
                boxShadow: "0 0 6px rgba(34,197,94,0.7)",
              }} />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                <span className="status-dot" />
                <span className="sidebar-mono" style={{ fontSize: "9px", color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Active
                </span>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userEmail}
              </p>
            </div>
          </div>
        </motion.div>

        {/* NAVIGATION */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {menuSections.map((section, sIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.12 + sIdx * 0.06 }}
            >
              <p className="sidebar-mono" style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.22)",
                textTransform: "uppercase",
                marginBottom: "6px",
                paddingLeft: "10px",
              }}>
                {section.title}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {section.items.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.title} to={item.path} onClick={onClose} style={{ textDecoration: "none" }}>
                      <motion.div
                        whileHover={{ x: active ? 0 : 3 }}
                        className={`sidebar-nav-item ${active ? "active" : ""}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          background: active
                            ? "rgba(251,191,36,0.09)"
                            : "transparent",
                          border: active
                            ? "1px solid rgba(251,191,36,0.15)"
                            : "1px solid transparent",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{
                          color: active ? "#fbbf24" : "rgba(255,255,255,0.4)",
                          transition: "color 0.2s",
                          flexShrink: 0,
                        }}>
                          {item.icon}
                        </div>

                        <span style={{
                          fontSize: "14px",
                          fontWeight: active ? "600" : "400",
                          color: active ? "#fff" : "rgba(255,255,255,0.6)",
                          flex: 1,
                          transition: "color 0.2s",
                        }}>
                          {item.title}
                        </span>

                        <ChevronRight
                          size={14}
                          className="item-arrow"
                          style={{ color: active ? "#fbbf24" : "rgba(255,255,255,0.3)", flexShrink: 0 }}
                        />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ paddingTop: "20px" }}
      >
        {/* SYSTEM STATUS */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "14px",
          marginBottom: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p className="sidebar-mono" style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              System
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span className="status-dot" style={{ width: "5px", height: "5px" }} />
              <span style={{ fontSize: "10px", color: "#4ade80" }}>All clear</span>
            </div>
          </div>

          {[
            { label: "API Server", value: "Online" },
            { label: "Database", value: "Connected" },
            { label: "Auth", value: "Active" },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "5px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>{label}</span>
              <span style={{
                fontSize: "11px", color: "#4ade80",
                fontFamily: "'DM Mono', monospace",
                background: "rgba(34,197,94,0.1)",
                padding: "1px 7px",
                borderRadius: "99px",
                border: "1px solid rgba(34,197,94,0.15)",
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="logout-btn"
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "11px",
            borderRadius: "12px",
            background: "transparent",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <LogOut size={16} />
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
}

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{SIDEBAR_STYLES}</style>

      {/* Desktop: always visible */}
      <div style={{ display: "none" }} className="lg-sidebar">
        <div style={{ display: "block" }}>
          <SidebarContent />
        </div>
      </div>

      {/* Inline styles for responsive breakpoints */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-sidebar { display: flex !important; flex-shrink: 0; }
          .mobile-sidebar-wrapper { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-sidebar-wrapper"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              style={{
                position: "fixed",
                top: 0, left: 0, bottom: 0,
                zIndex: 50,
                display: "flex",
              }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
