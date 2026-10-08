# Validação do baseline oficial

Data de consolidação: 07/10/2026.

## Origem

Este baseline foi consolidado a partir do ZIP local mais recente do projeto, que já continha as correções posteriores à atividade Web/Mobile V2, incluindo Safe Area no Mobile e dependências atualizadas do Expo.

## Verificações realizadas durante a consolidação

- sintaxe do backend (`node --check server.js`): aprovada;
- TypeScript da Web: aprovado;
- TypeScript do Mobile: aprovado após ajuste de compatibilidade de tipos do Firebase React Native;
- estrutura de Safe Area do Mobile preservada (`SafeAreaProvider` + `SafeAreaView`);
- dependências `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`, `react-native-web` e `react-dom` preservadas;
- arquivos locais `.env`, `.env.local` e `.env.development` removidos do baseline público;
- chaves Firebase reais removidas;
- `node_modules`, `.expo`, `dist` e artefatos TypeScript removidos;
- `.gitignore` recriado para a estrutura consolidada;
- senha padrão `1234` removida do fallback do backend;
- script MySQL preservado em `database/fitid.sql`;
- diagnósticos já executados na ESP32-S3 documentados e adicionados em `firmware/diagnostics`.

## Observação sobre o build Web no ambiente de auditoria

O projeto fornecido continha `node_modules` instalado no Windows. No ambiente Linux usado para a consolidação, o build Vite não pôde ser repetido usando essa mesma pasta porque o Rollup requer um binário opcional específico do sistema operacional. Isso não representa erro no código da Web. O TypeScript da Web foi validado, e o mesmo projeto já havia produzido build com sucesso no Windows durante a entrega V2.

Após extrair o baseline em um computador de desenvolvimento, execute `scripts/windows/PREPARAR_FITID.bat` e depois `scripts/windows/VERIFICAR_FITID.bat` para reinstalar dependências nativas do sistema e repetir a validação completa.
