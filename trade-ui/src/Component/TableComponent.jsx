import React, { useEffect, useState } from 'react';
import { RapidApi, PYTHON_API, PYTHON_Socket, PythonApiUrl, PythonSocketUrl, RapidApiUrl, BuySellApiUrl } from "../constants";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';

function TableComponent(props) {
    const [tableData, setTableData] = useState([]);
    const [niftyRecord, setNiftyRecord] = useState([]);
    const [niftyValue, setniftyValue] = useState('');
    const [previousApiData, setPreviousApiData] = useState([]);
    const [previousWSSData, setPreviousWSSData] = useState([]);
    const [rowColors, setRowColors] = useState([]);
    const [orderData, setOrderData] = useState({
        "symbol": "",
        "lastPrice": "",
        "priceValue": "",
        "quantity": "",
        "orderType": ""
    });
    const [niftyPercentChngeValue, setniftyPercentChngeValue] = useState('');
    const [isBuy, setIsBuy] = useState(true);
    const [showBuySellPopUp, setShowBuySellPopUp] = useState(false);
    const data = props.data;
    const setNiftyData = props?.setNiftyData;

    const storedUser = localStorage.getItem("loggedUser");
   const storedUserObject = JSON.parse(storedUser);
   const userID = storedUserObject.userId;

    const handleCloseBuySellPopUp = () => setShowBuySellPopUp(false);

    const handleShowBuySellPopUp = (rowData, isBuy) => {
        setOrderData({
            "symbol": rowData.symbol,
            "lastPrice": rowData.lastPrice,
            "priceValue": "",
            "quantity": "",
            "orderType": isBuy ? "B" : "S"
        });

        setIsBuy(isBuy);
        setShowBuySellPopUp(true);
    };

    function onPriceChange(event) {
        setOrderData({
            "symbol": orderData.symbol,
            "lastPrice": orderData.lastPrice,
            "priceValue": event.target.value,
            "quantity": orderData.quantity,
            "orderType": orderData.orderType
        });

        console.log(niftyRecord + " " + data);
    }

    function onQuantityChange(event) {
        setOrderData({
            "symbol": orderData.symbol,
            "lastPrice": orderData.lastPrice,
            "priceValue": orderData.priceValue,
            "quantity": event.target.value,
            "orderType": orderData.orderType
        });
    }

    function handleSubmit(event) {
        axios
            .post(BuySellApiUrl, {
                userid: userID,
                type: orderData.orderType,
                symbol: orderData.symbol,
                cmp: orderData.lastPrice,
                price: orderData.priceValue,
                quantity: orderData.quantity
            })
            .then((response) => {
                console.log(response);
                alert('Record Saved Successfully!');
                handleCloseBuySellPopUp();
            })
            .catch((error) => {
                console.log(error);
                alert('Error Occurred!');
                handleCloseBuySellPopUp();
            });
        event.preventDefault();
    }

    // Function to execute the API call
    const fetchDataFromPythonApi = async () => {
        try {
            const response = await fetch(PythonApiUrl);
            if (response.ok) {
                const api_response = await response.json();
                if (JSON.stringify(api_response) !== JSON.stringify(previousApiData)) {
                    const newRowColors = api_response.map((rowData) => {
                        const previousRow = previousApiData.find((prevData) => prevData.symbol === rowData.symbol);
                        const change = previousRow && rowData.change - previousRow.change;
                        return {
                            symbol: rowData.symbol,
                            color: change > 0 ? 'greenyellow' : change < 0 ? 'aqua' : 'blue',
                        };
                    });

                    setRowColors(newRowColors);
                }
                setPreviousApiData(api_response);
                
                let data = api_response.filter((data) => data.symbol !== 'NIFTY 50');
                let nData = api_response.filter((data) => data.symbol === 'NIFTY 50');
                setTableData(data);
                setNiftyRecord(nData[0]);
                setniftyValue(nData[0].lastPrice);
                setniftyPercentChngeValue(nData[0].pChange);
                setNiftyData(nData[0]);
                console.log('Python API call executed successfully:', api_response);
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const fetchDataFromRapidApi = () => {
        axios({
            method: "GET",
            url: RapidApiUrl,
            params: {
                Indices: "NIFTY 50",
            },
            headers: {
                "X-RapidAPI-Key": "7d5788b016mshdf3d75bd954ed38p1a2a1cjsne8d78716621b",
                "X-RapidAPI-Host": "latest-stock-price.p.rapidapi.com",
            },
        })
            .then((res) => {
                let data = res.data.filter((data) => data.symbol !== 'NIFTY 50');
                let nData = res.data.filter((data) => data.symbol === 'NIFTY 50');
                setTableData(data);
                setNiftyData(nData[0]);
                setniftyValue(nData[0].lastPrice);
                setniftyPercentChngeValue(nData[0].pChange);
                console.log("Rapid Api called.");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const formatNumber = (number) => {
        return parseFloat(number).toFixed(2);
    };

    useEffect(() => {
        if (props.data === PYTHON_Socket) {
            const ws = new WebSocket(PythonSocketUrl);
            console.log("WSS");
            ws.onopen = () => {
                console.log('WebSocket connection established.');
            };

            ws.onmessage = (event) => {
                const newData = JSON.parse(event.data);
                let data = newData.filter((data) => data.symbol !== 'NIFTY 50');
                let nData = newData.filter((data) => data.symbol === 'NIFTY 50');
                
                setNiftyData(nData[0]);
                setniftyValue(nData[0].lastPrice);
                setniftyPercentChngeValue(nData[0].pChange);
                if (JSON.stringify(data) !== JSON.stringify(previousWSSData)) {
                    console.log("Web socket called....");
                    const newRowColors = data.map((rowData) => {
                        const oldData = previousWSSData.find((prevData) => prevData.symbol === rowData.symbol);
                        const change = oldData && rowData.change - oldData.change;

                        return {
                            symbol: rowData.symbol,
                            color: change > 0 ? 'greenyellow' : change < 0 ? 'aqua' : 'blue',
                        };
                    });
                    setRowColors(newRowColors);
                }
                setPreviousWSSData(data);
                setTableData(data);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return () => {
                ws.close();
            };
        }
    }, [props.data, setPreviousWSSData, setTableData]);

    useEffect(() => {
        const fetchData = () => {
            if (props.data === PYTHON_API) {
                fetchDataFromPythonApi();
            } else if (props.data === RapidApi) {
                fetchDataFromRapidApi();
            }
        };

        fetchData();

    }, [props.data, fetchDataFromPythonApi, fetchDataFromRapidApi]);

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col">Identifier</th>
                        <th scope="col">Open</th>
                        <th scope="col">Day High</th>
                        <th scope="col">Day Low</th>
                        <th scope="col">Latest Price</th>
                        <th scope="col">Previous Close</th>
                        <th scope="col">Change</th>
                        <th scope="col">%Change</th>
                        <th scope="col">Total Trading Volume</th>
                        <th scope="col">Total Trading Value</th>
                        <th scope="col">Year High</th>
                        <th scope="col">Year Low</th>
                        <th scope="col">Last Updated Time</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((rowData, index) => {
                        const rowColor = rowColors.find(
                            (colorData) => colorData.symbol === rowData.symbol
                        )?.color;

                        return (
                            <tr key={index}>
                                <td scope="row" style={{ backgroundColor: rowColor }}>{rowData.symbol}</td>
                                <td style={{ backgroundColor: rowColor }}>{rowData.identifier}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.open)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.dayHigh)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.dayLow)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.lastPrice)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.previousClose)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.change)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.pChange)}</td>
                                <td style={{ backgroundColor: rowColor}}>{rowData.totalTradedVolume}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.totalTradedValue)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.yearHigh)}</td>
                                <td style={{ backgroundColor: rowColor,textAlign: 'right'}}>{formatNumber(rowData.yearLow)}</td>
                                <td style={{ backgroundColor: rowColor }}>{rowData.lastUpdateTime}</td>
                                <td style={{ backgroundColor: rowColor }}>
                                    <a href="#" onClick={() => handleShowBuySellPopUp(rowData, true)}>Buy</a>&nbsp;
                                    <a href="#" onClick={() => handleShowBuySellPopUp(rowData, false)}>Sell</a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Modal size="lg" show={showBuySellPopUp} onHide={handleCloseBuySellPopUp}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Order Setting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <p>
                                Hi! #FirstName# welcome to Vlink trading platform Nifty: <b>{niftyValue}</b> Change: <b>{niftyPercentChngeValue}%</b>
                            </p>
                            <h5>{isBuy ? "Buy" : "Sell"} Order</h5>
                            <p>
                                Scrip <input type="text" className="form-control" name="scrip" value={orderData.symbol} disabled></input>
                            </p>
                            <p>
                                CMP <input type="text" className="form-control" name="cmp" value={orderData.lastPrice} disabled></input>
                            </p>
                            <p>
                                Quantity <input type="text" className="form-control" name="qty" value={orderData.quantity} onChange={onQuantityChange}></input>
                            </p>
                            <p>
                                Price <input type="text" className="form-control" name="price" value={orderData.priceValue} onChange={onPriceChange}></input>
                            </p>
                            <p>
                                <input type="submit" value="Submit" class="btn btn-primary" />&nbsp;
                                <input
                                    type="button"
                                    value="Cancel"
                                    class="btn btn-primary"
                                    onClick={handleCloseBuySellPopUp}
                                />
                            </p>
                        </div>
                    </form></Modal.Body>
            </Modal>
        </div>
    )
}

export default TableComponent;