import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const initialChartData = [
  { month: 'Jan', entradas: 3600, saidas: 1700 },
  { month: 'Fev', entradas: 5100, saidas: 2500 },
  { month: 'Mar', entradas: 4200, saidas: 1900 },
  { month: 'Abr', entradas: 6200, saidas: 3200 },
  { month: 'Mai', entradas: 5900, saidas: 2800 },
  { month: 'Jun', entradas: 7300, saidas: 3500 },
];

export function OverviewPage({ user, totals }) {
  const saldo = totals.entradas - totals.saidas;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo atual</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">Olá, {user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R$ {totals.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">Últimos meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R$ {totals.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">Custos gerais</p>
          </CardContent>
        </Card>
      </div>

      <Card className="h-[340px]">
        <CardHeader>
          <CardTitle>Fluxo de caixa</CardTitle>
          <CardDescription>Entradas e saídas por mês</CardDescription>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={initialChartData} margin={{ left: -20, right: 12 }}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `R$ ${Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
                }
              />
              <Tooltip
                formatter={(value) =>
                  `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                }
              />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke="#22c55e"
                fill="url(#colorEntradas)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="saidas"
                stroke="#ef4444"
                fill="url(#colorSaidas)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}

