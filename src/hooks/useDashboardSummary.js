import { useMemo } from 'react'

export function useDashboardSummary(gastos, sortedMonths, selectedMonth) {
  const byMonth = useMemo(() => {
    const map = new Map(sortedMonths.map((mes) => [mes, []]))
    gastos.forEach((gasto) => {
      if (!map.has(gasto.mes)) map.set(gasto.mes, [])
      map.get(gasto.mes).push(gasto)
    })
    return map
  }, [gastos, sortedMonths])

  const monthItems = byMonth.get(selectedMonth) ?? []
  const paid = monthItems.filter((item) => item.status === 'pago')
  const pending = monthItems.filter((item) => item.status === 'pendente')
  const total = monthItems.reduce((sum, item) => sum + item.valor, 0)
  const totalPaid = paid.reduce((sum, item) => sum + item.valor, 0)
  const totalPending = pending.reduce((sum, item) => sum + item.valor, 0)
  const paidPercent = total > 0 ? Math.round((totalPaid / total) * 100) : 0
  const monthlyTotals = sortedMonths.map((mes) => ({
    mes,
    total: (byMonth.get(mes) ?? []).reduce((sum, item) => sum + item.valor, 0),
  }))
  const maxMonthly = Math.max(1, ...monthlyTotals.map((item) => item.total))
  const topExpenses = [...monthItems].sort((a, b) => b.valor - a.valor).slice(0, 5)

  return { monthItems, paid, pending, total, totalPaid, totalPending, paidPercent, monthlyTotals, maxMonthly, topExpenses }
}
