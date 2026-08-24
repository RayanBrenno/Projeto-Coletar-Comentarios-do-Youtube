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
- Render (backend)
- Vercel (frontend)

<details>
<summary>📦 Infraestrutura anterior (AWS Free Tier)</summary>

O projeto rodou inicialmente 100% na AWS:

- AWS EC2 (backend)
- AWS Amplify (frontend)
- ngrok (túnel HTTPS gratuito, usado pra dar HTTPS à instância EC2)

Após o fim do período gratuito da AWS, o projeto foi migrado para Render (backend) e Vercel (frontend), que possuem planos gratuitos permanentes.

</details>

---

## ⚙️ Como rodar o projeto

> O projeto já está disponível online no link abaixo:  
https://projeto-coletar-comentarios-do-yout.vercel.app/

> O frontend está hospedado na Vercel e o backend no Render.

> O backend roda no plano gratuito do Render, que "dorme" após um período de inatividade. Isso pode fazer a primeira requisição depois de um tempo parado demorar ~30-50s até o servidor acordar.

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

Crie um arquivo `.env` dentro de `backend/` com as seguintes variáveis:

```
MONGO_URL=<sua connection string do MongoDB Atlas>
MONGO_DB=<nome do banco>
YOUTUBE_API_KEY=<sua chave da YouTube Data API v3>
API_FRONT_URL=http://localhost:5173
```

### 🔜 Frontend (React)

```bash

cd frontend

npm install
npm run dev

```

App disponível em: http://localhost:5173

Crie um arquivo `.env` dentro de `frontend/` com a seguinte variável:

```
VITE_API_URL=http://127.0.0.1:8000
```


## 🔄 Fluxo de funcionamento

1. O usuário acessa a aplicação através do frontend hospedado na Vercel.

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