
🧱 Low-Level Design (LLD) — Pomodoro Productivity Tracker
This document describes detailed design choices, state flows, pseudocode, and schemas for the Pomodoro Productivity Tracker. It extends beyond high-level technologies into how components interact.


🎨 Frontend (React Native + Expo + TypeScript)

UI Components


TaskList → Displays tasks from Redux store.


SessionTimer → Runs countdown for Pomodoro sessions.


TeamPresence → Shows online members via Socket.IO.



Navigation


React Navigation (Stack + Bottom Tabs).


Routes: Login, Dashboard, Tasks, Team, Settings.




📦 State Management (Redux Toolkit)
Store Shape
interface RootState {
  user: {
    id: string;
    role: "Admin" | "Manager" | "Member";
    token: string | null;
  };
  tasks: {
    id: string;
    title: string;
    status: "pending" | "in_progress" | "completed";
    assignedTo: string;
  }[];
  session: {
    isActive: boolean;
    type: "focus" | "break";
    startTime: number | null;
    remainingTime: number;
  };
}

Pseudocode: Task Lifecycle
FUNCTION addTask(title, assignedTo):
    DISPATCH action: addTask({title, assignedTo})
    CALL API: POST /tasks
    IF success → Update store
    ELSE → Show error

Pseudocode: Session Flow
FUNCTION startSession(type):
    DISPATCH action: startSession(type)
    SET timer = 25 min if focus else 5 min
    LOOP until timer == 0:
        UPDATE session.remainingTime
    ON END:
        DISPATCH endSession()
        TRIGGER notification


🛠️ Backend (Node.js + Express + MongoDB)
API Endpoints




Method

Endpoint

Description

Auth





POST

/auth/login

User login, returns JWT

No



POST

/auth/register

Register new user

No



GET

/tasks

Fetch all tasks

Yes



POST

/tasks

Create new task

Yes



PATCH

/tasks/:id

Update task status

Yes



GET

/sessions

Get user sessions

Yes



POST

/sessions

Log session start/end

Yes



DB Schema (MongoDB)
// users collection
{
  "_id": "uuid",
  "name": "Alice",
  "email": "alice@mail.com",
  "passwordHash": "hashedpw",
  "role": "Manager"
}

// tasks collection
{
  "_id": "uuid",
  "title": "Write Report",
  "status": "pending",
  "assignedTo": "userId",
  "createdAt": "timestamp"
}

// sessions collection
{
  "_id": "uuid",
  "userId": "userId",
  "type": "focus",
  "startTime": "timestamp",
  "endTime": "timestamp"
}


🔐 Authentication (JWT)
Flow
User submits login form
    → API POST /auth/login with email + password
    → Server validates credentials
        IF valid:
            GENERATE JWT(token, expiry=1h)
            RETURN token + role
        ELSE:
            RETURN 401 Unauthorized
Client stores token in AsyncStorage
All future requests attach Authorization: Bearer <token>

Middleware (Express)
function authMiddleware(req, res, next) {
  token = req.headers["authorization"];
  IF token invalid → res.status(401);
  ELSE → decode JWT and attach user to req;
  next();
}


🔄 Real-Time Sync (Socket.IO)
Events

Client → Server


joinSession { sessionId, userId }


updateTask { taskId, status }



Server → Client


sessionUpdate { activeUsers, remainingTime }


taskUpdated { taskId, newStatus }



Pseudocode: Session Sync
ON user starts session:
    EMIT "joinSession" with userId, sessionId
    SERVER updates activeUsers list
    BROADCAST "sessionUpdate" to all in session


🔔 Notifications (Expo Push)
Triggers
ON session end:
    SEND push notification: "Break Time!"

ON break end:
    SEND push notification: "Focus Session Started"

ON task assignment:
    SEND push notification: "New task assigned to you"


💾 Storage
Local (AsyncStorage)

Key: "authToken" → persists JWT.


Key: "tasksCache" → offline tasks.


Key: "sessionState" → resume timer after app restart.


Pseudocode: Offline Sync
IF network offline:
    STORE tasks locally
ON reconnect:
    PUSH local changes to server
    MERGE server updates


📌 Sequence Example: "User Starts Pomodoro Session"
[Frontend]
User taps "Start Focus"
    → Dispatch startSession("focus")
    → Save session state to AsyncStorage
    → Emit "joinSession" via Socket.IO

[Backend]
Receives joinSession
    → Update session in DB
    → Broadcast sessionUpdate to team

[Frontend (Others)]
Receive sessionUpdate
    → Update Redux store with new team presence
    → Show "Alice started a Focus session"


✅ Summary Table




Layer

Technology + Low Level Details





Frontend

React Native + Expo (UI, navigation)



State Management

Redux Toolkit (store shape, reducers)



Backend

Express APIs + MongoDB schemas



Authentication

JWT + middleware + AsyncStorage



Real-Time Sync

Socket.IO events + session sync flow



Notifications

Expo push (session + task events)



Storage

AsyncStorage (offline) + MongoDB
do i need to change anything
in this
could u please read and say

Balaji S, Yesterday 20:52
We are using typescript ? And teams option is needed ah?

You, Yesterday 20:53
ah gonna remobe typescript

Balaji S, Yesterday 20:53
I not know typescript

You, Yesterday 20:53
wheres teams option?
we gonna use react native and expo na
do i add teams option?

Balaji S, Yesterday 20:54
In the routes section
Below routes login and some things are there

You, Yesterday 20:55
but we need a team management page then
gotta add in proto type

Balaji S, Yesterday 20:56
Then can we manage the conversation inth teams section ?

You, Yesterday 20:56, Edited


🧱 Low-Level Design (LLD) — Pomodoro Productivity Tracker
This document details the low-level design of the Pomodoro Productivity Tracker, covering frontend, backend, state management, real-time sync, authentication, notifications, storage, and team collaboration.


🎨 Frontend (React Native + Expo )

UI Components


TaskList → Displays tasks from Redux store.


SessionTimer → Countdown for Pomodoro sessions.


TeamPresence → Shows online team members via Socket.IO.


TeamManagement → Create and join teams.



Navigation


React Navigation (Stack + Bottom Tabs).


Routes: Login, Dashboard, Tasks, Team, Settings.




📦 State Management (Redux Toolkit)
Store Shape
interface RootState {
  user: {
    id: string;
    role:  "Manager" | "Member";
    token: string | null;
  };
  tasks: {
    id: string;
    title: string;
    status: "pending" | "in_progress" | "completed";
    assignedTo: string;
  }[];
  session: {
    isActive: boolean;
    type: "focus" | "break";
    startTime: number | null;
    remainingTime: number;
  };
  teams: {
    id: string;
    name: string;
    members: { id: string; name: string; role: "Manager" | "Member" }[];
  }[];
}

Task Lifecycle Pseudocode
FUNCTION addTask(title, assignedTo):
    DISPATCH action: addTask({title, assignedTo})
    CALL API: POST /tasks
    IF success → Update store
    ELSE → Show error

Session Flow Pseudocode
FUNCTION startSession(type):
    DISPATCH action: startSession(type)
    SET timer = 25 min if focus else 5 min
    LOOP until timer == 0:
        UPDATE session.remainingTime
    ON END:
        DISPATCH endSession()
        TRIGGER notification

Team Lifecycle Pseudocode
FUNCTION createTeam(name, members):
    CALL API: POST /teams
    ON success → DISPATCH addTeam({id, name, members})

FUNCTION joinTeam(teamId):
    CALL API: POST /teams/:id/join
    ON success → DISPATCH updateTeams()

FUNCTION getTeams():
    CALL API: GET /teams
    UPDATE store with teams


🛠️ Backend (Node.js + Express + MongoDB)
API Endpoints




Method

Endpoint

Description

Auth





POST

/auth/login

User login, returns JWT

No



POST

/auth/register

Register new user

No



GET

/tasks

Fetch all tasks

Yes



POST

/tasks

Create new task

Yes



PATCH

/tasks/:id

Update task status

Yes



GET

/sessions

Get user sessions

Yes



POST

/sessions

Log session start/end

Yes



POST

/teams

Create new team

Yes



GET

/teams

Get user’s teams

Yes



POST

/teams/:id/join

Join a team

Yes



GET

/teams/:id/members

Get team members

Yes



DB Schema (MongoDB)
// users collection
{
  "_id": "uuid",
  "name": "Alice",
  "email": "alice@mail.com",
  "passwordHash": "hashedpw",
  "role": "Manager"
}

// tasks collection
{
  "_id": "uuid",
  "title": "Write Report",
  "status": "pending",
  "assignedTo": "userId",
  "createdAt": "timestamp"
}

// sessions collection
{
  "_id": "uuid",
  "userId": "userId",
  "type": "focus",
  "startTime": "timestamp",
  "endTime": "timestamp"
}

// teams collection
{
  "_id": "uuid",
  "name": "Frontend Ninjas",
  "members": [
    { "userId": "uuid1", "role": "Manager" },
    { "userId": "uuid2", "role": "Member" }
  ]
}


🔐 Authentication (JWT)
Flow
User submits login form
    → API POST /auth/login with email + password
    → Server validates credentials
        IF valid:
            GENERATE JWT(token, expiry=1h)
            RETURN token + role
        ELSE:
            RETURN 401 Unauthorized
Client stores token in AsyncStorage
All future requests attach Authorization: Bearer <token>

Middleware (Express)
function authMiddleware(req, res, next) {
  token = req.headers["authorization"];
  IF token invalid → res.status(401);
  ELSE → decode JWT and attach user to req;
  next();
}


🔄 Real-Time Sync (Socket.IO)
Events

Client → Server


joinSession { sessionId, userId }


updateTask { taskId, status }


joinTeam { teamId, userId }



Server → Client


sessionUpdate { activeUsers, remainingTime }


taskUpdated { taskId, newStatus }


teamUpdate { teamId, members[] }


presenceUpdate { onlineMembers[] }



Session Sync Pseudocode
ON user starts session:
    EMIT "joinSession" with userId, sessionId
    SERVER updates activeUsers list
    BROADCAST "sessionUpdate" to all in session

Team Presence Pseudocode
ON user joins team channel:
    SERVER adds user to team room
    SERVER broadcasts presenceUpdate to all team members


🔔 Notifications (Expo Push)
Triggers
ON session end:
    SEND push notification: "Break Time!"

ON break end:
    SEND push notification: "Focus Session Started"

ON task assignment:
    SEND push notification: "New task assigned to you"

ON team join:
    SEND push notification: "New member joined your team"


💾 Storage
Local (AsyncStorage)

"authToken" → persists JWT.


"tasksCache" → offline tasks.


"sessionState" → resume timer after app restart.


"teamsCache" → list of user’s teams for offline access.


Offline Sync Pseudocode
IF network offline:
    STORE tasks + teams locally
ON reconnect:
    PUSH local changes to server
    MERGE server updates


📌 Sequence Example: "User Starts a Pomodoro Session in a Team"
[Frontend]
User taps "Start Focus"
    → Dispatch startSession("focus")
    → Save session state to AsyncStorage
    → Emit "joinSession" + "joinTeam" via Socket.IO

[Backend]
Receives joinSession + joinTeam
    → Update session in DB
    → Broadcast sessionUpdate + presenceUpdate to team

[Frontend (Other Team Members)]
Receive sessionUpdate + presenceUpdate
    → Update Redux store with new team presence
    → UI shows "Alice started a Focus session"


✅ Summary Table




Layer

Technology + Low Level Details





Frontend

React Native + Expo (UI, navigation)



State Management

Redux Toolkit (store shape, reducers, pseudocode)



Backend

Express APIs + MongoDB schemas



Authentication

JWT + middleware + AsyncStorage



Real-Time Sync

Socket.IO events + presence + sessions



Notifications

Expo push (session, task, team events)



Storage

AsyncStorage (offline) + MongoDB



Teams

API + real-time presence + role-based membership
