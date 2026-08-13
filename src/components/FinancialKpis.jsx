import MetricCard from './MetricCard'
import { money } from '../utils/money'

const MONTHLY_INCOME = 2900

export default function FinancialKpis({ total, expenseCount, loading }) {
  const balance = MONTHLY_INCOME - total
  const waiting = loading ? 'Carregando…' : null

  return (
    <section className="metrics-grid" aria-label="Resumo financeiro">
      <MetricCard label="Entrada" value={money.format(MONTHLY_INCOME)} hint="Entrada mensal" tone="positive" />
      <MetricCard label="Saída" value={waiting || money.format(total)} hint={`${expenseCount} despesas no mês`} tone="warning" />
      <MetricCard label="Saldo" value={waiting || money.format(balance)} hint="Entrada menos saída" tone={balance >= 0 ? 'positive' : 'warning'} />
    </section>
  )
}
