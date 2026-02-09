import React from 'react'

export default function Skeleton({ width='100%', height=12, style={} }){
  return (
    <div style={{ width, height, borderRadius: 6, background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04), rgba(255,255,255,0.02))', ...style }} />
  )
}
