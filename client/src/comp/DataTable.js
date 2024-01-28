import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import io from 'socket.io-client';
import axios from 'axios';
import { columns } from "../columns"

const socket = io('http://localhost:5000');

function DataTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [indexesDataSelected, setIndexesDataSelected] = useState([]);
  const itemsPerPage = 10;
  const [pagesAlreadyLoading, setPagesAlreadyLoading] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pageExistInData(currentPage, pagesAlreadyLoading)) {
          alert(pagesAlreadyLoading);
          const response = await axios.get(`/api?page=${currentPage + 1}`);
          setData((prevData) => [...prevData, ...response.data.data]);
          setTotalRows(response.data.totalRows);
          setPagesAlreadyLoading((prevData) => [...prevData, currentPage]);
        } 
        // }
        // else {
        //   alert(currentPage);
        //   console.error("dd")
        // }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    socket.on("connect", () => {
      socket.on("newData", (newData) => {

        setData((prevData) => {
          const newDataExists = prevData.some(item => item.phoneNumber === newData.phoneNumber);
          if (!newDataExists) {
            setTotalPages(totalPages + 1);
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
  }, [currentPage]);


  const options = {
    rowsPerPageOptions: { itemsPerPage },
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
    count: totalRows,

    onChangePage(page) {
      setCurrentPage(page);
    },
  };

  return (
    <div>
      <MUIDataTable
        title={"Leads List"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}

export default DataTable;




function pageExistInData(val, arr) {
  if (arr.indexOf(val) !== -1)
    return true;
  else
    return false;
}