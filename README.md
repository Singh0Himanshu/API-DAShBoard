# 🚀 API Monitor Dashboard

A production-inspired API Monitoring & Analytics platform built with **React, Node.js, PostgreSQL, MongoDB, RabbitMQ, Docker, and TypeScript**.

The application tracks API requests in real time, processes them asynchronously through RabbitMQ, stores metrics in PostgreSQL, and visualizes analytics in an interactive dashboard.

---

# 🌐 Live Demo

### Dashboard
👉  http://16.171.59.13:4173/


---

# 🔑 Demo Credentials

> **Username:** Himanshu

> **Password:** Password@121

---

# 📸 Screenshots

## Login

![Login](./SERVER/)

---

## Dashboard Overview

![Dashboard](./screenshots/dashboard1.png)

---

## Analytics

![Analytics](./screenshots/dashboard2.png)

---

## Top Endpoints

![Endpoints](./screenshots/dashboard3.png)

---

## Theme Settings

![Settings](./screenshots/viewMode.png)

---

# ✨ Features

## Authentication

- JWT Authentication
- Secure Login
- Protected Routes
- Logout

---

## API Monitoring

- Total Requests
- Average Latency
- Success Rate
- Error Rate
- Unique Services
- Unique Endpoints

---

## Analytics

- Real-time Dashboard
- API Traffic Summary
- Status Code Distribution
- Top Endpoints
- Average Response Time
- Error Analytics

---

## Backend Features

- REST APIs
- Layered Architecture
- Repository Pattern
- Dependency Injection
- Centralized Error Handling
- Validation Middleware
- Structured Logging
- Rate Limiting

---

## Async Processing

- RabbitMQ Message Queue
- Background Worker
- High Throughput Processing
- Reliable Event Handling

---

## UI

- Responsive Design
- Glassmorphism UI
- Dark Purple Theme
- Light Theme
- Refresh Dashboard
- Modern Charts

---

# 🏗 Architecture

```
                    Client

                      │

                      ▼

                React Dashboard

                      │

          REST API (Express.js)

                      │

      ┌───────────────┴───────────────┐
      │                               │

Authentication                  Ingest Service

      │                               │

 MongoDB                     RabbitMQ Queue

                                      │

                                      ▼

                             Background Consumer

                                      │

                                      ▼

                               PostgreSQL Metrics

                                      │

                                      ▼

                           Analytics Dashboard
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Query
- ApexCharts
- Axios
- React Router
- Lucide Icons

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- MongoDB

## Queue

- RabbitMQ

## DevOps

- Docker
- Docker Compose

## Authentication

- JWT

---

# 📂 Project Structure

```
client/
│
├── components
├── pages
├── hooks
├── services
└── utils

server/
│
├── controllers
├── services
├── repositories
├── middleware
├── routes
├── config
└── workers
```

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/api-monitor.git
```

```bash
cd api-monitor
```

---

## Backend

```bash
cd server

npm install

npm run dev
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

## Docker

```bash
docker compose up --build
```

This starts

- PostgreSQL
- MongoDB
- RabbitMQ
- Backend
- Frontend

---

# API Flow

```
Client Request

      │

      ▼

Express API

      │

      ▼

RabbitMQ Queue

      │

      ▼

Consumer Service

      │

      ▼

PostgreSQL

      │

      ▼

Analytics Dashboard
```

---

# 📈 Metrics Tracked

- Total Requests
- Success Requests
- Failed Requests
- Average Response Time
- Error Percentage
- Status Code Distribution
- Endpoint Statistics
- Service Statistics

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Input Validation
- Rate Limiting
- Error Handling

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | AWS EC2 |
| PostgreSQL | Supabase |
| MongoDB | MongoDB Atlas |
| RabbitMQ | CloudAMQP |

---

# Future Improvements

- WebSocket Live Updates
- Email Alerts
- Slack Notifications
- API Health Checks
- Grafana Integration
- Kubernetes Deployment
- Redis Caching
- Multi Tenant Support

---

# 👨‍💻 Author

**Himanshu Singh**

Portfolio:
https://yourportfolio.com

LinkedIn:
https://linkedin.com/in/yourprofile

GitHub:
https://github.com/Singh0Himanshu
