export default function Home() {
  return (
    <div>

      <h1>Welcome to Smart CarbonTrack</h1>

      <p>
        Smart CarbonTrack is a digital platform designed to monitor,
        analyze, and reduce carbon emissions in manufacturing units.
      </p>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        <div className="card">
          <h3>Monitor Emissions</h3>
          <p>Track energy and fuel usage across operations.</p>
        </div>

        <div className="card">
          <h3>Analyze Trends</h3>
          <p>Visualize carbon footprint and performance metrics.</p>
        </div>

        <div className="card">
          <h3>Improve Sustainability</h3>
          <p>Support eco-friendly decision making.</p>
        </div>

      </div>

    </div>
  );
}

