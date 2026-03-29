export default function Topbar() {
  const plantName = sessionStorage.getItem("plantName");

  return (
    <div className="topbar">
      Plant: {plantName || "Not Selected"}
    </div>
  );
}

