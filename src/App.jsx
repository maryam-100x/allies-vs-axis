import React from "react";
import BattleMeter from "./components/BattleMeter";
import SidePanel from "./components/SidePanel";
import Header from "./components/Header";
import { useHolderCount } from "./hooks/useHolderCount";
import { useTokenStats } from "./hooks/useTokenStats";

const App = () => {
  const ALLIES_MINT = "3jTBVfWyb4wgicRFNKfnrYBPux13gEFqGWWSVfjppump";
  const AXIS_MINT = "Et1nwX1U2PrS1A4iRvFcd6LGzYWh1C33iHvKWBCVpump";

  const { alliesHolders, axisHolders } = useHolderCount();
  const alliesStats = useTokenStats(ALLIES_MINT);
  const axisStats = useTokenStats(AXIS_MINT);

  const winningSide =
    (alliesStats.marketCap || 0) > (axisStats.marketCap || 0)
      ? "allies"
      : "axis";

  const glowColor =
    winningSide === "allies"
      ? "drop-shadow(0 0 20px #00aaff) drop-shadow(0 0 50px #0066ff)"
      : "drop-shadow(0 0 20px #ff3366) drop-shadow(0 0 50px #990000)";

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at center, #0a0a1a 0%, #000000 100%)",
      color: "#fff"
    }}>
      <Header />
      <BattleMeter
        alliesCap={alliesStats.marketCap}
        axisCap={axisStats.marketCap}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row", // Ensure horizontal layout
          height: "calc(100vh - 154px)",
          minHeight: "600px"
        }}
      >
        <div style={{
          flex: 1, // Takes half the space
          position: "relative",
          overflow: "hidden"
        }}>
          <SidePanel side="allies" holders={alliesHolders} />
        </div>

        <div style={{
          flex: 1, // Takes the other half
          position: "relative",
          overflow: "hidden"
        }}>
          <SidePanel side="axis" holders={axisHolders} />
        </div>

        <img
          src="/vs.png"
          alt="VS"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            height: "clamp(200px, 30vw, 400px)",
            pointerEvents: "none",
            animation: "vsPulse 3s ease-in-out infinite",
            filter: `${glowColor} brightness(1.2)`,
            transition: "filter 0.5s ease-in-out",
            opacity: 0.9
          }}
        />
      </div>
    </div>
  );
};

export default App;