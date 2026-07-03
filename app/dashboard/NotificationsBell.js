'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString + 'Z').getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const ref = useRef()

  const load = useCallback(async () => {
    const res = await fetch('/api/notifications')
    if (res.ok) {
      const data = await res.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
    setUnreadCount(0)
    await fetch('/api/notifications', { method: 'PATCH' })
  }

  async function markOneRead(id) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: 1 } : n)))
    setUnreadCount(prev => Math.max(0, prev - 1))
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 transition">
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 px-4 py-6 text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-slate-500 px-4 py-6 text-center">No notifications yet</p>
          ) : (
            <ul>
              {notifications.map(n => (
                <li
                  key={n.id}
                  onClick={() => !n.is_read && markOneRead(n.id)}
                  className={`px-4 py-3 border-b border-slate-700/60 last:border-0 cursor-pointer transition ${
                    n.is_read ? 'opacity-60' : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      {n.message && <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>}
                      <p className="text-xs text-slate-500 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
