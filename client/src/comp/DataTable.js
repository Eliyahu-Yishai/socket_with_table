import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import io from 'socket.io-client';
import { columns } from "../columns"

const socket = io('http://localhost:5000');

function DataTable() {
  const [data, setData] = useState([{}]);
  const [indexesDataSelected, setIndexesDataSelected] = useState([]);
  const numRowSize = 10
  
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setData(data);
      });

    socket.on("connect", () => {
      socket.on("newData", (newData) => {

        setData((prevData) => {
          const newDataExists = prevData.some(item => item.phoneNumber === newData.phoneNumber);
          if (!newDataExists) {
            return [...prevData, newData];
          } else {
            return prevData;
          }
        });
      })

    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const options = {
    rowsPerPageOptions:{numRowSize},
    filterType: 'checkbox',
    responsive: "standard",

    onRowsSelect: (curRowSelected) => {
      const indexLine = curRowSelected[0].dataIndex;

      if (indexesDataSelected.includes(indexLine)) {
        const updatedArray = indexesDataSelected.filter(ind => ind !== indexLine);
        setIndexesDataSelected(updatedArray);
      } else {
        console.log("Date selected", data[indexLine]);
        setIndexesDataSelected([...indexesDataSelected, indexLine]);
      }
    },

    onRowsDelete: (onRowsDelete) => {
      return false;
    },

  };

  return (
    <MUIDataTable
      title={"Leads List"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}

export default DataTable;






