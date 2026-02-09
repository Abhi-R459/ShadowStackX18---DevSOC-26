import React from 'react'
import GlassCard from './GlassCard'

export default function KPI({ title, value, className='' }){
  return (
    <GlassCard className={`kpi ${className}`}>
      <div style={{color:'#94a3b8', fontSize:12}}>{title}</div>
      <div className="value">{value}</div>
    </GlassCard>
  )
}
