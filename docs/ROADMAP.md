# Roadmap do FITID

## Curto prazo

1. Integrar RC522 ao ESP32-S3 e validar leitura de UID.
2. Conectar o ESP32 ao Wi-Fi.
3. Fazer o RFID físico consultar a API do FITID.
4. Integrar display ST7796U e touch FT6336U.
5. Exibir no equipamento aluno, exercício, séries, repetições, mídia e próximo exercício.

## Software

- consolidar o Mobile como verdadeira área do aluno;
- evoluir o fluxo de treinos A/B/C e múltiplos exercícios por grupo de aparelho;
- implementar progressão/próximo exercício;
- concluir fallback por QR Code;
- reforçar autenticação de dispositivos físicos;
- preparar publicação Web/API.

## Arquitetura futura em avaliação

Firebase Authentication será mantido. Firestore poderá ser estudado como substituição futura do MySQL para simplificar hospedagem e sincronização em tempo real, mas não faz parte deste baseline.

Antes de qualquer migração deverão ser definidos:

- modelo de coleções/documentos;
- regras de segurança;
- estratégia de dados históricos;
- integração segura do ESP32;
- papel futuro da API Node.js;
- custos e limites operacionais.
