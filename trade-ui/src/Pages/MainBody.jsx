import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import TradeData from "./TradeData";

function MainBody(){
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/trade" element={ localStorage.getItem("isAuthenticated") == "true" ? <TradeData/> : <LoginPage />} />
            </Routes>
        </Router>
    )
}

export default MainBody;