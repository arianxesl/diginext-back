### Installing

Follow these steps to get a development environment running:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/arianxesl/diginext-back.git
   cd diginext-back
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:

   - Ensure SQLite is installed on your machine.
   - Initialize the database using the schema provided in `database.sql`.

   ```bash
   sqlite3 following_system.db < database.sql
   ```

### Running the Server

Start the Node.js server with the following command:

```bash
node app.js
```

The server will start running on `http://localhost:3000`.

### Testing the APIs

Use Postman or any other API testing tool to interact with the following endpoints:

#### Follow a User

- **URL**: `http://localhost:3000/follow`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "user_id": 1,
    "follow_id": 2
  }
  ```

#### Unfollow a User

- **URL**: `http://localhost:3000/unfollow`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "user_id": 1,
    "follow_id": 2
  }
  ```

#### Get Followers

- **URL**: `http://localhost:3000/followers/2`
- **Method**: GET
- **Headers**: `Content-Type: application/json`

#### Get Mutual Followers

- **URL**: `http://localhost:3000/mutual_followers`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "user_id1": 1,
    "user_id2": 3
  }
  ```

### Built With

- Node.js
- Express.js - Web framework for Node.js
- SQLite - SQL database engine
