import React from 'react'
import GlassCard from './GlassCard'

export default function KPI({ icon, title, value, change }){
  return (
    <GlassCard className="flex items-start gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gradient-to-br from-white/5 to-white/3">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      <div className="text-sm text-slate-400">{change || '—'}</div>
    </GlassCard>
  )
}
