import { useState, createContext, useContext, useCallback, useEffect } from 'react'
import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import stocksLogo from '/stocks.svg'

import './App.css'

const testURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo";
const apiURL = "https://www.alphavantage.co/query";
const apiKey = "611APNXO518ZI35V";
const ytdDate = GetYesterdayDate();

const title = "Finance Dashboard";
const stockContext = createContext();


function GetYesterdayDate() {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  // Format the date as YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function DashboardHeader() {
  return (
  <header>
    <img src={stocksLogo} className="logo" alt="Stocks Logo" />
    <h1>{title}</h1>
  </header>
)}

function Form() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockPurchasePrice, setStockPurchasePrice] = useState('');
  const {stocks, setStocks} = useContext(stockContext);

  const addStock = useCallback(() => {
    const parent = document.getElementById("stockListSection");
    const symbol = document.getElementById("stockSymbol");
    const qty = document.getElementById("stockQuantity");
    const price = document.getElementById("stockPurchasePrice");

    // Form checking
    if(!symbol.value || !qty.value || !price.value){
      alert("Invalid form input, please reenter");
      return;
    }

    // API Check
    const queryParams = {
      function: "TIME_SERIES_DAILY",
      symbol: symbol.value,
      apikey: apiKey,
    }

    // const url = `${apiURL}?${new URLSearchParams(queryParams).toString()}`
    const url = testURL // Test line
    
    fetch(url).then((res) => {
      if(res.ok){
        return res.json();
      } else{
        throw new Error(res.status);
      }
    }).then((data) => {
      // Append new stock added
      if("Error Message" in data){
        throw new Error("Invalid stock symbol. Please double-check valid stock symbols from 'https://www.alphavantage.co/documentation' under TIME_SERIES_DAILY");
      }
      
      let purchasePrice = parseFloat(price.value).toFixed(2);
      // let currentPrice = parseFloat(data["Time Series (Daily)"][ytdDate]['4. close']).toFixed(2);
      let currentPrice = parseFloat(data["Global Quote"]["05. price"]).toFixed(2);   // Test line
      let profitLoss = ((currentPrice - purchasePrice) * parseFloat(qty.value)).toFixed(2);

      setStocks([...stocks, {
        id: Object.keys(stocks).length + 1,
        symbol: symbol.value,
        qty: parseInt(qty.value),
        purchPrice: purchasePrice,
        currPrice: currentPrice,
        profitLoss: profitLoss
      }])
    
      // Clear form inputs
      setStockSymbol("");
      setStockQuantity("");
      setStockPurchasePrice("");

    }).catch(error => {
      alert(error.message);
    })
  }, []);

  return (
    <form className="stockForm" onSubmit={event => event.preventDefault()}>
      <TextField 
        id="stockSymbol"
        variant="filled"
        type="text"
        size="small"
        label="Stock Symbol"
        placeholder="Stock Symbol"
        value={stockSymbol}
        onChange={event=> setStockSymbol(event.target.value)}/>
      <TextField
        id="stockQuantity"
        variant="filled"
        type="number"
        size="small"
        label="Quantity"
        placeholder="Quantity"
        value={stockQuantity}
        onChange={event=> setStockQuantity(event.target.value)}/>
      <TextField
        id="stockPurchasePrice"
        variant="filled"
        type="number"
        size="small"
        label="Purchase Price"
        placeholder="Purchase Price"
        value={stockPurchasePrice}
        onChange={event=> setStockPurchasePrice(event.target.value)}/>
      <Button type="submit" onClick={addStock} variant="contained">Add Stock</Button>
    </form>
)}

function StockList() {
  const {stocks, setStocks} = useContext(stockContext);

  return(
    <section id="stockListSection">
      <h2>Stock List</h2>
      {stocks.length == 0 ? (
        <p id="placeholderStock">No stocks added yet</p>
      ) : (
        <ul id="stockList">
          {stocks.map(stock => (
            <li key={stock.id}>
              <p><strong>Symbol         : {stock.symbol}</strong></p>
              <p>Quantity       : {stock.qty.toLocaleString("en-US")}</p>
              <p>Purchase Price : {`$${Number(stock.purchPrice).toLocaleString("en-US")}`}</p>
              <p>Current Price  : {`$${Number(stock.currPrice).toLocaleString("en-US")}`}</p>
              <p style={stock.profitLoss >= 0 ? {color:"#080"} : {color:"#f00"}}>Profit/Loss    : {stock.profitLoss >= 0 ? `+$${Number(stock.profitLoss).toLocaleString("en-US")}` : `-$${Number(-stock.profitLoss).toLocaleString("en-US")}`}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
)}

function App() {
  const [stocks, setStocks] = useState("");

  return (
  <stockContext.Provider value={{stocks, setStocks}}>
    <DashboardHeader />
    <Form />
    <StockList />
  </stockContext.Provider>
)}

export default App
