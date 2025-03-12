import React from "react";
import './Header.css';


function Header(){
    return(
        <div className="head">
            <div className="title">
                <h2 className="t1">PRINT<span className="hub">HUB</span></h2>
                <h3 className="t2">Stand Out of Queue</h3>
                <div className="greet">
                    <p>Made with ❤️, By the Student, for the Student.</p>
                </div>
            </div>
        </div>
    );
}

export default Header;