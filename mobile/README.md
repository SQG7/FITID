# FITID Mobile — Área do Aluno

Aplicação Mobile simples do FITID, criada para a atividade de PAM II com React Native + Expo + TypeScript.

## Estrutura

A estrutura segue o padrão trabalhado no projeto Eureca:

- `app/`: telas e rotas do Expo Router;
- `app/(auth)/`: telas protegidas;
- `components/`: componentes reutilizáveis;
- `constants/`: cores e fontes;
- `context/`: contexto da autenticação;
- `hooks/`: funções de autenticação;
- `services/`: conexão com Firebase;
- `types/`: interfaces TypeScript.

## Funcionalidades desta versão

- criação de conta no Firebase Authentication;
- login por e-mail e senha;
- proteção das telas privadas;
- persistência da sessão com AsyncStorage;
- logout;
- tela inicial da área do aluno;
- tela de perfil;
- tela Sobre com objetivo, funcionalidades e integrantes.

O Mobile foi mantido propositalmente simples nesta etapa. A ligação de treino e histórico ao MySQL atual fica para a integração futura do aluno com o banco principal.

## Estilização

- `StyleSheet.create()` em todas as telas/componentes;
- paleta centralizada em `constants/Cores.ts`;
- famílias e tamanhos em `constants/Fontes.ts`;
- fonte Inter carregada pelo pacote `@expo-google-fonts/inter` (o arquivo da fonte é empacotado localmente após a instalação, sem depender de download durante o uso);
- ícones pelo `@expo/vector-icons`, camada do Expo baseada no React Native Vector Icons.

## Firebase

Use o mesmo projeto Firebase da aplicação Web.

1. Copie `.env.example` para `.env.development`.
2. Preencha as variáveis `EXPO_PUBLIC_FIREBASE_*`.
3. Habilite Authentication > E-mail/senha no Firebase Console.

## Execução

```bash
npm install
npx expo start
```
