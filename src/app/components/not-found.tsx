import { useNavigate } from "react-router";
import { C } from "./tokens";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 500, textAlign: "center", gap: 14, padding: 48,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16, background: C.warningA06,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8,
      }}>
        <span style={{ fontSize: 28, color: C.warning, fontFamily: "Manrope, sans-serif", fontWeight: 800 }}>404</span>
      </div>

      <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 22, color: C.text, margin: 0 }}>
        Halaman Tidak Ditemukan
      </h1>

      <p style={{ fontSize: 14, color: C.text2, margin: 0, maxWidth: 400, lineHeight: "22px" }}>
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
        Gunakan navigasi sidebar untuk menuju bagian yang tersedia.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={() => navigate("/dashboard")} style={{
          height: 38, padding: "0 22px", borderRadius: 10, border: "none",
          background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
          color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Ke Dashboard</button>
        <button onClick={() => navigate(-1)} style={{
          height: 38, padding: "0 22px", borderRadius: 10,
          border: `1px solid ${C.borderSoft}`, background: C.surface,
          color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>Kembali</button>
      </div>
    </div>
  );
}