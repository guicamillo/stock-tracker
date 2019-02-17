/** @jsx jsx */

import React, { Component } from "react";
import { css, jsx } from "@emotion/core";

import Stock from "./components/stock";

class App extends Component {
  render() {
    return (
      <div>
        <Stock symbol="MSFT" name="Microsoft" />
        <Stock symbol="AAPL" name="Apple" />
        <Stock symbol="ATVI" name="Activision" />
        <Stock symbol="GOOGL" name="Google" />
        <Stock symbol="NFLX" name="Netflix" />
        <Stock symbol="TSLA" name="Tesla" />
      </div>
    );
  }
}

export default App;
