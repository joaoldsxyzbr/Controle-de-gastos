import { useMemo, useState } from 'react'
import DashboardHeader from './components/DashboardHeader'
import ExpensesTable from './components/ExpensesTable'
import MetricCard from './components/MetricCard'
import MonthOverview from './components/MonthOverview'
import MonthlyChart from './components/MonthlyChart'
import { useDashboardSummary } from './hooks/useDashboardSummary'
import { MONTH_TABLES, useGastos } from './hooks/useGastos'
import { money } from './utils/money'
import { chronological } from './utils/month'

export default function Dashboard() {
  const { gastos, loading, error, syncStatus, lastUpdated, recarregar } = useGastos()
  const sortedMonths = useMemo(() => [...MONTH_TABLES].sort(chronological), [])
  const [selectedMonth, setSelectedMonth] = useState(sortedMonths[0])
  const summary = useDashboardSummary(gastos, sortedMonths, selectedMonth)
  const { monthItems, paid, pending, total, totalPaid, totalPending, paidPercent, monthlyTotals, maxMonthly, topExpenses } = summary

  return (
    <main className="shell">
      <DashboardHeader {...{ months: sortedMonths, selectedMonth, setSelectedMonth, syncStatus, lastUpdated, error, loading, recarregar }} />
      <section className="metrics-grid" aria-label="Resumo financeiro">
        <MetricCard label="Total do mês" value={loading && !gastos.length ? 'Carregando…' : money.format(total)} hint={`${monthItems.length} despesas`} tone="primary" />
        <MetricCard label="Pago" value={money.format(totalPaid)} hint={`${paid.length} itens quitados`} tone="positive" />
        <MetricCard label="Pendente" value={money.format(totalPending)} hint={`${pending.length} itens em aberto`} tone={totalPending > 0 ? 'warning' : 'default'} />
        <MetricCard label="Quitado" value={`${paidPercent}%`} hint="Proporção financeira do mês" />
      </section>
      <MonthOverview {...{ paidPercent, totalPaid, totalPending, total, topExpenses, loading }} />
      <MonthlyChart {...{ monthlyTotals, maxMonthly, selectedMonth, setSelectedMonth, loading, recarregar }} />
      <ExpensesTable {...{ selectedMonth, monthItems, loading }} />
    </main>
  )
}
