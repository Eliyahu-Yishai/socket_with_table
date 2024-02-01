# Welcome! 
This project displays customer leads information in a table with features like searching, printing to Excel, and column hiding.

## Features
* Display leads information in a table.
* Search, print to Excel, and hide columns in the table.
* Real-time updates: Add rows by sending data to the server, and the client updates the table via a socket without a manual refresh.
  
## API Routes:
The server provides the following API routes:
* GET /api: Retrieve data from the server.
* POST /api: Add new data to the server.

## Socket Connection:
uses Socket.IO for real-time updates. The socket connection is established in the DataTable component, and new data is received through the "newData" event.

## Dependencies:
* React
* MUI Data Tables
* Axios
* Socket.IO

## how to run?
- client: localhost:3000
- server: localhost:5000

