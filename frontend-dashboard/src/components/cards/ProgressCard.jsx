import React from 'react'
import { ProgressBar, Text } from '@tremor/react'

export default function ProgressCard({ title, value, total, label }){
  const pct = total ? (value / total) * 100 : 0
  return (
    <div className="bg-white/5 rounded-xl p-4 shadow-sm">
      <Text className="text-slate-400">{title}</Text>
      <div className="flex items-baseline gap-2 mt-1">
        <div className="text-xl font-semibold">{value}</div>
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} className="mt-2" />
      </div>
      <Text className="text-xs text-slate-400 mt-1">{label}</Text>
    </div>
  )
}
