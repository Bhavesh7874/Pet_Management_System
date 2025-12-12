# Pet Management System

A full-stack Pet Management Application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Register and Login for users.
- **Admin Dashboard**: Manage pets (Add, Edit, Delete) and adoption applications.
- **User Dashboard**: View and track adoption applications.
- **Browse Pets**: Filter and view available pets.
- **Adoption Process**: Users can apply to adopt pets.

## Tech Stack

- **Frontend**: React, Vanilla CSS (Custom Design System)
- **Backend**: Node.js, Express, MongoDB
- **State Management**: React Context API

## Setup Instructions

1.  **Clone the repository**.
2.  **Install Dependencies**:
    ```bash
    # Backend
    cd backend
    npm install

    # Frontend
    cd ../frontend
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the `backend` directory:
    ```
    MONGO_URI=mongodb://localhost:27017/pet_management_system
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```
4.  **Seed Database**:
    Run the seed script to populate the database with default users and pets:
    ```bash
    cd backend
    node seed.js
    ```
5.  **Run the Application**:
    ```bash
    # Backend (from backend directory)
    npm run dev

    # Frontend (from frontend directory)
    npm run dev
    ```

## Default Credentials

**Admin Account:**
- Email: `patilbhavesh7874@gmail.com`
- Password: `Test@123`

**User Account:**
- Email: `user@example.com`
- Password: `userpassword`

> **Note:** If the database is empty, run `npm run seed` in the backend directory.
