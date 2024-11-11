## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/KevinAntonioWiyonoLauw/OmahTI-Oprec
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up database**
    - Create a new database named "personal_finance_db".
    - Import file named "personal_finance_db.sql" to the database.

4. **Run the application**
    ```bash
    npm run dev
    ```

## Authentication
All endpoints (except Register and Login) require authentication using JWT. To authenticate, include the token in the `Authorization` header as follows:

Authorization: Bearer <your_token>

You can get your token once you login.

### Register

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response:**
    - `201 Created` on success
    - `400 Bad Request` if username is taken or fields are missing

### Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticate a user and obtain a JWT token.
- **Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response:**
    - `200 OK` with JSON containing token
    - `401 Unauthorized` if credentials are invalid

## Transactions

### Get All Transactions

- **Endpoint:** `/transactions`
- **Method:** `GET`
- **Description:** Retrieve all transactions for the authenticated user.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Response:**
    - `200 OK` with list of transactions
    - `500 Internal Server Error` on failure

### Create Transaction

- **Endpoint:** `/transactions`
- **Method:** `POST`
- **Description:** Create a new transaction.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "type": "income" or "expense",
        "amount": number,
        "categoryId": number,
        "date": "YYYY-MM-DD"
    }
    ```
- **Response:**
    - `201 Created` with created transaction
    - `400 Bad Request` if fields are missing or category invalid
    - `500 Internal Server Error` on failure

### Update Transaction

- **Endpoint:** `/transactions/:id`
- **Method:** `PUT`
- **Description:** Update an existing transaction by ID.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Body:** (Any of the fields to update)
    ```json
    {
        "type": "income" or "expense",
        "amount": number,
        "categoryId": number,
        "date": "YYYY-MM-DD"
    }
    ```
- **Response:**
    - `200 OK` with updated transaction
    - `400 Bad Request` or `404 Not Found`
    - `500 Internal Server Error` on failure

### Delete Transaction

- **Endpoint:** `/transactions/:id`
- **Method:** `DELETE`
- **Description:** Delete a transaction by ID.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Response:**
    - `200 OK` on success
    - `404 Not Found` if transaction does not exist
    - `500 Internal Server Error` on failure

### Category Statistics

- **Endpoint:** `/transactions/statistics/categories`
- **Method:** `GET`
- **Description:** Get expense statistics per category.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Response:**
    - `200 OK` with statistics
    - `500 Internal Server Error` on failure

### Monthly Statistics

- **Endpoint:** `/transactions/statistics/monthly`
- **Method:** `GET`
- **Description:** Get monthly expense statistics.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Response:**
    - `200 OK` with statistics
    - `500 Internal Server Error` on failure

## Categories

### Get All Categories

- **Endpoint:** `/categories`
- **Method:** `GET`
- **Description:** Retrieve all categories for the authenticated user.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Response:**
    - `200 OK` with list of categories
    - `500 Internal Server Error` on failure

### Create Category

- **Endpoint:** `/categories`
- **Method:** `POST`
- **Description:** Create a new category.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "name": "Category Name"
    }
    ```
- **Response:**
    - `201 Created` with created category
    - `400 Bad Request` if name is missing or category exists
    - `500 Internal Server Error` on failure

### Update Category

- **Endpoint:** `/categories/:id`
- **Method:** `PUT`
- **Description:** Update a category by ID.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "name": "New Category Name"
    }
    ```
- **Response:**
    - `200 OK` with updated category
    - `400 Bad Request` if name is missing
    - `404 Not Found` if category does not exist
    - `500 Internal Server Error` on failure

### Delete Category

- **Endpoint:** `/categories/:id`
- **Method:** `DELETE`
- **Description:** Delete a category by ID.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Response:**
    - `200 OK` on success
    - `404 Not Found` if category does not exist
    - `500 Internal Server Error` on failure