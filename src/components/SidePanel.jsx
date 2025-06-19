import React from "react";
import { useTokenStats } from "../hooks/useTokenStats";
import TwitterFeed from './TwitterFeed';

const SidePanel = ({ side, holders }) => {
  const isAllies = side === "allies";
  const mint = isAllies
    ? "3jTBVfWyb4wgicRFNKfnrYBPux13gEFqGWWSVfjppump"
    : "Et1nwX1U2PrS1A4iRvFcd6LGzYWh1C33iHvKWBCVpump";

  const { marketCap, volume24h, loading, error } = useTokenStats(mint);

  const formatCap = (cap) => {
    if (loading) return "Loading...";
    if (error) return "Error";
    if (cap === null || cap === undefined) return "Loading...";
    if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(1)}M`;
    if (cap >= 1_000) return `$${(cap / 1_000).toFixed(0)}K`;
    return `$${cap}`;
  };

  const formatNum = (num) => {
    if (num === null || num === undefined) return "Loading...";
    return num.toLocaleString();
  };

  const stats = {
    title: isAllies ? "ALLIES" : "AXIS",
    marketCap: formatCap(marketCap),
    holders: formatNum(holders),
    volume: formatCap(volume24h),
    btnColor: isAllies ? "linear-gradient(135deg, #0066ff 0%, #00aaff 100%)" : "linear-gradient(135deg, #990000 0%, #ff3333 100%)",
    shadow: isAllies ? "0 0 30px rgba(0, 170, 255, 0.7)" : "0 0 30px rgba(255, 51, 102, 0.7)",
    textColor: isAllies ? "#00aaff" : "#ff3366",
    buyUrl: isAllies
      ? "https://pump.fun/coin/3jTBVfWyb4wgicRFNKfnrYBPux13gEFqGWWSVfjppump"
      : "https://pump.fun/coin/Et1nwX1U2PrS1A4iRvFcd6LGzYWh1C33iHvKWBCVpump",
    communityUrl: isAllies
      ? "https://x.com/i/communities/1935257152878428521"
      : "https://x.com/i/communities/1934928130952843437"
  };

  const Button = ({ children, onClick, style = {} }) => (
    <button
      onClick={onClick}
      style={{
        background: stats.btnColor,
        color: "#fff",
        border: "none",
        padding: "18px 36px",
        fontSize: "18px",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: stats.shadow,
        transition: "all 0.3s ease",
        opacity: loading ? 0.7 : 1,
        fontWeight: "bold",
        letterSpacing: "1px",
        textTransform: "uppercase",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
        width: "100%",
        maxWidth: "320px",
        marginBottom: "15px",
        ...style
      }}
      disabled={loading}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-3px)";
        e.target.style.boxShadow = isAllies 
          ? "0 0 40px rgba(0, 170, 255, 0.9)" 
          : "0 0 40px rgba(255, 51, 102, 0.9)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = stats.shadow;
      }}
    >
      {children}
      <span style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: isAllies 
          ? "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)"
          : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
        transform: "rotate(30deg)",
        animation: "shine 3s infinite",
        zIndex: -1
      }} />
    </button>
  );

  return (
    <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 30px",
    height: "100%",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",

    /* 🔥 NEW — PNG first, then the original radial-gradient */
    backgroundImage: isAllies
      ? "url('/allies.png'), radial-gradient(circle at 20% 30%, rgba(0, 100, 255, 0.15) 0%, rgba(0, 0, 30, 0.8) 60%)"
      : "url('/axis.png'),  radial-gradient(circle at 80% 30%, rgba(255, 50, 50, 0.15) 0%, rgba(30, 0, 0, 0.8) 60%)",
    backgroundSize: "cover, cover",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "center, center",

    borderRight: isAllies ? "1px solid rgba(0, 170, 255, 0.1)" : "none",
    borderLeft:  !isAllies ? "1px solid rgba(255, 50, 50, 0.1)" : "none",
  }}
>
  {/* Animated background elements */}
  <div
    style={{
      position: "absolute",
      top: "-50%",
      left: isAllies ? "-30%" : "70%",
      width: "100%",
      height: "200%",
      background: isAllies
        ? "radial-gradient(circle, rgba(0, 170, 255, 0.1) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(255, 50, 50, 0.1) 0%, transparent 70%)",
      animation: "rotate 30s linear infinite",
      zIndex: 0,
    }}
  />

  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "url('https://www.transparenttextures.com/patterns/dark-stripes.png')",
      opacity: 0.05,
      zIndex: 0,
    }}
  />

  {/* —---------------- Your existing content —---------------- */}
  <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
    <h2
      style={{
        fontSize: "clamp(36px, 5vw, 72px)",
        marginBottom: "30px",
        color: stats.textColor,
        textShadow: `0 0 20px ${stats.textColor}80`,
        fontWeight: "900",
        letterSpacing: "2px",
        textTransform: "uppercase",
        position: "relative",
        display: "inline-block",
      }}
    >
      {stats.title}
      <span
        style={{
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "3px",
          background: stats.textColor,
          borderRadius: "3px",
          boxShadow: `0 0 10px ${stats.textColor}`,
        }}
      />
    </h2>

    <div
      style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "1fr",
        width: "100%",
        maxWidth: "320px",
        margin: "0 auto 30px auto",
      }}
    >
          {/* Market Cap */}
          <div style={panelBox(stats.textColor)}>
            <div style={labelStyle}>🔥 MARKET CAP</div>
            <div style={valueStyle}>{stats.marketCap}</div>
          </div>

          {/* Holders */}
          <div style={panelBox(stats.textColor)}>
            <div style={labelStyle}>👥 HOLDERS</div>
            <div style={valueStyle}>{stats.holders}</div>
          </div>

          {/* 24h Volume */}
          <div style={panelBox(stats.textColor)}>
            <div style={labelStyle}>💰 24H VOLUME</div>
            <div style={valueStyle}>{stats.volume}</div>
          </div>

          {/* Error indicator */}
          {error && (
            <div style={{ ...panelBox('#ff6666'), backgroundColor: 'rgba(255,102,102,0.1)' }}>
              <div style={{ ...labelStyle, color: '#ff6666' }}>⚠️ API ERROR</div>
              <div style={{ ...valueStyle, fontSize: '12px', color: '#ff6666' }}>
                {error.length > 30 ? error.substring(0, 30) + '...' : error}
              </div>
            </div>
          )}
        </div>

        {/* Buttons Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
          <Button onClick={() => window.open(stats.communityUrl, "_blank")}>
            {loading ? "Loading..." : `Join ${stats.title}`}
          </Button>
          
          <Button onClick={() => window.open(stats.buyUrl, "_blank")} style={{ background: isAllies ? "#00aaff" : "#ff3366" }}>
            {loading ? "Loading..." : `Buy $${stats.title}`}
          </Button>
        </div>

        {/* Twitter Feed Component */}
        {/* <TwitterFeed 
          hashtag={isAllies ? "Allies" : "Axis"} 
          color={stats.textColor} 
        /> */}
      </div>
    </div>
  );
};

// Reusable styles
const panelBox = (color) => ({
  background: "rgba(0, 0, 0, 0.4)",
  padding: "20px",
  borderRadius: "12px",
  border: `1px solid ${color}40`,
  boxShadow: `0 5px 15px ${color}20, inset 0 0 10px rgba(255,255,255,0.05)`,
  backdropFilter: "blur(5px)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 8px 25px ${color}40`
  }
});

const labelStyle = {
  fontSize: "14px",
  opacity: 0.8,
  marginBottom: "8px",
  fontWeight: "600",
  letterSpacing: "1px",
  textTransform: "uppercase"
};

const valueStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "1px",
  background: "linear-gradient(180deg, #ffffff 0%, #dddddd 100%)",
  WebkitBackgroundClip: "text",
  color: "transparent",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)"
};

export default SidePanel;