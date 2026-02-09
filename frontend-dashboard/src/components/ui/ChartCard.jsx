import React from 'react'
import GlassCard from './GlassCard'

export default function ChartCard({ title, children }){
  return (
    <GlassCard className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
      </div>
      <div className="h-64">{children}</div>
    </GlassCard>
  )
}
