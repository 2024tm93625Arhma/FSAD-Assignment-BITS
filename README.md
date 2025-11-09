# Equipment Lending Portal

This is a full-stack web application for managing and borrowing equipment, built with React.js, Spring Boot, and MySQL.

The system supports three user roles:

  * **Student:** Can browse available equipment and submit borrow requests.
  * **Staff:** Can do everything a Student can, and can also manage (approve, reject, issue, return) borrow requests.
  * **Admin:** Can do everything a Staff member can, and can also manage the equipment inventory (add, edit, delete items) and user accounts.

## Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router DOM, Material-UI (MUI), Axios |
| **Backend** | Spring Boot, Spring Security (with JWT), Spring Data JPA |
| **Database** | MySQL |
| **Authentication** | JWT (JSON Web Tokens) |

-----

## Features

### Student

  * Create an account.
  * Log in to the system.
  * View all available equipment.
  * Submit a borrow request for a specific item and date range.
  * View the status of all their own borrow requests.
  * View their user profile.

### Staff

  * All `Student` features.
  * View a dashboard of all `PENDING` and `APPROVED` requests from all users.
  * View a dashboard of all `ISSUED` items.
  * Approve or Reject pending requests.
  * Mark `APPROVED` requests as `ISSUED` (decrements item stock).
  * Mark `ISSUED` requests as `RETURNED` (increments item stock).

### Admin

  * All `Staff` features.
  * View a dashboard for full CRUD (Create, Read, Update, Delete) management of the equipment inventory.
  * Full API access to manage all user accounts.

-----

## Architecture

The application follows a 3-tier architecture:

1.  **Frontend (Client):** A React Single Page Application (SPA) that runs in the browser on `http://localhost:3000`. It uses `axios` to communicate with the backend API.
2.  **Backend (Server):** A Spring Boot REST API that runs on `http://localhost:8080`. It handles all business logic, security, and data persistence.
3.  **Database (Data Store):** A MySQL database named `fsad_db` that stores all user, equipment, and request data.

-----

## Database Schema

The database is built on three core tables:

  * **`users`**: Stores user information (name, email, hashed password) and their `role` (STUDENT, STAFF, ADMIN).
  * **`equipment`**: Stores the inventory (name, category, total quantity, available quantity).
  * **`borrow_request`**: Links a `User` to a piece of `Equipment`. It stores the quantity, dates, and the request `status` (e.g., PENDING, APPROVED, ISSUED, RETURNED).

-----

## Getting Started

### 1\. Backend (Spring Boot)

1.  **Navigate to the backend directory:**
    ```sh
    cd user-authentication
    ```
2.  **Configure Database:**
      * Make sure you have MySQL running.
      * Create a database named `fsad_db`.
      * Update `src/main/resources/application.properties` with your MySQL username and password (default is set to `root`/`root`).
3.  **Run the application:**
    ```sh
    # On macOS/Linux
    ./mvnw spring-boot:run

    # On Windows
    ./mvnw.cmd spring-boot:run
    ```
    The backend API will be running on `http://localhost:8080`.

### 2\. Frontend (React)

1.  **Navigate to the frontend directory:**

    ```sh
    cd user-frontend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Run the application:**

    ```sh
    npm start
    ```

    The React development server will start, and your browser will open to `http://localhost:3000`.

4.  **Usage:**

      * You can now use the application.
      * To create an admin, use the **Signup** page and select the "ADMIN" role. Use this account to log in and access the Admin/Staff dashboards.
