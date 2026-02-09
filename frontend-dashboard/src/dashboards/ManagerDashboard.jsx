import React, { useEffect, useState } from 'react'
import EmptyState from '../components/dashboard/EmptyState'
import ProgressCard from '../components/cards/ProgressCard'
import UsageChart from '../components/charts/UsageChart'
import callBackend from '../services/api'

export default function ManagerDashboard(){
  const [hasData, setHasData] = useState(false)
  const [usageData, setUsageData] = useState([])

  useEffect(()=>{
    let mounted = true
    callBackend('/analytics/overview','GET')
      .then(res => {
        if(!mounted) return
        if (res && res.hasData) {
          setHasData(true)
          // Backend endpoints for usage/costs will be wired later; keep arrays empty until provided
          setUsageData([])
        } else {
          setHasData(false)
        }
      }).catch(()=>{
        if(mounted) setHasData(false)
      })

    return ()=> mounted = false
  },[])

  if (!hasData) return (
    <div className="p-6">
      <EmptyState />
    </div>
  )

  // When data exists, the real charts will render using backend data.
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Current billing cycle</h1>

      <div className="grid grid-cols-3 gap-6">
        <ProgressCard title="Usage" value={0} total={100} label="of allowed capacity" />
        <ProgressCard title="Workspace" value={0} total={100} label="weekly active users" />
        <ProgressCard title="Costs" value={0} total={500} label="current billing cycle" />
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <h2 className="font-medium mb-4">Overview</h2>
        <UsageChart data={usageData} />
      </div>
    </div>
  )
}
