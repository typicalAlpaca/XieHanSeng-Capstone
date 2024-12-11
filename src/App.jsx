import { useState } from 'react'
import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import stocksLogo from '/stocks.svg'

import './App.css'

const title = "Finance Dashboard";

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

  const addStock = () => {
    let parent = document.getElementById("stockListSection");
    let ul = document.getElementById("stockList");
    let symbol = document.getElementById("stockSymbol");
    let qty = document.getElementById("stockQuantity");
    let price = document.getElementById("stockPurchasePrice");
  
    // Form checking
    if(!symbol.value || !qty.value || !price.value){
      alert("Invalid form input, please reenter");
      return;
    }
  
    // Remove placeholder stock if still present
    if(document.getElementById("placeholderStock")){
      parent.removeChild(document.getElementById("placeholderStock"));
    }
  
    // Append new stock added
    ul.appendChild(createStock(ul.childElementCount + 1, symbol.value, qty.value, price.value));
  
    // Clear form inputs
    setStockSymbol("");
    setStockQuantity("");
    setStockPurchasePrice("");
    return;
  }

  const createStock = (id, symbol, qty, price) => {
    let li = document.createElement("li");
    li.setAttribute("id", id);
  
    const createParagraph = (label, value) => {
      let newElement = document.createElement("p");
      newElement.appendChild(document.createTextNode(`${label} : ${value}`));
      return newElement;
    }
    
    li.appendChild(createParagraph("Symbol", symbol));
    li.appendChild(createParagraph("Quantity", qty));
    li.appendChild(createParagraph("Purchase Price", price));
    li.appendChild(createParagraph("Current Price", "XXX"));
    li.appendChild(createParagraph("Profit/Loss", "+/-XXXX"));
  
    return li;
  }

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
  return(
    <section id="stockListSection">
      <h2>Stock List</h2>
      <p id="placeholderStock">No stocks currently</p>
      <ul id="stockList">
      </ul>
    </section>
)}

function App() {
  return <>
    <DashboardHeader />
    <Form />
    <StockList />
  </>
}

export default App
