import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("register_failed");
      }

      alert("Istifadeci ugurla yaradildi.");
      navigate("/login", { replace: true });
    } catch {
      alert("Qeydiyyat zamani xeta bas verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form
        onSubmit={register}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-sm"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Register</h1>
          <p className="text-sm text-slate-500">Yeni admin hesabini yarat</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-500"
        />

        <input
          type="password"
          placeholder="Sifre"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 p-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Yuklenir..." : "Qeydiyyat"}
        </button>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link to="/app" className="hover:text-slate-800 hover:underline">
            Vitrin
          </Link>
          <Link to="/login" className="hover:text-slate-800 hover:underline">
            Daxil ol
          </Link>
        </div>
      </form>
    </div>
  );
}
