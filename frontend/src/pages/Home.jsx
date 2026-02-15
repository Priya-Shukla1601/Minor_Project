import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState(null);

  const cards = [
    {
      title: "Monitor Emissions",
      desc: "Track electricity consumption, fuel usage, and production data in real time. Identify inefficiencies and emission hotspots with precision insights.",
      color: "#15803d"
    },
    {
      title: "Analyze Trends",
      desc: "Visual dashboards reveal carbon intensity patterns and energy trends to support smarter operational decision-making.",
      color: "#14a34a"
    },
    {
      title: "Improve Sustainability",
      desc: "Adopt cleaner strategies, increase renewable energy usage, and align plant operations with long-term sustainability goals.",
      color: "#16a52a"
    },
    {
      title: "Carbon Visibility",
      desc: "Gain plant-level transparency into emissions and understand where operational improvements create the highest impact.",
      color: "#16ad68"
    },
    {
      title: "Operational Efficiency",
      desc: "Use energy intelligence to optimize processes, reduce waste, and enhance productivity while lowering environmental load.",
      color: "#158f6a"
    },
    {
      title: "Compliance Readiness",
      desc: "Maintain structured emission records aligned with reporting frameworks for audit preparedness and sustainability reporting.",
      color: "#16a38a"
    }
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Welcome to Smart CarbonTrack
        </h1>

        <p style={styles.subtitle}>
          Smart CarbonTrack is a digital platform designed to monitor,
          analyze, and reduce carbon emissions in manufacturing units.
        </p>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {cards.map((card, i) => {
          const isHover = hovered === i;

          return (
            <div
              key={card.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.card,
                borderTop: `6px solid ${card.color}`,
                transform: isHover
                  ? "translateY(-10px) scale(1.04)"
                  : "none",
                boxShadow: isHover
                  ? "0 18px 40px rgba(0,0,0,0.18)"
                  : styles.card.boxShadow
              }}
            >
              <h2
                style={{
                  ...styles.cardTitle,
                  color: card.color
                }}
              >
                {card.title}
              </h2>

              <p
                style={{
                  ...styles.cardText,
                  color: card.color
                }}
              >
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background:
      "linear-gradient(135deg, #e0f2fe, #ccfbf1, #dcfce7)",
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column"
  },

  header: {
    textAlign: "center",
    marginBottom: "40px"
  },

  title: {
    fontSize: "54px",
    fontWeight: "900",
    marginBottom: "16px",
    color: "#0f766e"
  },

  subtitle: {
    fontSize: "22px",
    maxWidth: "900px",
    margin: "0 auto",
    lineHeight: "1.6",
    fontWeight: "500",
    color: "#134e4a"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "28px",
    flexGrow: 1
  },

  card: {
    background: "white",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },

  cardTitle: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "12px"
  },

  cardText: {
    fontSize: "19px",
    lineHeight: "1.6",
    fontWeight: "500"
  }
};
