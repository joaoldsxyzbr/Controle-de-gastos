import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export const MONTH_TABLES = [
  '09-2026',
  '10-2026',
  '11-2026',
  '12-2026',
  '01-2027',
  '02-2027',
  '03-2027',
  '04-2027',
]

function isNetworkError(error) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true
  const message = String(error?.message ?? '').toLowerCase()
  return message.includes('failed to fetch') || message.includes('network') || message.includes('load failed')
}

export function useGastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncStatus, setSyncStatus] = useState(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'connecting',
  )
  const [lastUpdated, setLastUpdated] = useState(null)
  const loadingRef = useRef(false)

  const load = useCallback(async ({ silent = false } = {}) => {
    if (loadingRef.current) return

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSyncStatus('offline')
      setError('Sem conexão. Mantendo os últimos dados carregados.')
      setLoading(false)
      return
    }

    loadingRef.current = true
    if (!silent) setLoading(true)
    setError(null)

    try {
      const responses = await Promise.all(
        MONTH_TABLES.map(async (mes) => {
          const { data, error: queryError } = await supabase
            .from(mes)
            .select('id, descrição, valor, status')
            .order('id', { ascending: true })

          return { mes, data, error: queryError }
        }),
      )

      const networkFailure = responses.find(({ error: queryError }) => queryError && isNetworkError(queryError))
      if (networkFailure) {
        setSyncStatus('offline')
        setError('Sem conexão com o Supabase. Mantendo os últimos dados carregados.')
        return
      }

      const unexpectedError = responses.find(({ error: queryError }) => queryError)
      if (unexpectedError) {
        setSyncStatus('error')
        setError(unexpectedError.error.message || 'Não foi possível carregar os gastos.')
      }

      const normalized = responses.flatMap(({ mes, data }) =>
        (data ?? []).map((row) => ({
          mes,
          id: row.id,
          descricao: row['descrição'] ?? '',
          valor: Number(row.valor ?? 0),
          status: String(row.status ?? '').toLowerCase(),
        })),
      )

      setGastos(normalized)
      setLastUpdated(new Date())
      if (!unexpectedError) setSyncStatus('synced')
    } catch (requestError) {
      if (isNetworkError(requestError)) {
        setSyncStatus('offline')
        setError('Sem conexão com o Supabase. Mantendo os últimos dados carregados.')
      } else {
        setSyncStatus('error')
        setError(requestError instanceof Error ? requestError.message : 'Falha inesperada ao carregar os dados.')
      }
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    load()

    const channels = MONTH_TABLES.map((table) =>
      supabase
        .channel(`gastos-readonly-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => load({ silent: true }))
        .subscribe((status) => {
          if (!active) return
          if (status === 'SUBSCRIBED') setSyncStatus('synced')
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setSyncStatus(typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'error')
          }
        }),
    )

    function offline() {
      if (active) setSyncStatus('offline')
    }

    function online() {
      if (!active) return
      setSyncStatus('connecting')
      load({ silent: true })
    }

    window.addEventListener('offline', offline)
    window.addEventListener('online', online)

    return () => {
      active = false
      window.removeEventListener('offline', offline)
      window.removeEventListener('online', online)
      channels.forEach((channel) => supabase.removeChannel(channel))
    }
  }, [load])

  return { gastos, loading, error, syncStatus, lastUpdated, recarregar: load }
}
