'use client'
import { useState, useRef } from 'react'

const empty = { title: '', description: '', tech_stack: '', live_url: '', github_url: '', image_url: '' }

export default function ProjectsClient({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  const fileRef = useRef()

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function startEdit(project) {
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      live_url: project.live_url,
      github_url: project.github_url,
      image_url: project.image_url || '',
    })
    setPreview(project.image_url || '')
    setEditId(project.id)
    setShowForm(true)
    setError('')
  }

  function cancelForm() {
    setForm(empty)
    setEditId(null)
    setShowForm(false)
    setError('')
    setPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) { setError(data.error || 'Upload failed'); return }
    setPreview(data.url)
    update('image_url', data.url)
  }

  function removeImage() {
    setPreview('')
    update('image_url', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = editId ? `/api/projects/${editId}` : '/api/projects'
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Failed to save project'); return }
    if (editId) {
      setProjects(prev => prev.map(p => p.id === editId ? data : p))
    } else {
      setProjects(prev => [data, ...prev])
    }
    cancelForm()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) setProjects(prev => prev.filter(p => p.id !== id))
  }

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"

  return (
    <div className="space-y-6">
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="font-semibold mb-5 text-lg">{editId ? 'Edit Project' : 'New Project'}</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input type="text" required className={inputClass}
                value={form.title} onChange={e => update('title', e.target.value)} placeholder="Project name" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea rows={3} className={inputClass}
                value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="What does this project do?" />
            </div>
            <div>
              <label className={labelClass}>Tech Stack</label>
              <input type="text" className={inputClass}
                value={form.tech_stack} onChange={e => update('tech_stack', e.target.value)}
                placeholder="e.g. React, Node.js, PostgreSQL (comma-separated)" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Live URL</label>
                <input type="url" className={inputClass}
                  value={form.live_url} onChange={e => update('live_url', e.target.value)} placeholder="https://" />
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input type="url" className={inputClass}
                  value={form.github_url} onChange={e => update('github_url', e.target.value)} placeholder="https://github.com/..." />
              </div>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className={labelClass}>Screenshot / Preview Image</label>
              {preview ? (
                <div className="relative w-full rounded-lg overflow-hidden border border-slate-600">
                  <img src={preview} alt="Preview" className="w-full max-h-48 object-cover" />
                  <button type="button" onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-lg transition">
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-cyan-500 transition">
                  {uploading ? (
                    <span className="text-slate-400 text-sm">Uploading...</span>
                  ) : (
                    <>
                      <span className="text-slate-400 text-sm mb-1">Click to upload a screenshot</span>
                      <span className="text-slate-500 text-xs">PNG, JPG, WEBP up to 5MB</span>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={handleImageChange} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={loading || uploading}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold px-5 py-2 rounded-lg transition text-sm">
              {loading ? 'Saving...' : (editId ? 'Update Project' : 'Add Project')}
            </button>
            <button type="button" onClick={cancelForm}
              className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg transition text-sm">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); setPreview('') }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-5 py-2.5 rounded-lg transition text-sm">
          + Add Project
        </button>
      )}

      {projects.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg mb-2">No projects yet</p>
          <p className="text-sm">Click "Add Project" to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            {project.image_url && (
              <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                  {project.description && (
                    <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                  )}
                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tech_stack.split(',').map(t => t.trim()).filter(Boolean).map(tech => (
                        <span key={tech} className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">{tech}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" className="text-xs text-cyan-400 hover:underline">Live Demo ↗</a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" className="text-xs text-slate-400 hover:text-slate-200 hover:underline">GitHub ↗</a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(project)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition">Edit</button>
                  <button onClick={() => handleDelete(project.id)}
                    className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
