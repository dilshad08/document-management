# Document Management System

## Overview

The Document Management System is a robust RESTful API built with NestJS and Prisma that enables users to manage documents with role-based access control. The system supports the following features:

- **Authentication**: Register, login, and handle user roles (Admin, Editor, Viewer).
- **User Management**: Admin-only functionality for managing user roles and permissions.
- **Document Management**: CRUD operations for documents, including role-based access control.
- **Ingestion Workflow**: Asynchronous document ingestion using BullMQ to simulate interaction with a Python backend.

This project is designed to be modular, scalable, and easy to extend. It uses PostgreSQL as the database, JWT for authentication, and BullMQ for background job processing.

---

## Features

### 1. Authentication

- **Register**: Create a new user with a role (Admin, Editor, Viewer).
- **Login**: Authenticate users and generate a JWT token.
- **Role-Based Access Control**: Restrict access to routes based on user roles.

### 2. User Management

- **Admin-Only Routes**:
  - Update user roles.

### 3. Document Management

- **Create Document**: Upload a new document (Admin/Editor only).
- **Update Document**: Modify document details (Admin/Editor only).
- **Delete Document**: Remove a document (Admin/Editor only).
- **View Documents**: Retrieve documents (Viewer, Editor, Admin).

### 4. Ingestion Workflow

- **Asynchronous Ingestion**: Simulate document ingestion using BullMQ for background processing.
- **Status Tracking**: Track ingestion status (Pending, Processing, Completed, Failed).
- **Mock Python Backend**: Simulate interaction with a Python backend for testing.

---

## Technologies Used

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Background Jobs**: BullMQ (for asynchronous ingestion)
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

---

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for running PostgreSQL and Redis in a container)
- PostgreSQL (if not using Docker)
- Redis (required for BullMQ)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/document-management.git
cd document-management
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables:

```env
NODE_ENV='development'
PORT=8080

# PostgreSQL
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DB=document_db
DATABASE_URL="postgresql://your-postgres-user:your-postgres-password@localhost:5432/document_db"

# JWT
JWT_SECRET="your-secret-key"

# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
```

Replace the placeholders with your preferred values.

### Step 3: Set Up PostgreSQL and Redis

#### Option 1: Using Docker (Recommended)

Start the PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

Verify the containers are running:

```bash
docker ps
```

#### Option 2: Manual Setup

- Install PostgreSQL and Redis on your machine.
- Create a database named `document_db`.
- Update the `DATABASE_URL` and `REDIS_HOST` in the `.env` file with your credentials.

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run Prisma Migrations

Apply the database schema using Prisma:

```bash
npx prisma migrate dev --name init
```

### Step 6: Start the Application

Run the NestJS application in development mode:

```bash
npm run start:dev
```

The API will be available at `http://localhost:8080/api`.

### Step 7: Access Swagger Documentation

Open your browser and navigate to:

```bash
http://localhost:8080/api/docs
```

This will display the Swagger UI, where you can explore and test the API endpoints.

---

## Ingestion Workflow

### Ingestion Workflow with BullMQ

The ingestion workflow is handled asynchronously using BullMQ. Here's how it works:

#### Trigger Ingestion:

- When a document is uploaded, an ingestion job is added to the BullMQ queue.
- The job simulates processing with a delay and updates the ingestion status.

#### Status Tracking:

- The ingestion status is stored in the database and can be queried using the `/documents/ingestion-status/:id` endpoint.

#### Error Handling:

- If ingestion fails, the job is retried up to a specified number of times.

---

## Testing

### Unit Tests

Run unit tests using the following command:

```bash
npm run test
```

### Docker Setup

Build the Docker image:

```bash
docker-compose build
```

Start the containers:

```bash
docker-compose up -d
```

Access the API at `http://localhost:8080/api`.

---

## Project Structure

```plaintext
src/
├── auth/          # Authentication module
├── users/         # User management module
├── documents/     # Document management module
├── queue/         # BullMQ queue for ingestion
├── prisma/        # Prisma schema and migrations
├── interceptors/  # Response interceptors
├── app.module.ts  # Root module
├── main.ts        # Application entry point
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For questions or feedback, please reach out to:

**Dilshad Ahmad**  
📧 Email: idilshadk@gmail.com  
💻 GitHub: [dilshad08](https://github.com/dilshad08)

Thank you for using the Document Management System! 🚀
