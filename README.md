# Heicoders Academy SE100 Capstone Project
## Author: Xie Han Seng

This repository tracks the progress and also acts as the submission platform for the SE100 Capstone Project for Xie Han Seng.

Deployed Website URL: https://typicalalpaca.github.io/XieHanSeng-Capstone/


# Noted challenges with requirements:
1. Free AlphaVantage API does not provide latest (using the previous day) prices. Since date is generated automatically using computer's date value, this throws an error for invalid attempt to access a non-existent object retrieved from the API. Currently hard-coded just to show functionality.


# Requirements stated for SE100 Capstone Project

## Functional Requirements
1. **Stock Form**: Create a form component that allows users to enter the following details for a stock purchase:
    - Stock symbol (e.g., AAPL, GOOGL)
    - Quantity of shares purchased
    - Purchase price per share
    - The form should have input fields for each detail and a submit button to add the stock to the dashboard.
    - **You must not add invalid stock symbols to your stock list. For the purposes of this capstone project, an invalid stock symbol should just be ignored.**
        - Hint: You can infer whether a stock symbol is valid using the API response.

2. **Stock List**: Create a component that displays a list of all the stocks entered by the user. For each stock, show the following information:
    - Stock symbol
    - Quantity of shares
    - Purchase price per share
    - Current price per share (fetched from the AlphaVantage API)
    - Profit/Loss (calculated based on the purchase price and current price)
    If no stocks have been added, display a message indicating that no stocks are available.

3. **Styling**: Create a visually appealing and responsive design for the finance dashboard (what is shown in the demo is just a baseline design). Use CSS or a styling library of your choice to style the components, form, and stock list. Ensure that the layout is intuitive.

4. **API Integration**: Use the AlphaVantage API to fetch the current price for each stock. You will need to sign up for a free API key at https://www.alphavantage.co/.
    - Use the **`fetch`** library to make API requests.
    - Fetch the current price for each stock when the component mounts and whenever the stock list is updated.
    - Update the stock list with the fetched current prices and calculate the profit/loss.

5. **State Management**: Use the **`useState`** hook to manage the state of the stock list. Create a **`StockContext`** to store the stock list and provide it to the necessary components using the **`useContext`** hook.

6. **Conditional Rendering**: Implement conditional rendering in the stock list component to display a message when no stocks are available and to show the current price and profit/loss only when the data is available.

7. **Hooks**: Utilise the following hooks in your components:
    - **`useState`**: Manage the state of the stock form inputs and the stock list.
    - **`useEffect`**: Fetch the current stock prices from the API when the component mounts and whenever the stock list is updated.
    - **`useCallback`**: Memoize the function that fetches the stock data from the API to avoid unnecessary re-creations.
    - **`useContext`**: Access the stock list state from the **`StockContext`** in the necessary components.


## Marking Rubrics
1. **Functionality (40%)**: The finance dashboard should fulfil all the functional requirements mentioned above. The stock form should allow users to enter stock purchases, and the stock list should display the entered stocks along with their current prices and profit/loss.

2. **React Components and Hooks (30%)**: Properly structure your React components and utilise hooks such as **`useState`**, **`useEffect`**, **`useCallback`**, and **`useContext`**. Ensure that the components are reusable and follow best practices.

3. **API Integration (10%)**: Successfully integrate the AlphaVantage API to fetch the current stock prices. Handle API errors and loading states appropriately.

4. **State Management (10%)**: Effectively manage the state of the stock list using the **`useState`** hook and the **`StockContext`**. Ensure that the state is properly shared among the necessary components.

5. **Styling and UI/UX (10%)**: Improve on the existing baseline design to create a visually appealing and intuitive user interface for the finance dashboard. Use appropriate styling techniques and ensure responsiveness across different screen sizes.
