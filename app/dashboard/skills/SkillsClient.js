'use client'
import { useState } from 'react'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'General']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const emptyForm = { name: '', category: 'General', level: 'Intermediate' }

export default function SkillsClient({ initialSkills }) {
  const [skills, setSkills] = useState(initialSkills)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function startEdit(skill) {
    setForm({ name: skill.name, category: skill.category, level: skill.level })
    setEditId(skill.id)
    setShowForm(true)
    setError('')
  }

  function cancelForm() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = editId ? `/api/skills/${editId}` : '/api/skills'
    const method = editId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Failed to save skill')
      return
    }

    if (editId) {
      setSkills(prev => prev.map(s => s.id === editId ? data : s))
    } else {
      setSkills(prev => [...prev, data].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)))
    }

    cancelForm()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this skill?')) return
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    if (res.ok) setSkills(prev => prev.filter(s => s.id !== id))
  }

  // Group by category
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  const levelColors = {
    'Expert': 'bg-green-600',
    'Advanced': 'bg-blue-600',
    'Intermediate': 'bg-yellow-600',
    'Beginner': 'bg-slate-600',
  }

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"

  return (
    <div className="space-y-6">
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="font-semibold mb-5 text-lg">{editId ? 'Edit Skill' : 'New Skill'}</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className={labelClass}>Skill Name *</label>
              <input type="text" required className={inputClass}
                value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. React" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={form.category} onChange={e => update('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select className={inputClass} value={form.level} onChange={e => update('level', e.target.value)}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold px-5 py-2 rounded-lg transition text-sm">
              {loading ? 'Saving...' : (editId ? 'Update Skill' : 'Add Skill')}
            </button>
            <button type="button" onClick={cancelForm}
              className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg transition text-sm">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm) }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-5 py-2.5 rounded-lg transition text-sm"
        >
          + Add Skill
        </button>
      )}

      {skills.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg mb-2">No skills yet</p>
          <p className="text-sm">Click "Add Skill" to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-cyan-400 font-semibold mb-4">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {catSkills.map(skill => (
                <div key={skill.id}
                  className="bg-slate-700 rounded-lg px-3 py-2 flex items-center gap-2 group">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded text-white ${levelColors[skill.level] || 'bg-slate-600'}`}>
                    {skill.level}
                  </span>
                  <div className="hidden group-hover:flex gap-1 ml-1">
                    <button onClick={() => startEdit(skill)}
                      className="text-xs text-slate-400 hover:text-white transition">✎</button>
                    <button onClick={() => handleDelete(skill.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
