import { useEffect, useState } from 'react'
import App from '../App'
import { supabase, supabaseConfigured } from '../lib/supabase'

export default function AuthGate() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function validateSession() {
      if (!supabaseConfigured) {
        setSession(null)
        setError('Supabase não configurado.')
        return
      }

      const { data } = await supabase.auth.getSession()
      const localSession = data.session

      if (!localSession) {
        if (active) setSession(null)
        return
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (active) setSession(localSession)
        return
      }

      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (!active) return

      if (userError || !userData.user) {
        await supabase.auth.signOut({ scope: 'local' })
        setSession(null)
        return
      }

      setSession(localSession)
    }

    validateSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active || event === 'INITIAL_SESSION') return
      setSession(nextSession ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function login(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (loginError) {
      setError(
        typeof navigator !== 'undefined' && !navigator.onLine
          ? 'Sem conexão. Verifique sua internet.'
          : 'E-mail ou senha incorretos.',
      )
      setPassword('')
    }

    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut({ scope: 'local' })
  }

  if (session === undefined) {
    return <main className="auth-page"><div className="auth-loading">Verificando acesso…</div></main>
  }

  if (!session) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-mark">G</div>
          <p className="eyebrow">ACESSO PRIVADO</p>
          <h1 className="auth-title">Controle de Gastos</h1>
          <p className="auth-copy">Entre com seu e-mail e senha para visualizar o painel financeiro.</p>

          <form className="auth-form" onSubmit={login}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              autoFocus
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            {error && <p className="auth-error" role="alert">{error}</p>}
            <button type="submit" disabled={loading || !email.trim() || !password}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <>
      <App />
      <button className="logout-button" type="button" onClick={logout}>Sair</button>
    </>
  )
}
