# Ponte Sanguínea - Infraestrutura Nacional de Emergência

Este documento detalha a visão técnica e o roteiro para transformar a Ponte Sanguínea em uma ferramenta de infraestrutura pública para Angola.

## 1. Visão de Produto
- **Estilo**: Emergência civil (rápido, humano, social).
- **Modelo**: Similar a Uber/Bolt/WhatsApp.
- **Objetivo**: Conectar doadores a necessidades críticas com geolocalização e prioridade real.

## 2. Arquitetura Técnica (MVP)
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React (ícones).
- **Backend/DB**: Supabase (Auth, PostgreSQL, Realtime).
- **Mapas**: Leaflet ou Google Maps API (para o Dashboard de Emergência).
- **Geolocalização**: Browser Geolocation API + PostGIS (no Supabase) para matching por distância.

## 3. Esquema de Dados (Tabelas Supabase)

### `profiles` (Doadores e Administradores)
- `id`: uuid (PK)
- `full_name`: text
- `blood_type`: enum (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `location`: geography(POINT)
- `phone`: text (verificado)
- `is_verified`: boolean
- `role`: enum (donor, hospital, admin)

### `blood_requests` (Pedidos)
- `id`: uuid (PK)
- `hospital_id`: uuid (FK profiles)
- `blood_type`: enum
- `priority`: enum (CRITICAL, URGENT, NORMAL)
- `status`: enum (PENDING, VERIFIED, IN_PROGRESS, FULFILLED, CLOSED)
- `description`: text
- `location`: geography(POINT)
- `created_at`: timestamp

### `donations_log`
- `id`: uuid (PK)
- `request_id`: uuid (FK blood_requests)
- `donor_id`: uuid (FK profiles)
- `status`: enum (COMMITTED, COMPLETED, CANCELLED)

## 4. Funcionalidades Detalhadas

### 4.1 Sistema de Prioridade
- **CRÍTICO**: Vermelho pulsante, topo da lista, notificações imediatas. (Ex: Acidentes, Maternidade Crítica).
- **URGENTE**: Laranja, destaque médio. (Ex: Cirurgias urgentes).
- **NORMAL**: Azul/Verde, pedidos programados. (Ex: Anemia crônica).

### 4.2 Geolocalização (Matching)
- Uso de `ST_DWithin` no Postgres para encontrar doadores num raio de X km.
- Cálculo de tempo estimado baseado em tráfego (referência: Luanda 5km = 1h30).

### 4.3 Anti-Fraude
- Validação de telefone via OTP.
- Verificação manual de hospitais.
- Limite de pedidos por hospital/dia para evitar spam.

## 5. Próximos Passos
1. Setup do projeto Next.js.
2. Configuração do Supabase e Tabelas.
3. UI do Dashboard "Modo Emergência".
