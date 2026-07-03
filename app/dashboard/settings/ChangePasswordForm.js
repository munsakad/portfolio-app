'use client'
import { useState } from 'react'

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setSaving(true)
    const res = await fetch('/api/portfolio/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    })
    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      setMessage('Password updated successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setMessage(''), 3000)
    } else {
      setError(data.error || 'Failed to update password.')
    }
  }

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 max-w-lg">
      <h2 className="font-semibold">Change Password</h2>

      <div>
        <label className={labelClass}>Current Password</label>
        <input type="password" required className={inputClass}
          value={form.currentPassword} onChange={e => update('currentPassword', e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>New Password</label>
        <input type="password" required minLength={6} className={inputClass}
          value={form.newPassword} onChange={e => update('newPassword', e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Confirm New Password</label>
        <input type="password" required minLength={6} className={inputClass}
          value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition">
          {saving ? 'Updating...' : 'Update Password'}
        </button>
        {message && <span className="text-green-400 text-sm">{message}</span>}
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </div>
    </form>
  )
}
