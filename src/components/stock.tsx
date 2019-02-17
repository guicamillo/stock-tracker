/** @jsx jsx */

import React from "react";
import { css, jsx } from "@emotion/core";

interface Props {
  symbol: string;
  name: string;
}

interface State {
  open: number;
  close: number;
  low: number;
  high: number;
  status?: "+" | "-";
}

const API_KEY = "demo";
const getEndpointURL = (symbol: string) =>
  `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?&interval=5m`;

class Stock extends React.Component<Props, State> {
  static state: State = {
    open: 0,
    close: 0,
    low: 0,
    high: 0
  };

  async fetchPrices(symbol: string) {
    let stockPrices: any;

    await fetch(getEndpointURL(symbol))
      .then(res => res.json())
      .then(data => (stockPrices = data));

    const data = stockPrices && stockPrices.chart.result[0].indicators.quote[0];
    this.setState({
      open: data.open[0].toFixed(2),
      close: data.close[0].toFixed(2),
      low: data.low[0].toFixed(2),
      high: data.high[0].toFixed(2),
      status: data.open[0] < data.close[0] ? "+" : "-"
    });
  }

  componentWillMount() {
    this.fetchPrices(this.props.symbol);
  }

  render() {
    const { state } = this;

    return (
      <div
        css={[
          CSS.wrapper,
          state && state.status === "+" ? CSS.winning : CSS.losing
        ]}
      >
        <div css={CSS.symbol}>{this.props.symbol}</div>
        <div css={CSS.name}>{this.props.name}</div>
        <div css={CSS.status}>
          {state && (state.status === "+" ? "📈" : "📉")}
        </div>
        {state && (
          <>
            <div css={CSS.grid}>
              <span>open: {state.open}</span>
              <span>close: {state.close}</span>
              <span>🔻 {state.low}</span>
              <span>🔺 {state.high}</span>
            </div>
          </>
        )}
      </div>
    );
  }
}

const CSS = {
  winning: css({
    background: "rgba(0, 150, 0, 0.15)"
  }),

  losing: css({
    background: "rgba(150, 0, 0, 0.15)"
  }),

  wrapper: css({
    margin: 10,
    padding: 10,
    border: "1px solid #EFEFEF",
    borderRadius: "2px",
    position: "relative"
  }),

  symbol: css({
    fontWeight: "bolder"
  }),

  name: css({
    color: "#898989"
  }),

  grid: css({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    justifyItems: "center",
    alignItems: "center",
    color: "#9a9a9a",
    fontSize: 14
  }),

  status: css({
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: "1.4em"
  })
};

export default Stock;
