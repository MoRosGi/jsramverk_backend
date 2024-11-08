**Backend**

# SSR Editor - Backend

## Introduction

This repository contains the backend server for **SSR Editor**, a collaborative text editor application developed as part of the **jsramverk course assignment**. Built with **Express**, this server handles **user authentication, document management**, and **email invitations**. The backend is deployed on **Azure**.

## Features

-   **User Registration and Authentication**: Secure login and registration using JWT-based authentication.
-   **Document Management**: Create, edit, and share documents.
-   **Email Invitations**: Send invites to both registered and unregistered users to grant them access.
-   **API Endpoints**: RESTful API for managing users, documents, and invites.

## Technology Stack

-   **Node.js** and **Express** for server and API
-   **MongoDB Atlas** for data storage
-   **JWT** for user authentication
-   **Mailgun** for sending email invitations

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/MoRosGi/jsramverk_backend.git
    ```
2. npm install
3. Set up environment variables in a .env file:
    ```bash
    ATLAS_PASSWORD=<your-mongodbAtlas-password>
    PORT=<your-port>
    NODE_ENV=<your-env>
    JWT_SECRET=<your-jwt-secret>
    MAILGUN_API_KEY=<your-mailgun-api-key>
    ```
4. npm run start

### Project Structure

```
src/
├── controllers/       # Request handlers
├── models/            # Database models
├── routes/            # API routes
├── services/          # External services (e.g., Mailgun, JWT)
├── utils/             # Utility functions
├── db/                # Database setup
├── middlewares/       # Middlewares for error and token handling
└── app.mjs            # Main server application
```

### Contributors

-   **Developers**: Annie Gustafsson and Morgane Girard.
