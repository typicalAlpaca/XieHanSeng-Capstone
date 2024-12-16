import React from 'react'
import stocksLogo from '/stocks.svg'

import './DashboardHeader.css'

function DashboardHeader({title}) {
    return (
    <header>
      <img src={stocksLogo} className="logo" alt="Stocks Logo" />
      <h1>{title}</h1>
    </header>
  )
}

export default DashboardHeader
