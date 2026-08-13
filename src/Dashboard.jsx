import { useMemo, useState } from 'react'
import DashboardHeader from './components/DashboardHeader'
import ExpensesTable from './components/ExpensesTable'
import FinancialKpis from './components/FinancialKpis'
import MonthOverview from './components/MonthOverview'
import MonthlyChart from './components/MonthlyChart'
import { useDashboardSummary } from './hooks/useDashboardSummary'
import { MONTH_TABLES, useGastos } from './hooks/useGastos'
import { chronological } from './utils/month'

export default function Dashboard() {
  const { gastos, loading, error, syncStatus, lastUpdated, recarregar } = useGastos()
  const sortedMonths = useMemo(() => [...MONTH_TABLES].sort(chronological), [])
  const [selectedMonth, setSelectedMonth] = useState(sortedMonths[0])
  const summary = useDashboardSummary(gastos, sortedMonths, selectedMonth)
  const { monthItems, total, totalPaid, totalPending, paidPercent, monthlyTotals, maxMonthly, topExpenses } = summary

  return (
    <main className="shell">
      <DashboardHeader {...{ months: sortedMonths, selectedMonth, setSelectedMonth, syncStatus, lastUpdated, error, loading, recarregar }} />
      <FinancialKpis total={total} expenseCount={monthItems.length} loading={loading && !gastos.length} />
      <MonthOverview {...{ paidPercent, totalPaid, totalPending, total, topExpenses, loading }} />
      <MonthlyChart {...{ monthlyTotals, maxMonthly, selectedMonth, setSelectedMonth, loading, recarregar }} />
      <ExpensesTable {...{ selectedMonth, monthItems, loading }} />
    </main>
  )
}
