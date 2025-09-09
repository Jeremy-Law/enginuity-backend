# Enginuity Backend (Node.js + Express)

## Features
- REST API for **Users, Projects, and Files**
- **PostgreSQL (AWS RDS)** as the primary database
- **AWS S3** for file storage
- Built with **Express + Node.js**
- Dockerized for deployment on AWS EC2

---

## Prerequisites
- Node.js (>=18) or Docker
- AWS account with:
  - RDS (PostgreSQL)
  - S3 bucket
- `.env` file configured with secrets (see below)

---

## Setup

1. **Clone the repo** and SSH into your EC2 instance:
   ```bash
   git clone https://github.com/your-org/enginuity-backend.git
   cd enginuity-backend
