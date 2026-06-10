'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ profile }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: profile.name || '',
    title: profile.title || '',
    bio: profile.bio || '',
    github: profile.github || '',
    linkedin: profile.linkedin || '',
    website: profile.website || '',
    location: profile.location || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const res = await fetch('/api/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    if (res.ok) {
      setMessage('Profile saved!')
      router.refresh()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('Failed to save.')
    }
  }

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input type="text" required className={inputClass}
            value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your Name" />
        </div>
        <div>
          <label className={labelClass}>Professional Title</label>
          <input type="text" className={inputClass}
            value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Full Stack Developer" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea rows={4} className={inputClass}
          value={form.bio} onChange={e => update('bio', e.target.value)}
          placeholder="Tell visitors about yourself..." />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Location</label>
          <input type="text" className={inputClass}
            value={form.location} onChange={e => update('location', e.target.value)} placeholder="City, Country" />
        </div>
        <div>
          <label className={labelClass}>Website</label>
          <input type="url" className={inputClass}
            value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://yoursite.com" />
        </div>
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input type="url" className={inputClass}
            value={form.github} onChange={e => update('github', e.target.value)} placeholder="https://github.com/username" />
        </div>
        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input type="url" className={inputClass}
            value={form.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
        {message && <span className="text-green-400 text-sm">{message}</span>}
      </div>
    </form>
  )
}
