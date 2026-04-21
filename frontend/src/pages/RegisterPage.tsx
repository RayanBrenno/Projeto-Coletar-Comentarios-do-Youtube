import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
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
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "••••••••"}
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

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 text-xs transition-colors ${
        met ? "text-green-400" : "text-white/30"
      }`}
    >
      {met ? <Check size={11} /> : <X size={11} />}
      {label}
    </li>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { register } = useAuth();

  const passwordRules = {
    length: formData.password.length >= 6,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  }

  function validateFields() {
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      errors.nome = "Informe seu nome completo";
    }

    if (!formData.email.trim()) {
      errors.email = "Informe seu e-mail";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "E-mail inválido";
    }

    if (!formData.password) {
      errors.password = "Informe uma senha";
    } else if (formData.password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirme sua senha";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    return errors;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.nome.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao registrar");
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
              <UserPlus className="w-6 h-6 text-red-400" />
            </div>
          </div>

          <h2 className="text-white font-semibold text-lg mb-1 text-center">
            Criar conta
          </h2>
          <p className="text-white/40 text-sm mb-6 text-center">
            Preencha os dados para continuar
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className={labelClass}>Nome completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="João Silva"
                className={
                  inputClass +
                  (fieldErrors.nome ? " border-red-500/60 focus:border-red-500" : "")
                }
              />
              {fieldErrors.nome && (
                <p className="text-red-400 text-xs mt-1.5">{fieldErrors.nome}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                className={
                  inputClass +
                  (fieldErrors.email ? " border-red-500/60 focus:border-red-500" : "")
                }
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1.5">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Senha</label>
              <PasswordInput
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
              />

              {formData.password.length > 0 && (
                <ul className="mt-2.5 space-y-1 pl-0.5">
                  <PasswordRule met={passwordRules.length} label="Mínimo 6 caracteres" />
                  <PasswordRule met={passwordRules.upper} label="Uma letra maiúscula" />
                  <PasswordRule met={passwordRules.number} label="Um número" />
                </ul>
              )}

              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1.5">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirmar senha</label>
              <div className="relative">
                <PasswordInput
                  value={formData.confirmPassword}
                  onChange={(value) => handleChange("confirmPassword", value)}
                  placeholder="Repita a senha"
                />

                {formData.confirmPassword.length > 0 && (
                  <span
                    className={`absolute right-10 top-1/2 -translate-y-1/2 ${
                      formData.confirmPassword === formData.password
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formData.confirmPassword === formData.password ? (
                      <Check size={14} />
                    ) : (
                      <X size={14} />
                    )}
                  </span>
                )}
              </div>

              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Criar conta
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}