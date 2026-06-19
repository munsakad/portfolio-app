'use client'
import { useState, useRef } from 'react'
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
    avatar_url: profile.avatar_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || '')
  const fileRef = useRef()

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setMessage('')
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) { setMessage(data.error || 'Upload failed'); return }
    setAvatarPreview(data.url)
    update('avatar_url', data.url)
  }

  function removeAvatar() {
    setAvatarPreview('')
    update('avatar_url', '')
    if (fileRef.current) fileRef.current.value = ''
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Upload */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Profile Image</h2>
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-600"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-slate-400 text-2xl font-bold">
                {form.name ? form.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className={`inline-flex items-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
            </label>
            {avatarPreview && (
              <button type="button" onClick={removeAvatar}
                className="block text-xs text-red-400 hover:text-red-300 transition">
                Remove photo
              </button>
            )}
            <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
        <h2 className="font-semibold">Personal Information</h2>

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
          <label className={labelClass}>About / Bio</label>
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

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving || uploading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          {message && (
            <span className={message.includes('aved') ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
              {message}
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
