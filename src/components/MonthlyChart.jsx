import { money } from '../utils/money'
import { monthLabel } from '../utils/month'

export default function MonthlyChart({ monthlyTotals, maxMonthly, selectedMonth, setSelectedMonth, loading, recarregar }) {
  return (
    <section className="card chart-card">
      <div className="section-heading">
        <div><span className="eyebrow">EVOLUÇÃO</span><h2>Total por mês</h2></div>
        <button className="ghost-button" onClick={() => recarregar()} disabled={loading}>
          {loading ? 'Atualizando…' : 'Atualizar dados'}
        </button>
      </div>
      <div className="bar-chart" role="img" aria-label="Gráfico de barras com total de gastos por mês">
        {monthlyTotals.map((item) => (
          <button
            className={`bar-column ${item.mes === selectedMonth ? 'active' : ''}`}
            key={item.mes}
            onClick={() => setSelectedMonth(item.mes)}
            title={`${monthLabel(item.mes)}: ${money.format(item.total)}`}
          >
            <span className="bar-value">{item.total > 0 ? money.format(item.total) : 'R$ 0'}</span>
            <span className="bar-track"><i style={{ height: `${Math.max(item.total > 0 ? 8 : 2, (item.total / maxMonthly) * 100)}%` }} /></span>
            <span className="bar-label">{item.mes.slice(0, 2)}/{item.mes.slice(-2)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
