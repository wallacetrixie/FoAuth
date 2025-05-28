# Project Title: Authentication System

## Overview
This project is an authentication system built using Node.js and Express. It provides user registration and login functionalities, utilizing a MySQL database for data storage and express-validator for input validation.

## Project Structure
```
Backend_logic
├── controllers
│   └── controller.js        # Contains user registration and login logic
├── db.js                    # Database connection setup
├── middleware
│   └── session.js           # Session management middleware
├── routes
│   └── auth.js              # Authentication routes
├── validators
│   └── validators.js        # Input validation rules
├── Server.js                # Main entry point of the application
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Backend_logic
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `auth`.
   - Ensure the database user has the necessary permissions.

4. **Run the Application**
   Start the server with:
   ```bash
   node Server.js
   ```
   The server will run on `http://localhost:5000`.

## Usage Guidelines

- **Register a User**
  - Endpoint: `POST /register`
  - Body: 
    ```json
    {
      "username": "your_username",
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```

- **Login a User**
  - Endpoint: `POST /login`
  - Body:
    ```json
    {
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```

## Notes
