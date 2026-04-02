export default function Topbar({ plant, page }) {
  return (
    <div
      style={{
        background: "#c7e9ff",
        color: "Teal",
        padding: "14px 24px",
        borderBottom: "1px solid #ddd"
      }}
    > 
      <h2 style={{ margin: 0 }}>{plant}</h2>
      <p
        style={{
          margin: 0,
          opacity: 0.7,
          textTransform: "capitalize"
        }}
      >
        {page}
      </p>
    </div>
  );
}
