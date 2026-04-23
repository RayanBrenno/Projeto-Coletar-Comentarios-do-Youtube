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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 text-white">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">Painel principal</p>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
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
            className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-white/70 transition-all hover:bg-red-600 hover:text-white"
          >
            <LogOut size={18} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="ml-72 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}