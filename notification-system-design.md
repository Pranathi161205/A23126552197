# Notification System Design
# Stage 1

## Notification APIs

The notification system should support the following operations:

### Get All Notifications

```http
GET /api/notifications
```

Response

```json
{
  "notifications": [
    {
      "id": "n101",
      "type": "Placement",
      "message": "Company XYZ is hiring",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:30Z"
    }
  ]
}
```

### Get Notification By ID

```http
GET /api/notifications/:id
```

### Mark Notification as Read

```http
POST /api/notifications/read
```

Request

```json
{
  "notificationId": "n101"
}
```

### Mark All Notifications as Read

```http
POST /api/notifications/read-all
```

### Delete Notification

```http
DELETE /api/notifications/:id
```

## Real-Time Notification Mechanism

For real-time delivery, WebSockets can be used.

Flow:

```text
Notification Service
        ↓
WebSocket Server
        ↓
Student Client
```

Whenever a new notification is created, the server immediately pushes it to connected students without requiring page refresh.

---

# Stage 2

## Database Selection

I would use PostgreSQL as the primary database.

### Reasons

* ACID compliant
* Reliable transaction support
* Strong indexing capabilities
* Suitable for large notification datasets
* Easy integration with backend services

## Database Schema

### Students Table

| Column     | Type      |
| ---------- | --------- |
| student_id | UUID (PK) |
| name       | VARCHAR   |
| email      | VARCHAR   |

### Notifications Table

| Column            | Type      |
| ----------------- | --------- |
| id                | UUID (PK) |
| student_id        | UUID (FK) |
| notification_type | ENUM      |
| message           | TEXT      |
| is_read           | BOOLEAN   |
| created_at        | TIMESTAMP |

### Challenges as Data Grows

As the number of notifications increases:

* Query performance may decrease
* Storage requirements increase
* Sorting and filtering become slower

### Solutions

* Add indexes on frequently searched columns
* Use pagination
* Archive old notifications
* Introduce caching for frequently accessed data

---

# Stage 3

## Analysis of Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

### Problems

1. `SELECT *` retrieves unnecessary columns.
2. No proper indexing strategy.
3. Sorting large datasets becomes expensive.

### Optimized Query

```sql
SELECT id,
       notification_type,
       message,
       createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

### Recommended Index

```sql
CREATE INDEX idx_notification_student_read_date
ON notifications(studentID, isRead, createdAt DESC);
```

### Is Adding Indexes on Every Column a Good Idea?

No.

Reasons:

* Increased storage usage
* Slower INSERT and UPDATE operations
* Additional maintenance overhead

Indexes should only be created on frequently queried columns.

### Students Who Received Placement Notifications in Last 7 Days

```sql
SELECT studentID
FROM notifications
WHERE notification_type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4

## Improving Notification Retrieval Performance

Currently every page load directly hits the database.

This creates unnecessary load and increases response time.

### Proposed Solution

Use Redis Cache.

Flow:

```text
Client
   ↓
Application Server
   ↓
Redis Cache
   ↓
Database
```

### Benefits

* Faster response times
* Reduced database load
* Better user experience
* Improved scalability

### Trade-offs

* Additional infrastructure cost
* Cache invalidation complexity
* Data consistency management

Pagination can also be implemented to reduce the number of records returned per request.

---

# Stage 5

## Problems with Existing Implementation

Current approach:

```text
For each student
   Send Email
   Save Notification
   Push Notification
```

### Issues

* Completely sequential
* Slow for 50,000 students
* Failure of one operation affects others
* Difficult to recover from partial failures

If email sending fails for 200 students, tracking and retrying becomes difficult.

## Improved Design

Use Kafka or RabbitMQ.

Flow:

```text
Notify All Request
          ↓
Producer
          ↓
Message Queue
          ↓
Workers
          ↓
Database + Email + Push
```

### Benefits

* Asynchronous processing
* Better fault tolerance
* Retry mechanisms
* High scalability

### Revised Pseudocode

```text
publish(notification_event)

worker():

    save_notification()

    send_email()

    send_push()

    if failed:
        retry()
```

---

# Stage 6

## Priority Inbox Design

Priority should be determined using:

1. Notification Type
2. Recency

### Priority Weights

| Type      | Weight |
| --------- | ------ |
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

### Scoring Formula

```text
Score = Type Weight + Recency Score
```

Recent notifications receive higher scores.

### Approach

* Fetch notifications from API
* Calculate score
* Sort by score descending
* Display top N notifications

### Efficient Maintenance

To efficiently maintain the top notifications:

* Use a Priority Queue (Max Heap)
* Insert new notifications dynamically
* Retrieve top notifications in O(log n)

This avoids sorting the entire notification list repeatedly and improves performance for large datasets.
