export default function Loading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #eab308",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto",
        }} />
        <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px" }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}