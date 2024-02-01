import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import axios from 'axios';
import { columns } from "../tableHelper/columns"
import { useSocketIoClient } from "../socketHook/use-socket-io";


function DataTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [indexesDataSelected, setIndexesDataSelected] = useState([]);
  const [pagesAlreadyLoading, setPagesAlreadyLoading] = useState([]);
  const client = useSocketIoClient();
  const itemsPerPage = 10;


  const handleIncomingNewData = (newData) => {
    let newDataAdded = false;
    setData((prevData) => {
      const newDataExists = prevData.some(item => item.phoneNumber === newData.phoneNumber);
      if (!newDataExists) {
        newDataAdded = true;
        return [newData, ...prevData];
      } else {
        return prevData;
      }
    });
    if (newDataAdded) {
      setTotalRows((totalRows + 1));
    }
    newDataAdded = false;
  }


  const fetchData = async () => {
    try {
      if (!pageExistInData(currentPage, pagesAlreadyLoading)) {
        const response = await axios.get(`/api?page=${currentPage + 1}`);
        console.log("response: ", response)
        setData((prevData) => [...prevData, ...response.data.data]);
        setTotalRows(response.data.totalRows);
        setPagesAlreadyLoading((prevData) => [...prevData, currentPage]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };


  useEffect(() => {
    fetchData();

    client.subscribe("newData", handleIncomingNewData);

    return () => client.unsubscribe("newData", handleIncomingNewData)
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
    customToolbarSelect: () => { }
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

