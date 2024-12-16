import React, { useState, useContext, useCallback, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { stockContext } from './StockContext.jsx'

import './StockForm.css'

const test = false;
const testURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo";
const apiURL = "https://www.alphavantage.co/query";
const apiKey = "611APNXO518ZI35V";

// Current API not returning stock prices for yesterday date. Using fixed date now
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

  const fetchCurrentPrices = useCallback(async () => {
    const fetchPromises = stocks.map(async (stock) => {
        // For each stock, fetch the current closing price and recalculate its new profitLoss margin
        const queryParams = {
            function: "TIME_SERIES_DAILY",
            symbol: stock.symbol,
            apikey: apiKey,
        };
    
        // Setting url
        const url = test ? testURL : `${apiURL}?${new URLSearchParams(queryParams).toString()}`;
        
        return fetch(url).then(res => {
            if(res.ok){
                return res.json();
            } else{
                throw new Error(`Failed to fetch data for ${stock.symbol} due to error: ${res.status}`);
            }
        }).then(data => {
            if("Error Message" in data){
                throw new Error("Invalid stock symbol. Please double-check valid stock symbols from 'https://www.alphavantage.co/documentation' under TIME_SERIES_DAILY");
            }
            
            let currentPrice = test ? parseFloat(data["Global Quote"]["05. price"]).toFixed(2) : parseFloat(data["Time Series (Daily)"][ytdDate]['4. close']).toFixed(2);
            let profitLoss = ((currentPrice - stock.purchasePrice) * stock.qty).toFixed(2);

            console.log(`Updated ${stock.id}: ${stock.symbol} current price`);
            return {...stock, currentPrice: currentPrice, profitLoss: profitLoss};
        });
    });

    try {
        const updatedStocks = await Promise.all(fetchPromises);
        setStocks(updatedStocks);
    } catch (err){
        alert(err);
    }
  }, [stocks]);

  // Set dependency to stocks.length so that it only updates when addStock successfully
  // adds a stock, not when fetchCurrentPrices updates stock prices in stocks
  useEffect(() => {
    fetchCurrentPrices();
  }, [stocks.length]);

  const addStock = useCallback(() => {
    const symbol = document.getElementById("stockSymbol");
    const qty = document.getElementById("stockQuantity");
    const price = document.getElementById("stockPurchasePrice");

    // Form checking
    if(!symbol.value || !qty.value || !price.value){
      alert("Invalid form input, please reenter");
      return;
    }

    // API Check for validity of stock prior to adding. 
    const queryParams = {
      function: "TIME_SERIES_DAILY",
      symbol: symbol.value,
      apikey: apiKey,
    };

    // Setting url
    const url = test ? testURL : `${apiURL}?${new URLSearchParams(queryParams).toString()}`;
    
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
      let currentPrice = test ? parseFloat(data["Global Quote"]["05. price"]).toFixed(2) : parseFloat(data["Time Series (Daily)"][ytdDate]["4. close"]).toFixed(2);
      let profitLoss = ((currentPrice - purchasePrice) * parseFloat(qty.value)).toFixed(2);

      setStocks([...stocks, {
        id: Object.keys(stocks).length + 1,
        symbol: symbol.value,
        qty: parseInt(qty.value),
        purchasePrice: purchasePrice,
        currentPrice: currentPrice,
        profitLoss: profitLoss
      }])
    
      // Clear form inputs
      setStockSymbol("");
      setStockQuantity("");
      setStockPurchasePrice("");

    }).catch(error => {
      alert(error.message);
    })
  }, [stocks]);

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

export default Form;
