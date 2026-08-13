import { monthLabel } from '../utils/month'

const syncLabels = {
  synced: 'Sincronizado',
  connecting: 'Conectando',
  offline: 'Offline',
  error: 'Sincronização indisponível',
}

export default function DashboardHeader({ months, selectedMonth, setSelectedMonth, syncStatus, lastUpdated, error, loading, recarregar }) {
  const updatedTitle = lastUpdated
    ? `Última atualização: ${new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(lastUpdated)}`
    : 'Aguardando primeira atualização'

  return (
    <>
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">PAINEL FINANCEIRO</p>
          <h1>Controle de Gastos</h1>
          <p className="subtitle">Visão limpa do que saiu, do que falta e do que vem pela frente.</p>
        </div>
        <div className="topbar-actions">
          <label className="month-select">
            <span>Mês</span>
            <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
              {months.map((mes) => <option value={mes} key={mes}>{monthLabel(mes)}</option>)}
            </select>
          </label>
          <div className={`status-wrap status-wrap--${syncStatus}`} title={updatedTitle} aria-live="polite">
            <span className="status-dot" />
            <span>{syncLabels[syncStatus] ?? 'Conectando'}</span>
          </div>
        </div>
      </header>
      {error && (
        <section className={`notice ${syncStatus === 'offline' ? 'offline' : 'error'}`}>
          <div>
            <strong>{syncStatus === 'offline' ? 'Sem conexão.' : 'Não foi possível atualizar o Supabase.'}</strong>
            <p>{error}</p>
          </div>
          <button onClick={() => recarregar()} disabled={loading}>Tentar novamente</button>
        </section>
      )}
    </>
  )
}
