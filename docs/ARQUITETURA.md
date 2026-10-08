# Arquitetura atual do FITID

## Visão geral

O FITID é um sistema de academia inteligente que combina aplicação Web, aplicação Mobile, backend, banco de dados e hardware RFID.

```text
Aluno com RFID
      |
      v
ESP32-S3 + RC522 + display
      |
      v
API Node.js / Express / Socket.IO
      |
      v
MySQL
      ^
      |
Web React ---------------- Mobile Expo
      \_______ Firebase Authentication ______/
```

## Componentes atuais

### Web
React + Vite + TypeScript. Inclui painel administrativo, cadastros, treinos, histórico, estatísticas, lotação pública, simulador RFID, tela do aparelho e autenticação Firebase.

### Mobile
React Native + Expo + TypeScript. A versão atual implementa autenticação Firebase, criação de conta, rotas protegidas, perfil, tela inicial, Sobre e logout. A integração com dados de treino/histórico ainda é futura.

### Backend
Node.js + Express + Socket.IO. Mantém a lógica central do projeto, sessões administrativas, regras de academia, uso dos aparelhos, histórico e comunicação em tempo real.

### Banco atual
MySQL. O modelo atual continua sendo a fonte de dados oficial do FITID.

### Autenticação
Firebase Authentication por e-mail e senha, compartilhado entre Web e Mobile.

## Observação sobre Firestore

Firestore está em avaliação como evolução futura para facilitar publicação e recursos em tempo real. Ele ainda não substitui o MySQL neste baseline e qualquer migração deverá preservar as regras de negócio e o modelo conceitual já validado.
