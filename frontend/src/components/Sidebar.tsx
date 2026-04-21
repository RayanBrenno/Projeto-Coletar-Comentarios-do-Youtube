import { Search, RefreshCw, LogOut, Play } from "lucide-react";
import type { ReactNode } from "react";

type Page = "home" | "consultar" | "atualizar";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const navItems: { id: Page; label: string; icon: ReactNode }[] = [
  { id: "home", label: "Início", icon: <Play size={18} /> },
  { id: "consultar", label: "Consultar", icon: <Search size={18} /> },
  { id: "atualizar", label: "Atualizar", icon: <RefreshCw size={18} /> },
];

export function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f0f0f] flex flex-col z-50 shadow-2xl">
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
            <Play size={16} className="text-white fill-white ml-0.5" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight tracking-wide">
              VideoInsight
            </p>
            <p className="text-white/40 text-xs">Análise de Vídeos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Menu
        </p>

        {navItems.map((item) => {
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span className={isActive ? "text-white" : "text-white/40"}>
                {item.icon}
              </span>

              {item.label}

              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-5 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:bg-red-950/40 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut size={17} className="group-hover:text-red-400 transition-colors" />
          Sair
        </button>
      </div>
    </aside>
  );
}