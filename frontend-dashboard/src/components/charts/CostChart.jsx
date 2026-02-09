import React from 'react'
import { LineChart } from 'recharts'

export default function CostChart({ data }){
  return (
    <div style={{ height: 200 }}>
      <LineChart width={600} height={200} data={data}>
      </LineChart>
    </div>
  )
}
