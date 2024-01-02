import React from 'react';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';

// import TableComponent from "../Component/TableComponent";
//import { RapidApi, PYTHON_API, PYTHON_Socket } from "../constants";

function TradeData() {
    let niftyData = {};
    // const [key, setKey] = useState('home');
    // const [niftyData, setNiftyData] = useState({});
    // const [activeTabData, setActiveTabData] = useState(RapidApi);
    // const setNiftyRecord = (niftyData) => {
    //     setNiftyData(niftyData);
    // }

   const storedUser = localStorage.getItem("loggedUser");
   const storedUserObject = JSON.parse(storedUser);
   const firstName = storedUserObject.firstName;

    // useEffect(() => {
    //     // Fetch data or perform any other side effects based on the active tab
    //     switch (key) {
    //         case 'rapid':
    //             setActiveTabData(RapidApi);
    //             break;
    //         case 'pythonAPI':
    //             setActiveTabData(PYTHON_API);
    //             break;
    //         case 'pythonSocket':
    //             setActiveTabData(PYTHON_Socket);
    //             break;
    //         default:
    //             break;
    //     }
    // }, [key]);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/trade">Home</a></li>
                        <li className="breadcrumb-item">Trade Details</li>
                    </ol>
                </nav>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-lg-3">
                                    <h5> Hi!  {firstName}</h5>
                                </div>
                                <div className="col-lg-3">
                                    Welcome to Vlink Trading Plateform
                                </div>
                                <div className="col-lg-1">
                                    Nifty <h5>{niftyData?.lastPrice}</h5>
                                </div>
                                <div className="col-lg-4">
                                    Change <h5>{niftyData?.pChange}</h5>
                                </div>
                                <div className="col-lg-1">
                                    <a className="btn btn-primary" href="/" onClick={() => { return (localStorage.setItem("isAuthenticated", false)); }}>Logout</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">

                            {/* <Tabs id="tradeGrid" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                                <Tab eventKey="rapid" title="Rapid">
                                    <TableComponent data={activeTabData} setNiftyData={setNiftyRecord} />
                                </Tab>

                                <Tab eventKey="pythonAPI" title="Python API">
                                    <TableComponent data={activeTabData} setNiftyData={setNiftyRecord} />
                                </Tab>

                                <Tab eventKey="pythonSocket" title="Python Socket">
                                    <TableComponent data={activeTabData} setNiftyData={setNiftyRecord} />
                                </Tab>
                            </Tabs> */}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default TradeData;