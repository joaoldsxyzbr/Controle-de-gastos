export function monthLabel(mes) {
  const [mm, yyyy] = mes.split('-').map(Number)
  const date = new Date(yyyy, mm - 1, 1)
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function chronological(a, b) {
  const [ma, ya] = a.split('-').map(Number)
  const [mb, yb] = b.split('-').map(Number)
  return ya * 12 + ma - (yb * 12 + mb)
}
