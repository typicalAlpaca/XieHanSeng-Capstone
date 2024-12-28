import React, { useState, useContext, useCallback, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { stockContext } from './StockContext.jsx'

import './StockForm.css'

const test = false;
const testURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo";
const apiURL = "https://www.alphavantage.co/query";
const apiKey = "611APNXO518ZI35V"; // Yes haha not supposed to provide a public API key but honestly its free so...

// Current API not returning stock prices for yesterday date. Using fixed date for now.
// const ytdDate = GetYesterdayDate();
const ytdDate = "2024-12-12";

function GetYesterdayDate() {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  // Format the date as YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function Form() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockPurchasePrice, setStockPurchasePrice] = useState('');
  const {stocks, setStocks} = useContext(stockContext);

  // Function for retrieving stock prices via the AlphaVantage API.
  // Using useCallback hook to prevent recreation of this function
  const fetchPrice = useCallback(async (stock) => {
    // Fetch current closing price and calculate profitLoss margin    
    const queryParams = {
      function: "TIME_SERIES_DAILY",
      symbol: stock.symbol,
      apikey: apiKey,
    };

    // Setting url depending on test or practical
    const url = test ? testURL : `${apiURL}?${new URLSearchParams(queryParams).toString()}`;

    return fetch(url).then(res => {
      if(res.ok){
        return res.json();
      } else {
        throw new Error(`Failed to fetch data for ${stock.symbol} due to error code: ${res.status}`);
      }
    }).then(data => {
      // Catch invalid stock symbols
      if("Error Message" in data){
        throw new Error("Invalid stock symbol. Please double-check valid stock symbols from 'https://www.alphavantage.co/documentation' under TIME_SERIES_DAILY");
      }
      
      let currentPrice = test ? parseFloat(data["Global Quote"]["05. price"]).toFixed(2) : parseFloat(data["Time Series (Daily)"][ytdDate]['4. close']).toFixed(2);
      let profitLoss = ((currentPrice - stock.purchasePrice) * stock.qty).toFixed(2);

      console.log(`Fetched ${stock.id}: ${stock.symbol} current price and updated its profitLoss`);
      return {...stock, currentPrice: currentPrice, profitLoss: profitLoss};
    }).catch(err => {
      alert(err);
      return false;
    });
  }, []);

  // Function for updating prices of all stocks
  const fetchCurrentPrices = async () => {
    console.log("Updating current prices for all stocks in stockList...");
    const fetchPromises = stocks.map(fetchPrice);
    try {
        const updatedStocks = await Promise.all(fetchPromises);
        setStocks(updatedStocks);
        console.log("Successfully updated all stock current prices");
    } catch (err){
        alert(err);
    }
  };

  // Set dependency to stocks.length so that it only updates all stock prices when addStock
  // successfully adds a stock, not when fetchCurrentPrices updates stock prices in stocks
  useEffect(() => {
    fetchCurrentPrices();
  }, [stocks.length]);

  const addStock = async () => {
    // Form checking
    if(!stockSymbol || !stockQuantity || !stockPurchasePrice){
      alert("Invalid form input, please reenter");
      return;
    }

    // API Check for validity of stock prior to adding. 
    let stock = await fetchPrice({
      id: Object.keys(stocks).length + 1,
      symbol: stockSymbol,
      qty: parseInt(stockQuantity),
      purchasePrice: parseInt(stockPurchasePrice).toFixed(2),
      currentPrice: 0,
      profitLoss: 0
    });

    // If return {}, it means fetchPrice threw an error which means stock shouldn't be added.
    if(!stock){
      return;
    }

    // Add valid stock to stocks
    setStocks([...stocks, stock]);

    // Clear form inputs
    setStockSymbol("");
    setStockQuantity("");
    setStockPurchasePrice("");
  };

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
        onChange={event => setStockQuantity(event.target.value)}/>
      <TextField
        id="stockPurchasePrice"
        variant="filled"
        type="number"
        size="small"
        label="Purchase Price"
        placeholder="Purchase Price"
        value={stockPurchasePrice}
        onChange={event => setStockPurchasePrice(event.target.value)}/>
      <Button type="submit" onClick={addStock} variant="contained">Add Stock</Button>
    </form>
)}

export default Form;
