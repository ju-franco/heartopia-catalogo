import { PiButterfly } from "react-icons/pi";

export default function LoadingScreen({ theme }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.bg,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <div className="bg-glow"></div>

      <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        <div className="butterfly-container">
          <PiButterfly style={{ fontSize: "100px", color: "#ff69b4" }} />
        </div>

        <h1
          style={{
            fontFamily: "Quicksand",
            fontWeight: "800",
            color: "#ff69b4",
            marginTop: "30px",
            letterSpacing: "2px",
            fontSize: "28px",
          }}
        >
          CATÁLOGO HEARTOPIA
        </h1>

        <p
          className="loading-text"
          style={{
            color: "#ff69b4",
            opacity: 0.7,
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          Carregando os dados...
        </p>
      </div>

      <style>{`
        .butterfly-container {
          animation: float 4s infinite ease-in-out, wingBeat 0.8s infinite ease-in-out;
          filter: drop-shadow(0 0 15px var(--cor-destaque));
        }

        @keyframes wingBeat {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.5); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }

        .bg-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--cor-destaque);
          filter: blur(150px);
          border-radius: 50%;
          opacity: 0.3;
          animation: pulseGlow 6s infinite alternate;
        }

        @keyframes pulseGlow {
          from { transform: scale(1); opacity: 0.2; }
          to { transform: scale(2); opacity: 0.4; }
        }

        .loading-text {
          animation: fade 2s infinite;
        }

        @keyframes fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}