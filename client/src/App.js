import React from 'react'
import TableData from './comp/DataTable'
import { ProvideSocketIoClient } from "./socketHelper/use-socket-io"


const App = () => {
  return (
    <ProvideSocketIoClient>
      <TableData />
    </ProvideSocketIoClient>

  )
}

export default App;