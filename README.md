# Zero-Scam
📛 Zero-Scam

Uma plataforma web para identificar e denunciar links de golpe, desenvolvida para o desafio Bradesco. O sistema faz verificação inteligente e gratuita, ajudando a proteger usuários contra fraudes digitais e reforçando a segurança e confiança online.

# 🧠 Funcionalidades

# 🚨 Detecção de links suspeitos

# 📣 Denúncia automatizada de possíveis golpes

# 🔍 Verificação inteligente em tempo real

# 💡 Interface web intuitiva

# 🛡️ Contribui para maior segurança digital

# 🧱 Arquitetura do Projeto

O repositório está organizado em vários módulos, por exemplo:


- api-gateway/       # API principal do serviço
- denuncia/          # Microserviço de denúncias
- eureka-server/     # Registro de serviços (Discovery)
- frontend/          # Aplicação web (UI)
- usuario/           # Serviço de usuários
- verificacao/       # Lógica de verificação de links
- .vscode/           # Configurações de editor

(Ajuste essa estrutura conforme necessário, se alguns módulos tiverem nomes diferentes ou se houver mais pastas)

# 🛠️ Tecnologias Utilizadas

O projeto combina várias tecnologias comuns em aplicações web modernas:

Parte do Projeto	Tecnologia
Backend	Java, Spring Boot
Frontend	HTML, CSS, JavaScript
Descoberta de Serviço	Eureka
API Gateway	Java / Spring Cloud
Gerenciamento	Maven / ferramentas de CI/CD
Outros	Customização conforme necessidade

(Se houver frameworks específicos no frontend, como React ou Vue, inclua aqui também)

# 🚀 Como Executar o Projeto

Estas instruções servem para você rodar o projeto localmente.

# 📌 Pré-Requisitos

Java 11+

Node.js (se o frontend usar npm/yarn)

Maven (para módulos Java)

# 🧩 Backend

Abra cada serviço Java (ex: api-gateway, verificacao, etc)

Rode com Maven:

mvn clean install
mvn spring-boot:run
# 🛠️ Frontend

Se houver uma pasta de frontend com Node:

cd frontend
npm install
npm run dev

(ou o comando específico do framework usado)

# 🧪 Testes

Se houver testes automatizados:

mvn test

ou

npm test

(remova/adapte se o projeto não tiver testes configurados)

# 👥 Contribuições
contribuições são bem-vindas!

Faça um fork deste repositório

Crie sua feature branch (git checkout -b feature/nome)

Commit suas mudanças (git commit -m 'Descrição da feature')

Push para a branch (git push origin feature/nome)

Abra um Pull Request
