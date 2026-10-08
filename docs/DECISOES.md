# Decisões técnicas registradas

- Firebase Authentication foi incorporado e passa a ser parte permanente do projeto.
- MySQL continua sendo o banco oficial no baseline atual.
- Firestore é uma opção futura, não uma funcionalidade já implementada.
- O backend Node.js continua necessário para regras de negócio e será preservado mesmo se o banco mudar.
- A Web principal é React/Vite/TypeScript; os arquivos HTML/JS em `backend/public` são legado funcional e serão removidos apenas quando todas as rotas antigas forem definitivamente substituídas.
- O Mobile atual é uma base autenticada; ainda não representa toda a área do aluno planejada.
- O repositório `FITID` passa a ser o repositório principal do TCC, reunindo software, banco, documentação e firmware.
