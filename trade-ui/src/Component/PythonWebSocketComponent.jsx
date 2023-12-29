// PythonWebSocketComponent.js
import React, { useReducer, useEffect } from 'react';
import WebSocketReducer, { actionTypes } from '../Reducer/WebSocketReducer';

const PythonWebSocketComponent = () => {
  const initialState = {
    loading: false,
    data: [],
    error: null,
  };

  const [state, dispatch] = useReducer(WebSocketReducer, initialState);

  useEffect(() => {
    const ws = new WebSocket('wss://nse-02lb.onrender.com/ws');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      dispatch({ type: actionTypes.FETCH_REQUEST });
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: newData });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch({ type: actionTypes.FETCH_FAILURE, payload: error.message });
    };

    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      {state.loading && <p>Loading...</p>}
      {state.data.length > 0 && (       
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">symbol</th>
                <th scope="col">identifier</th>
                <th scope="col">Open</th>
                <th scope="col">DayHigh</th>
                <th scope="col">DayLow</th>
                <th scope="col">LatestPrice</th>
                <th scope="col">PreviousClose</th>
                <th scope="col">Change</th>
                <th scope="col">%Change</th>
                <th scope="col">Total Trading Volume</th>
                <th scope="col">Total Trading Value</th>
                <th scope="col">Year High</th>
                <th scope="col">Year Low</th>
                <th scope="col">Last Updated Time</th>
                <th scope="col">365 Day</th>
                <th scope="col">30 Day</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((item) => (
                <tr key={item.symbol}>
                  <td scope="row">{item.symbol}</td>
                  <td>{item.identifier}</td>
                  <td>{item.open}</td>
                  <td>{item.dayHigh}</td>
                  <td>{item.dayLow}</td>
                  <td>{item.lastPrice}</td>
                  <td>{item.previousClose}</td>
                  <td>{item.change}</td>
                  <td>{item.pChange}</td>
                  <td>{item.totalTradedVolume}</td>
                  <td>{item.totalTradedValue}</td>
                  <td>{item.yearHigh}</td>
                  <td>{item.yearLow}</td>
                  <td>{item.lastUpdateTime}</td>
                  <td>{item.perChange365d}</td>
                  <td>{item.perChange30d}</td>
                  <td>
                    <a href="#"> Buy</a> <a href="#">Sell </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
      {state.error && <p>Error: {state.error}</p>}
    </>
  );
};

export default PythonWebSocketComponent;