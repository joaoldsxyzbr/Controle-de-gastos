export default function MetricCard({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-topline">
        <span>{label}</span>
        <i />
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}
