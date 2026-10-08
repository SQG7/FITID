# FITID

Sistema de academia inteligente desenvolvido como TCC do curso de Desenvolvimento de Sistemas da Etec de Hortolândia.

O FITID utiliza RFID para identificar o aluno em uma estação de treino, localizar um exercício compatível com o aparelho, apresentar as informações do treino e registrar o histórico de uso. O projeto também possui painel administrativo, área do aluno, lotação pública e integração planejada com hardware físico baseado em ESP32-S3.

## Equipe

- Gustavo Squisatti Silva
- Giovanne Vieira Reinaldi
- Caleb Costa Jorge
- Fabricio De Campos Costa

## Estado atual

Este repositório representa o baseline oficial atual do projeto.

- Web: React + Vite + TypeScript
- Mobile: React Native + Expo + TypeScript
- Backend: Node.js + Express + Socket.IO
- Banco atual: MySQL
- Autenticação: Firebase Authentication
- Hardware: ESP32-S3 N16R8 + RC522; display ST7796U/FT6336U em integração

Firestore é uma possibilidade futura e ainda não substitui o MySQL neste baseline.

## Estrutura

```text
FITID/
├── backend/        API, Socket.IO e Web legada
├── web/            aplicação React/Vite
├── mobile/         aplicação Expo/React Native
├── database/       script MySQL
├── firmware/       firmware e diagnósticos do ESP32
├── docs/           arquitetura, hardware e roadmap
└── scripts/windows scripts auxiliares para desenvolvimento local
```

## Configuração

### 1. Banco de dados

Importe `database/fitid.sql` no MySQL.

Copie:

```text
backend/.env.example -> backend/.env
```

Preencha a senha do seu MySQL e altere `SESSION_SECRET`.

### 2. Backend

```bash
cd backend
npm install
npm start
```

API local: `http://localhost:3000`.

### 3. Web

Copie:

```text
web/.env.example -> web/.env.local
```

Preencha as variáveis do mesmo projeto Firebase usado no Mobile.

```bash
cd web
npm install
npm run dev
```

Web local: `http://localhost:5173`.

### 4. Mobile

Copie:

```text
mobile/.env.example -> mobile/.env.development
```

Preencha as variáveis do Firebase.

```bash
cd mobile
npm install
npx expo start
```

## Segurança

Arquivos `.env`, dependências, builds e caches não são versionados. Os arquivos `.env.example` contêm apenas placeholders e podem ser publicados.

Nunca publique senhas do MySQL, segredos de sessão ou arquivos locais de configuração.

## Hardware

A ESP32-S3 N16R8 já foi validada em testes de Flash, PSRAM, Wi-Fi e USB. O próximo passo físico é integrar o RC522 e validar a leitura real das tags RFID. Consulte `docs/HARDWARE.md`.

## Documentação

- `docs/ARQUITETURA.md`
- `docs/HARDWARE.md`
- `docs/ROADMAP.md`
- `docs/DECISOES.md`

## Observação

Os diretórios `FITID-WEB` e `FITID-MOBILE` existentes anteriormente no GitHub correspondem à atividade escolar Web/Mobile V2. O desenvolvimento consolidado passa a continuar neste repositório principal.
