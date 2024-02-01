the client run at: localhost:3000

the server run at: localhost:5000

the client call to localhost:5000/api to get data


## API Routes:
The server provides the following API routes:
  a. GET /api: Retrieve data from the server.
  b. POST /api: Add new data to the server.

## Socket Connection:
uses Socket.IO for real-time updates. The socket connection is established in the DataTable component, and new data is received through the "newData" event.

## Dependencies:
React
MUI Data Tables
Axios
Socket.IO
