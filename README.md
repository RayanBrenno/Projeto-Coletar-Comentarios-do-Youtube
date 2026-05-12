## 📌 Visão Geral

Este projeto consiste em uma aplicação web fullstack desenvolvida para coleta, armazenamento e análise de comentários de vídeos do YouTube.

A plataforma permite que usuários consultem vídeos a partir de uma URL, recuperem informações públicas do vídeo e realizem a extração automática dos comentários utilizando a API oficial do YouTube Data API v3.

Além da coleta dos dados, o sistema mantém um histórico de consultas por usuário, possibilitando atualização dos dados de vídeos já armazenados e servindo como base para futuras análises de sentimento utilizando modelos de inteligência artificial.

O projeto foi idealizado tanto como aplicação prática quanto como base para desenvolvimento acadêmico relacionado à análise de sentimentos em comentários de redes sociais.

---

## 🎯 Objetivo

O principal objetivo do projeto é construir uma plataforma capaz de coletar e organizar comentários de vídeos do YouTube de forma automatizada.

Além disso, o projeto busca:

- Aplicar conceitos de desenvolvimento fullstack
- Integrar APIs externas (YouTube Data API v3)
- Trabalhar com persistência de dados em MongoDB
- Implementar autenticação segura com JWT
- Estruturar uma aplicação escalável baseada em serviços
- Servir como base para análise de sentimentos em comentários
- Permitir futuras integrações com modelos de IA/NLP

---

## 🧠 Funcionalidades

- 🔐 Autenticação de usuários (Login / Register)
- 👤 Gerenciamento de sessão com JWT
- 🎥 Consulta de vídeos via URL do YouTube
- 📊 Coleta de informações públicas do vídeo
- 💬 Extração automática de comentários
- 🗂️ Armazenamento de vídeos e comentários no MongoDB
- 🔄 Atualização de vídeos previamente consultados
- 🕒 Histórico de consultas por usuário
- 🖼️ Exibição de thumbnails dos vídeos
- 📈 Comparação de métricas após atualização
- ⚡ Interface dinâmica e responsiva
- 🤖 Estrutura preparada para análise de sentimentos com IA

---

## 🛠️ Tecnologias utilizadas

### Frontend

- React (Vite)
- TypeScript
- TailwindCSS
- React Router
- Axios

### Backend

- FastAPI
- Python
- JWT (Autenticação)
- MongoDB
- Pydantic

### Infraestrutura e Serviços

- YouTube Data API v3
- MongoDB Atlas
- AWS EC2
- AWS Amplify
- ngrok (HTTPS Tunnel)

---

## ⚙️ Como rodar o projeto

> O projeto já está disponível online no link abaixo:  
https://main.d3m1d4qui9fbcp.amplifyapp.com/

> O frontend está hospedado no AWS Amplify e o backend em uma instância AWS EC2.

> Atualmente o backend utiliza um túnel HTTPS gratuito via ngrok para comunicação segura entre frontend e backend.

> Devido às limitações do plano gratuito do ngrok, o túnel pode eventualmente ficar offline ou ter sua URL alterada, o que pode causar indisponibilidade temporária da aplicação.

> Caso queira executar localmente, siga os passos abaixo.

---

### 🔙 Backend (FastAPI)

```bash

cd backend

python -m venv .venv

source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate     # Windows

pip install -r requirements.txt

uvicorn app.main:app --reload

```

Servidor disponível em: http://127.0.0.1:8000

### 🔜 Frontend (React)

```bash

cd backend

cd frontend

npm install
npm run dev

```

App disponível em: http://localhost:5173


## 🔄 Fluxo de funcionamento

1. O usuário acessa a aplicação através do frontend hospedado no AWS Amplify.

2. Na tela inicial, o usuário pode:
   - Fazer login
   - Criar uma conta

3. Após autenticação:
   - O sistema gera um token JWT
   - A sessão do usuário é armazenada

4. O usuário informa a URL de um vídeo do YouTube.

5. O backend:
   - Extrai o ID do vídeo
   - Consulta a YouTube Data API v3
   - Recupera informações públicas do vídeo

6. O sistema:
   - Coleta os comentários do vídeo
   - Armazena os dados no MongoDB

7. Os dados exibidos incluem:
   - Título
   - Canal
   - Data de publicação
   - Views
   - Likes
   - Quantidade de comentários
   - Thumbnail
   - Comentários coletados

8. Caso o vídeo já exista:
   - O sistema identifica o histórico do usuário
   - Permite atualização dos dados

9. Durante a atualização:
   - O sistema compara métricas anteriores e atuais
   - Atualiza os comentários armazenados

10. O usuário pode:
   - Consultar múltiplos vídeos
   - Visualizar histórico
   - Atualizar consultas anteriores