import React from 'react'

export default function Topbar(){
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <input placeholder="Search accounts, agents, calls..." className="bg-white/5 p-2 rounded-lg w-96 text-sm text-slate-200" />
        <div className="text-sm text-slate-400">Jan–Mar 2026</div>
      </div>
      <div className="flex items-center gap-4">
        <button className="secondary-btn">Export</button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium">Alex Morgan</div>
            <div className="text-xs text-slate-400">Manager</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">AM</div>
        </div>
      </div>
    </div>
  )
}
