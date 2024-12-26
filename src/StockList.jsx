import React, { useContext } from 'react'
import { stockContext } from './StockContext.jsx'

import './StockList.css'


function StockList() {
    const {stocks} = useContext(stockContext);
  
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
                <p>Purchase Price : {`$${Number(stock.purchasePrice).toLocaleString("en-US")}`}</p>
                <p>Current Price  : {`$${Number(stock.currentPrice).toLocaleString("en-US")}`}</p>
                <p className={stock.profitLoss >= 0 ? "positive" : "negative"}>Profit/Loss    : <strong>{stock.profitLoss >= 0 ? `+$${Number(stock.profitLoss).toLocaleString("en-US")}` : `-$${Number(-stock.profitLoss).toLocaleString("en-US")}`}</strong></p>
              </li>
            ))}
          </ul>
        )}
      </section>
  )
}

export default StockList
