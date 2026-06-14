'use client'

import React, { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/queryClient'

export default function PackDropsAdmin() {
  const [packType, setPackType] = useState('tactical')
  const [drops, setDrops] = useState<any[]>([])
  const [toolId, setToolId] = useState('')
  const [weight, setWeight] = useState(100)
  const [name, setName] = useState('')
  const [rarity, setRarity] = useState('common')
  const [loading, setLoading] = useState(false)

  const fetchDrops = async () => {
    setLoading(true)
    try {
      const res = await apiRequest('GET', `/api/admin/gen1/pack-drops?packType=${encodeURIComponent(packType)}`)
      setDrops(res.drops || [])
    } catch (err) {
      console.error(err)
      setDrops([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrops()
  }, [packType])

  const createDrop = async () => {
    setLoading(true)
    try {
      const payload = { packType, toolId, weight: Number(weight), name, rarity }
      await apiRequest('POST', '/api/admin/gen1/pack-drops', payload)
      setToolId('')
      setName('')
      setWeight(100)
      await fetchDrops()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteDrop = async (id: number) => {
    setLoading(true)
    try {
      await apiRequest('DELETE', `/api/admin/gen1/pack-drops/${id}`)
      await fetchDrops()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Pack Drops Admin</h2>
      <div className="mt-2 flex gap-2">
        <input value={packType} onChange={(e) => setPackType(e.target.value)} placeholder="pack type" className="border px-2 py-1" />
        <button onClick={fetchDrops} disabled={loading} className="px-2 py-1 bg-sky-500 text-white rounded">Load</button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <input value={toolId} onChange={(e) => setToolId(e.target.value)} placeholder="tool id" className="border px-2 py-1" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" className="border px-2 py-1" />
        <input value={weight} onChange={(e) => setWeight(Number(e.target.value))} placeholder="weight" type="number" className="border px-2 py-1" />
        <select value={rarity} onChange={(e) => setRarity(e.target.value)} className="border px-2 py-1">
          <option value="common">common</option>
          <option value="rare">rare</option>
          <option value="epic">epic</option>
        </select>
      </div>
      <div className="mt-2">
        <button onClick={createDrop} className="px-3 py-1 bg-emerald-600 text-white rounded">Create Drop</button>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Drops</h3>
        {loading ? <div>Loading...</div> : (
          <ul>
            {drops.map((d: any) => (
              <li key={d.id} className="flex items-center justify-between gap-2 border p-2 my-1">
                <div>
                  <div className="font-bold">{d.name || d.tool_id}</div>
                  <div className="text-sm text-muted-foreground">{d.tool_id} • weight: {d.weight} • {d.rarity}</div>
                </div>
                <div>
                  <button onClick={() => deleteDrop(d.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
