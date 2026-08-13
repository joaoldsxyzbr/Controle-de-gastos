import { money } from '../utils/money'

export default function MonthOverview({ paidPercent, totalPaid, totalPending, total, topExpenses, loading }) {
  return (
    <section className="dashboard-grid">
      <article className="card progress-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SITUAÇÃO DO MÊS</span>
            <h2>Pago x pendente</h2>
          </div>
          <span className="readonly-badge">Somente leitura</span>
        </div>

        <div className="donut-layout">
          <div className="donut" style={{ '--paid-angle': `${paidPercent * 3.6}deg` }}>
            <div><strong>{paidPercent}%</strong><span>pago</span></div>
          </div>
          <div className="legend-stack">
            <div className="legend-row paid"><span /><div><small>Pago</small><strong>{money.format(totalPaid)}</strong></div></div>
            <div className="legend-row pending"><span /><div><small>Pendente</small><strong>{money.format(totalPending)}</strong></div></div>
            <div className="legend-row neutral"><span /><div><small>Total</small><strong>{money.format(total)}</strong></div></div>
          </div>
        </div>
      </article>

      <article className="card top-card">
        <div className="section-heading">
          <div><span className="eyebrow">MAIORES VALORES</span><h2>Top despesas</h2></div>
        </div>
        <div className="top-expenses">
          {topExpenses.map((item, index) => (
            <div className="top-expense" key={`${item.mes}-${item.id}`}>
              <span className="rank">{String(index + 1).padStart(2, '0')}</span>
              <div className="top-expense-copy">
                <strong>{item.descricao}</strong>
                <span className={`status-chip status-chip--${item.status}`}>{item.status || 'sem status'}</span>
              </div>
              <b>{money.format(item.valor)}</b>
            </div>
          ))}
          {!topExpenses.length && !loading && <div className="empty-compact">Nenhuma despesa neste mês.</div>}
        </div>
      </article>
    </section>
  )
}
