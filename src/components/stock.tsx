/** @jsx jsx */

import React from "react";
//@ts-ignore
import Trend from "react-trend";

import { css, jsx } from "@emotion/core";

interface Props {
  symbol: string;
  name: string;
}

interface State {
  open?: number;
  close?: number;
  histogram?: number[];
  status?: "+" | "-";
}

const getEndpointURL = (symbol: string) => {
  const proxy =
    process.env.NODE_ENV === "production"
      ? "https://cors-anywhere.herokuapp.com"
      : "http://127.0.0.1:8080";
  return `${proxy}/https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?&interval=5m`;
};

class Stock extends React.Component<Props, State> {
  static state: State = {};

  async fetchPrices(symbol: string) {
    let stockPrices: any;
    await fetch(getEndpointURL(symbol))
      .then(res => res.json())
      .then(data => (stockPrices = data));

    const data = stockPrices && stockPrices.chart.result[0].indicators.quote[0];
    this.setState({
      open: data.open[0].toFixed(2),
      close: data.close[0].toFixed(2),
      status: data.open[0] < data.close[0] ? "+" : "-",
      histogram: [...data.open]
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
          state && (state.status === "+" ? CSS.winning : CSS.losing)
        ]}
      >
        <div css={CSS.flexbox}>
          <div>
            <div css={CSS.symbol}>{this.props.symbol}</div>
            <div css={CSS.name}>{this.props.name}</div>
          </div>
          {state && (
            <div css={CSS.graph}>
              <Trend
                smooth
                autoDraw
                autoDrawDuration={1500}
                autoDrawEasing="ease-out"
                data={state.histogram}
                gradient={["#222"]}
                radius={10}
                strokeWidth={5}
                strokeLinecap={"butt"}
              />
            </div>
          )}
          <div css={CSS.status}>
            {state && (state.status === "+" ? "📈" : "📉")}
          </div>
        </div>
        {state && (
          <>
            <div css={CSS.grid}>
              <span>
                <strong>open:</strong> {state.open}
              </span>
              <span>
                <strong>close:</strong>
                {state.close}
              </span>
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

  flexbox: css({
    display: "flex"
  }),

  graph: css({
    flexGrow: 1,
    height: 36,
    "& svg": {
      height: "90%"
    }
  }),

  wrapper: css({
    margin: 10,
    padding: 10,
    borderRadius: "10px",
    boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.1)"
  }),

  symbol: css({
    fontWeight: "bolder"
  }),

  name: css({
    color: "#898989"
  }),

  grid: css({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "1fr",
    justifyItems: "left",
    alignItems: "center",
    color: "#9a9a9a",
    fontSize: 14,
    paddingTop: 8
  }),

  status: css({
    fontSize: "1.4em"
  })
};

export default Stock;
