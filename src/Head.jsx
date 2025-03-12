import React from "react";
import Main from "./Main";
import Header from "./Header";
import Footer from "./Footer";

function Head({setData,data}) {
    return (
        <div>
            <Header />
            <Main setData={setData} data={data}/>
            <Footer/>
        </div>
    );
}

export default Head;