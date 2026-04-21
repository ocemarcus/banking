import React, { useState } from 'react';
import { login as loginApi } from '../api/auth';

/**
 * @param {{ onLogin: (data: any) => void }} props
 */
export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginApi({ email, password });
      onLogin(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-primary to-[#5b0b9b] p-8 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
            <span className="h-8 w-8 rounded-2xl bg-white/15" />
            <span>Meu Banco</span>
          </div>
          <div className="mt-10 space-y-4">
            <h1 className="text-3xl font-extrabold leading-tight">
              Controle total das suas
              <br />
              finanças em um só lugar.
            </h1>
            <p className="max-w-xs text-sm text-primary-foreground/80">
              Acompanhe saldo, entradas, saídas e contas com uma interface simples, clara e moderna.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs text-primary-foreground/70">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span>Conexão segura com criptografia de ponta a ponta</span>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Entre na sua conta</h2>
              <p className="text-xs text-muted-foreground">
                Use o seu e-mail cadastrado para acessar o painel de controle.
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <label htmlFor="login-email" className="block font-medium text-foreground">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>

            <div className="space-y-1 text-sm">
              <label htmlFor="login-password" className="block font-medium text-foreground">
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
