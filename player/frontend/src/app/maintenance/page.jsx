"use client";

export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#181818",
      color: "#fff",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>We'll Be Back Soon!</h1>
      <p style={{ fontSize: "1.25rem", maxWidth: 500, marginBottom: "2rem" }}>
        Our site is currently undergoing scheduled maintenance.<br />
        We apologize for the inconvenience and appreciate your patience.<br />
        Please check back shortly.
      </p>
      <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🛠️</div>
      <p style={{ color: "#aaa", fontSize: "1rem" }}>
        If you are seeing this page, all navigation is temporarily disabled.<br />
        You will be redirected automatically when maintenance is over.
      </p>
    </div>
  );
} 