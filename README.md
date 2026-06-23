# Logging Middleware

## Overview

The Logging Middleware is a reusable utility. It provides centralized logging support across backend applications by sending log events to the Logging API.

The middleware captures important application events such as information messages, debugging details, warnings, and errors, helping improve observability and troubleshooting.

---

## Function Signature

```javascript
Log(stack, level, packageName, message)
```

### Parameters

| Parameter   | Description                               |
| ----------- | ----------------------------------------- |
| stack       | backend / frontend                        |
| level       | debug, info, warn, error, fatal           |
| packageName | service, controller, middleware, db, etc. |
| message     | Descriptive log message                   |

---

## Example Usage

```javascript
await Log(
  "backend",
  "info",
  "service",
  "Fetching depot data"
);
```

```javascript
await Log(
  "backend",
  "error",
  "service",
  "Vehicle API request failed"
);
```

---

## Technologies Used

* Node.js
* Axios
* Dotenv

---

## Environment Variables

Create a `.env` file:

```env
ACCESS_TOKEN=your_access_token
```

---

## Installation

```bash
npm install
```

---

## Run

Import and use:

```javascript
import { Log } from "./logger.js";
```

---

## Project Structure

```text
logging-middleware/
│
├── logger.js
├── package.json
├── .env
└── README.md
```



# Vehicle Maintenance Scheduler

## Overview

Vehicle Maintenance Scheduler is a backend application developed for the AffordMed Campus Evaluation.

The application fetches depot and vehicle maintenance data from the AffordMed Evaluation APIs and generates optimized maintenance schedules using the 0/1 Knapsack Algorithm.

The objective is to maximize maintenance impact while staying within the available mechanic hours of each depot.

---

## Features

* Fetch depot information from Evaluation API
* Fetch vehicle maintenance tasks
* Optimize maintenance schedules
* Calculate maximum achievable impact
* Logging integration
* REST API based architecture

---

## System Flow

```text
Client Request
      ↓
Scheduler API
      ↓
Fetch Depots
      ↓
Fetch Vehicles
      ↓
Run Knapsack Optimization
      ↓
Generate Schedule
      ↓
Return Response
```

---

## API Endpoints

### Health Check

```http
GET /api
```

Response:

```json
{
  "status": "running"
}
```

---

### Generate Schedule

```http
GET /api/schedule
```

Response:

```json
{
  "success": true,
  "schedules": []
}
```

---

## Optimization Algorithm

The scheduler uses the **0/1 Knapsack Algorithm**.

### Input

* Vehicle Duration
* Vehicle Impact
* Depot Mechanic Hours

### Output

* Selected Tasks
* Total Impact
* Number of Tasks Scheduled

The algorithm selects the combination of maintenance tasks that produces the highest impact without exceeding available mechanic hours.

---

## Technologies Used

* Node.js
* Express.js
* Axios
* Dotenv
* JavaScript (ES Modules)

---

## Environment Variables

Create a `.env` file:

```env
ACCESS_TOKEN=your_access_token
```

---

## Installation

```bash
npm install
```

---

## Run Application

```bash
npm start
```

Server starts on:
<img width="311" height="93" alt="image" src="https://github.com/user-attachments/assets/5a27725f-3bc1-48bf-933b-ce9090b06287" />

```text
http://localhost:3000
```
<img width="353" height="80" alt="image" src="https://github.com/user-attachments/assets/b9a3af04-8ab9-4b27-9fbf-c2917c8afd98" />

---

## Project Structure

```text
vehicle-scheduler-be/
│
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── schedulerRoutes.js
│   ├── services/
│   │   └── schedulerService.js
│   └── utils/
│       └── knapsack.js
│
├── screenshots/
├── package.json
├── .env
└── README.md
```

---

## Output

<img width="959" height="274" alt="image" src="https://github.com/user-attachments/assets/54914a18-4b11-40d3-93f7-b71542a43de0" />

---

## Author


Roll No: A23126552197
