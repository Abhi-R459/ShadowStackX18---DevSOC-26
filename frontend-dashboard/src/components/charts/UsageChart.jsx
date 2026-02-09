import React from 'react'
import { LineChart } from '@tremor/react'

export default function UsageChart({ data }){
  return (
    <div>
      <LineChart
        data={data}
        index="date"
        categories={["rows_read"]}
        colors={["blue"]}
        className="h-52"
      />
    </div>
  )
}
