import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function AccountPage({ accounts, accountForm, onFormChange, onCreateAccount }) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Listagem de contas</CardTitle>
            <CardDescription>Document, type e balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-3">Document</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b last:border-0">
                      <td className="py-3 font-medium text-slate-700">{account.document}</td>
                      <td className="py-3 uppercase text-slate-500">{account.type}</td>
                      <td className="py-3 text-right font-semibold text-slate-700">
                        R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cadastro de account</CardTitle>
            <CardDescription>Preencha accountType e document</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onCreateAccount}>
              <div className="space-y-2">
                <Label htmlFor="accountType">accountType</Label>
                <select
                  id="accountType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={accountForm.accountType}
                  onChange={(event) => onFormChange('accountType', event.target.value)}
                >
                  <option value="pf">pf</option>
                  <option value="pj">pj</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountDocument">document</Label>
                <Input
                  id="accountDocument"
                  placeholder="CPF/CNPJ"
                  value={accountForm.document}
                  onChange={(event) => onFormChange('document', event.target.value)}
                  required
                />
              </div>
              <Button className="w-full" type="submit">
                Cadastrar account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

