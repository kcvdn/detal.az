import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-200 hover:bg-slate-800 hover:text-white"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="w-full bg-slate-950 p-5 text-white md:min-h-screen md:w-72">
        <h2 className="mb-8 text-2xl font-bold">Detal Admin</h2>

        <nav className="space-y-3">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            Mehsullar
          </NavLink>

          <button
            type="button"
            onClick={logout}
            className="mt-10 text-sm font-medium text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
