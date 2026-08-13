import { money } from '../utils/money'
import { monthLabel } from '../utils/month'

export default function ExpensesTable({ selectedMonth, monthItems, loading }) {
  return (
    <section className="card expenses-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{selectedMonth}</span>
          <h2>Despesas de {monthLabel(selectedMonth)}</h2>
        </div>
        <span className="count-badge">{monthItems.length} registros</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>
            {monthItems.map((item) => (
              <tr key={`${item.mes}-${item.id}`}>
                <td><strong>{item.descricao}</strong></td>
                <td className="money-cell">{money.format(item.valor)}</td>
                <td><span className={`status-chip status-chip--${item.status}`}>{item.status || 'sem status'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!monthItems.length && !loading && <div className="empty">Nenhuma despesa encontrada para este mês.</div>}
      </div>
    </section>
  )
}
