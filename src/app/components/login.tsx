import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { C } from "./tokens";
import { Zap } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Masukkan email yang valid";
    if (!password) errs.password = "Password wajib diisi";
    else if (password.length < 6) errs.password = "Minimal 6 karakter";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    navigate("/dashboard");
  };

  return (
    <div className="w-full min-h-screen flex" style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}>
      {/* Left panel */}
      <div className="w-full lg:w-[520px] flex flex-col shrink-0 relative z-10" style={{ background: C.surface }}>
        <div className="pt-10 px-10 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})` }}>
              <Zap size={18} color="#FFF" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 20, color: C.primary, letterSpacing: "-0.3px" }}>Ekspedisi Petir</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 max-w-[400px] mx-auto w-full box-border">
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 26, color: C.text, margin: 0 }}>Selamat Datang</h1>
          <p style={{ fontSize: 14, color: C.text2, margin: 0, marginTop: 6 }}>Masuk untuk melanjutkan ke sistem operasional</p>

          <form onSubmit={handleSubmit} className="flex flex-col mt-7">
            <label style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 }}>Email</label>
            <input
              type="email" placeholder="anda@perusahaan.com" value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
              className="h-10 rounded-xl px-3.5 text-sm outline-none w-full box-border"
              style={{ border: `1px solid ${errors.email ? C.danger : C.borderSoft}`, color: C.text, background: C.surface2 }}
            />
            {errors.email && <span style={{ fontSize: 12, color: C.danger, marginTop: 4 }}>{errors.email}</span>}

            <label style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6, marginTop: 16 }}>Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"} placeholder="Masukkan password"
                value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                className="h-10 rounded-xl px-3.5 pr-12 text-sm outline-none w-full box-border"
                style={{ border: `1px solid ${errors.password ? C.danger : C.borderSoft}`, color: C.text, background: C.surface2 }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex text-xs font-semibold"
                style={{ color: C.text2 }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span style={{ fontSize: 12, color: C.danger, marginTop: 4 }}>{errors.password}</span>}

            <div className="flex items-center justify-between mt-5">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] font-normal" style={{ color: C.text2 }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: C.primary }} />
                Ingat saya
              </label>
              <a href="#" onClick={e => e.preventDefault()} className="text-[13px] font-medium no-underline" style={{ color: C.accent }}>Lupa password?</a>
            </div>

            <button type="submit" className="h-10 rounded-xl border-none text-white text-sm font-semibold cursor-pointer mt-6 transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})` }}>
              Masuk
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: C.text2 }}>
            Butuh akses?{" "}<a href="#" onClick={e => e.preventDefault()} className="font-medium no-underline" style={{ color: C.accent }}>Hubungi administrator</a>
          </p>
        </div>

        <div className="pb-6 text-[11px] tracking-[0.2px] text-center" style={{ color: C.text2 }}>
          Ekspedisi Petir v1.0.0 &middot; &copy; 2026
        </div>
      </div>

      {/* Right visual panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760055588287-612117cb24ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMGFpcnBsYW5lJTIwYWlycG9ydCUyMHRhcm1hYyUyMG5pZ2h0fGVufDF8fHx8MTc3NTk5NjMxOHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cargo operations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${C.primary}E6 0%, ${C.primary2}99 50%, ${C.accent}66 100%)` }} />

        <div className="relative z-10 p-14 w-full max-w-[700px]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-md" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Zap size={22} color="#FFF" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 17, color: "#FFF", letterSpacing: "-0.3px" }}>Ekspedisi Petir</span>
          </div>

          <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 32, color: "#FFF", margin: 0, lineHeight: "40px", maxWidth: 480 }}>
            Cutoff Control Desk<br />untuk Cargo Udara.
          </h2>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, marginTop: 14, lineHeight: "22px", maxWidth: 440 }}>
            Pantau shipment, lacak AWB, kelola penerbangan, dan catat seluruh aktivitas dari satu pusat kendali.
          </p>

          <div className="flex gap-8 mt-8">
            {[{ value: "284", label: "Shipment hari ini" }, { value: "98.2%", label: "On-time rate" }, { value: "18", label: "Flight aktif" }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 26, color: "#FFF" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
