'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AlertTriangle, MapPin, Activity, Droplet, Navigation, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useGeolocation, calculateDistance } from '@/utils/geo'

export default function DashboardPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { location, error: geoError } = useGeolocation()
  const supabase = createClient()

  const shareOnWhatsApp = (req: any) => {
    const message = `🚨 *PEDIDO DE EMERGÊNCIA - PONTE SANGUÍNEA* 🚨

🩸 *Tipo Sanguíneo:* ${req.blood_type}
🏥 *Hospital:* ${req.hospital_name_manual}
⚠️ *Prioridade:* ${req.priority}
📍 *Localização:* Luanda, Angola

"${req.description || 'Necessidade urgente de doadores.'}"

👉 *Acesse o painel para ajudar:* ${window.location.origin}/dashboard

*Ponte Sanguínea - Infraestrutura Nacional de Emergência*`
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    fetchRequests()

    // Real-time subscription
    const channel = supabase
      .channel('blood_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, () => {
        fetchRequests()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .order('priority', { ascending: false }) // Idealmente ter uma ordem customizada
      .order('created_at', { ascending: false })

    if (!error && data) setRequests(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header Estilo Centro de Operações */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            MODO EMERGÊNCIA NACIONAL
          </h1>
          <p className="text-zinc-500 text-sm font-mono uppercase">Angola • Painel de Monitorização em Tempo Real</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link 
            href="/requests/new"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-bold text-sm transition-all"
          >
            + NOVO PEDIDO CRÍTICO
          </Link>
          <button className="border border-zinc-700 hover:bg-zinc-900 px-6 py-2 rounded-md font-bold text-sm transition-all">
            FILTRAR MAPA
          </button>
        </div>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pedidos Ativos', val: requests.length, color: 'text-red-500', icon: Droplet },
          { label: 'Doadores Próximos', val: '1.2k', color: 'text-green-500', icon: MapPin },
          { label: 'Hospitais Críticos', val: '4', color: 'text-orange-500', icon: AlertTriangle },
          { label: 'Salvo Hoje', val: '12', color: 'text-blue-500', icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <p className="text-zinc-500 text-xs font-bold uppercase">{stat.label}</p>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-2xl font-black mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Content: Lista de Pedidos (Estilo Uber/Bolt) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-zinc-400 text-xs font-black uppercase mb-4 tracking-widest">Fluxo de Necessidades Ativas</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-xl" />)}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-600 font-mono">Nenhum pedido ativo no momento.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div 
                key={req.id} 
                className={`group bg-zinc-900 border-l-4 p-5 rounded-r-xl transition-all hover:bg-zinc-850 ${
                  req.priority === 'CRITICAL' ? 'border-red-600 bg-red-950/10' : 
                  req.priority === 'URGENTE' ? 'border-orange-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-black ${
                      req.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {req.blood_type}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none">{req.hospital_name_manual || 'Hospital Central'}</h3>
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mt-2 uppercase font-mono">
                        <MapPin size={12} />
                        <span>
                          {location && req.latitude && req.longitude 
                            ? `~${calculateDistance(location.lat, location.lng, req.latitude, req.longitude).toFixed(1)}km de distância`
                            : 'Luanda • Localização aproximada'}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm mt-3 line-clamp-1">{req.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                      req.priority === 'CRITICAL' ? 'bg-red-600/20 text-red-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {req.priority}
                    </span>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => shareOnWhatsApp(req)}
                        className="text-[9px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition-all flex items-center gap-1"
                      >
                        <Share2 size={10} />
                        PARTILHAR
                      </button>
                      
                      <button 
                        onClick={async () => {
                          const { error } = await supabase
                            .from('blood_requests')
                            .update({ status: 'FULFILLED' })
                            .eq('id', req.id)
                          if (!error) fetchRequests()
                        }}
                        className="text-[9px] font-bold bg-green-600/10 text-green-500 border border-green-600/30 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition-all"
                      >
                        MARCAR ATENDIDO
                      </button>
                    </div>
                    
                    <p className="text-zinc-600 text-[10px] mt-1 font-mono">
                      {new Date(req.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar: Mapa Fake / Insights */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden aspect-square relative">
            <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/identicon/svg?seed=map')] opacity-10 bg-cover" />
            <div className="absolute inset-0 flex items-center justify-center flex-col p-8 text-center">
              <MapPin size={40} className="text-red-600 mb-4 animate-bounce" />
              <h4 className="font-bold uppercase tracking-tight">Mapa Nacional</h4>
              <p className="text-zinc-500 text-xs mt-2">Integração de geolocalização em tempo real ativa.</p>
              <button className="mt-6 text-[10px] font-bold border border-zinc-700 px-4 py-2 rounded uppercase hover:bg-white hover:text-black transition-all">
                Expandir Visão Operacional
              </button>
            </div>
          </div>
          
          <div className="bg-red-600/10 border border-red-900/50 p-6 rounded-xl">
            <h4 className="text-red-500 text-xs font-black uppercase mb-2">Infraestrutura Anti-Fraude</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Todos os pedidos passam por verificação hospitalar. Pedidos atendidos são removidos em tempo real para manter a rede eficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
