'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

export default function NewRequestPage() {
  const [bloodType, setBloodType] = useState('')
  const [priority, setPriority] = useState('NORMAL')
  const [description, setDescription] = useState('')
  const [hospitalName, setHospitalName] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Você precisa estar logado para fazer um pedido.')
      router.push('/login')
      return
    }

    const { error } = await supabase.from('blood_requests').insert([
      {
        hospital_id: user.id,
        blood_type: bloodType,
        priority: priority,
        description: description,
        hospital_name_manual: hospitalName,
        status: 'PENDING',
        latitude: location?.lat,
        longitude: location?.lng
      }
    ])

    if (error) {
      console.error(error)
      alert('Erro ao criar pedido: ' + error.message)
    } else {
      alert('Pedido de emergência criado com sucesso!')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-red-100">
          <div className="bg-red-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Novo Pedido de Sangue</h1>
            <p className="text-red-100 text-sm mt-1">Preencha os dados com precisão. Vidas dependem desta informação.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Sistema de Prioridade Real */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-tight">Nível de Prioridade</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPriority('CRITICAL')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    priority === 'CRITICAL' 
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-inner' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-red-200'
                  }`}
                >
                  <AlertCircle className={priority === 'CRITICAL' ? 'animate-pulse' : ''} />
                  <span className="text-xs font-bold mt-2">CRÍTICO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('URGENTE')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    priority === 'URGENTE' 
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-inner' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-orange-200'
                  }`}
                >
                  <Clock />
                  <span className="text-xs font-bold mt-2">URGENTE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('NORMAL')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    priority === 'NORMAL' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-inner' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200'
                  }`}
                >
                  <CheckCircle2 />
                  <span className="text-xs font-bold mt-2">NORMAL</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Sanguíneo Necessário</label>
                <select
                  required
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Selecione...</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Hospital / Unidade</label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="Ex: Hospital Josina Machel"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo / Detalhes (Opcional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Paciente em maternidade, anemia grave..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all ${
                priority === 'CRITICAL' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
              } disabled:opacity-50`}
            >
              {loading ? 'Processando Emergência...' : 'PUBLICAR PEDIDO NACIONAL'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
         </form>
        </div>
      </div>
    </div>
  )
}
