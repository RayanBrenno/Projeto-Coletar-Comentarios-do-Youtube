import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all";

const labelClass =
  "block text-xs text-white/50 font-semibold uppercase tracking-widest mb-1.5";

function Logo() {
  return (
    <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl shadow-2xl shadow-red-900/50 mb-4">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        required
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-white font-bold text-2xl">VideoInsight</h1>
          <p className="text-white/40 text-sm mt-1">
            Análise inteligente de vídeos
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-red-600/15 rounded-xl border border-red-500/20">
              <LogIn className="w-6 h-6 text-red-400" />
            </div>
          </div>

          <h2 className="text-white font-semibold text-lg mb-1 text-center">
            Entrar na plataforma
          </h2>
          <p className="text-white/40 text-sm mb-6 text-center">
            Acesse sua conta para continuar
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Senha</label>
              <PasswordInput value={password} onChange={setPassword} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Ainda não tem conta?{" "}
            <Link
              to="/register"
              className="text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}