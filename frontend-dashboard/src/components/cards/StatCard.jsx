import React from 'react'

export default function StatCard({ title, value, note }){
  return (
    <div className="bg-white/5 rounded-xl p-4 shadow-sm">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
      {note && <div className="text-xs text-slate-400 mt-1">{note}</div>}
    </div>
  )
}
