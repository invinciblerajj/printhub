import React from "react";
import Head from "./Head";
import Payment from "./Payment";
import { useState } from "react";
import { BrowserRouter as Router,Routes , Route } from "react-router-dom";
import Admin from "./Admin";


function App(){
    const [data,setData] = useState({
        block:'',
        date:'',
        color:'',
        amount:'',
        mail: '',
    });
    return(
        <Router> 
            <Routes>
                <Route path="/" element={<Head setData={setData} data={data}/>}/>
                <Route path="/payment" element={<Payment data={data}/>}/>
                <Route path='/admin' element={<Admin/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;