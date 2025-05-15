## Description

A simple CRUD app built with Node.js **without using any frameworks**.  
Completed as part of the [RS School: CRUD API](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md) course assignment.

## Usage

1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone this repo locally
3. Navigate to `crud-api`
4. Install all dependencies using [`npm install`](https://docs.npmjs.com/cli/install)
5. Run the application (e.g., in development mode) `npm run start:dev`

## Work modes

1. `npm run start:dev` - Development mode
2. `npm run start:prod` - Production mode: starts the build process and then runs the bundled file
3. `npm run start:multi` - Development mode using the Node.js `Cluster` API to start multiple worker processes

## API Overview

The application uses a single **in-memory database** with user records.

User model:

```ts
interface IUser {
  id: string
  username: string
  age: number
  hobbies: string[]
}
```

By default app starts the server (or load-balancer in multi mode) at `http://localhost:3000`.
Port number can be changed via the `.env`-file.

### Avalliable endpoints:

- **GET** `/api/users`  - Get all persons
- **GET** `/api/users/{userId}` - Get user by ID
- **POST** `/api/users`  - Create a new user
- **PUT** `/api/users/{userId}` - Update an existing user
- **DELETE** `/api/users/{userId}` - Delete a user by ID

### Example scenario

1. **POST** `/api/users` - Create user `john_doe`
   **Request body:**

```json
{
	username: "john_doe",
	age: 28,
	hobbies: ["movie", "programming"],
}
```

**Response:**`201 Created`

```json
{
    id: "9e31fb9b-1379-4404-b759-2dc84aea2266",
	username: "john_doe",
	age: 28,
	hobbies: ["movie", "programming"],
}
```
---
2. **POST** `/api/users`- Create user `john_terry`
   **Request body:**

```json
{
	username: "john_terry",
	age: 45,
	hobbies: ["football", "swimming"],
}
```

**Response:** `201 Created`

```json
{
	id: "149ab9de-1522-4be5-b113-1790eab1ef8f",
	username: "john_terry",
	age: 45,
	hobbies: ["football", "swimming"],
}
```

---
3. **GET** `/api/users` - Get all users

**Response:** `200 OK`

```json
[
	{
		id: "9e31fb9b-1379-4404-b759-2dc84aea2266",
		username: "john_doe",
		age: 28,
		hobbies: ["movie", "programming"],
	},
	{
		id: "149ab9de-1522-4be5-b113-1790eab1ef8f",
		username: "john_terry",
		age: 45,
		hobbies: ["gaming", "cooking", "traveling"],
	}
]
```

---
4. **PUT** `/api/users/9e31fb9b-1379-4404-b759-2dc84aea2266` - Update `john_doe`
   **Request body:**

```json
{
	username: "john_doe",
	age: 32,
	hobbies: ["movie", "programming", "skiing"],
}
```

**Response:** `200 OK`

```json
{
	id: "9e31fb9b-1379-4404-b759-2dc84aea2266",
	username: "john_doe",
	age: 32,
	hobbies: ["movie", "programming", "skiing"],
}
```

---
5. **DELETE** `/api/users/149ab9de-1522-4be5-b113-1790eab1ef8f` - Delete `john_terry`

**Response**: `204 No Content`

---
## Testing

There are several tests for the available endpoints. You can run them using the following command:

```shell
npm run test
```
OR

```shell
npm run test:verbose
```

## Multi-mode

In multi-mode, a load-balancer distributes incoming requests among worker processes.  
You can see which worker handled a request by checking the console output:

```
Reply from worker on port:  3001
Reply from worker on port:  3002
Reply from worker on port:  3003
Reply from worker on port:  3004
Reply from worker on port:  3005
```

