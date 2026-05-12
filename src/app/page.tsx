'use client'

import Link from 'next/link'
import { Droplet, Shield, MapPin, Share2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header / Nav */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Droplet className="text-red-600" fill="currentColor" />
          <span className="font-black text-xl tracking-tighter uppercase">Ponte Sanguínea</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-bold hover:text-red-600 transition-all">ENTRAR</Link>
          <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-red-700 transition-all">
            QUERO AJUDAR
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
          A infraestrutura nacional de <span className="text-red-600 underline">emergência</span> para Angola.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Conectando doadores a hospitais em tempo real. Porque em Luanda, 5km podem ser 1h30 de trânsito. O sangue não pode esperar.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/dashboard" className="bg-black text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all">
            VER PAINEL EM TEMPO REAL
          </Link>
          <Link href="/login" className="border-2 border-black text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all">
            CADASTRAR HOSPITAL
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="text-red-600" />
            </div>
            <h3 className="font-black uppercase tracking-tight">Prioridade Real</h3>
            <p className="text-gray-500 text-sm">Separamos o que é crônico do que é vida ou morte. Casos de acidente e maternidade têm o topo da fila.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="text-red-600" />
            </div>
            <h3 className="font-black uppercase tracking-tight">Geolocalização</h3>
            <p className="text-gray-500 text-sm">Matching por distância real. Alertamos doadores que estão a menos de 5km de uma necessidade crítica.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Share2 className="text-red-600" />
            </div>
            <h3 className="font-black uppercase tracking-tight">Impacto Social</h3>
            <p className="text-gray-500 text-sm">Integração viral com WhatsApp para que a rede de emergência se espalhe mais rápido que o problema.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-xs font-mono">
        PONTE SANGUÍNEA • ANGOLA • {new Date().getFullYear()}
      </footer>
    </div>
  )
}
