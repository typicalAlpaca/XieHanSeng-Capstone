import React, { useState, createContext} from 'react'
import DashboardHeader from './DashboardHeader.jsx'
import Form from './StockForm.jsx'
import StockList from './StockList.jsx'
import { stockContext } from './StockContext.jsx'

import './App.css'


function App() {
  const [stocks, setStocks] = useState([]);

  return (
  <stockContext.Provider value={{stocks, setStocks}}>
    <DashboardHeader title="Finance Dashboard"/>
    <Form />
    <StockList />
  </stockContext.Provider>
  )
}

export default App;
