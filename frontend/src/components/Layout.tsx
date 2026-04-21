import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, RefreshCcw, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const menuItems = [
    { label: "Início", path: "/home", icon: Home },
    { label: "Consultar", path: "/consultar", icon: Search },
    { label: "Atualizar", path: "/atualizar", icon: RefreshCcw },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 text-white flex">
      <aside className="w-72 min-h-screen bg-black/20 backdrop-blur-md border-r border-white/10 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-white/50 mt-1">Painel principal</p>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  active
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
