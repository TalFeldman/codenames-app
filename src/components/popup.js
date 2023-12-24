import { useEffect, useState } from "react";

export default function PopUp ( {content, handleClose, options} ) {
    

    return (
    
                <div className="popup">
                    <div className="popup-content">
                        <p>{content}</p>
                        {options? 
                        <>
                        <button>Yes</button>
                        <button style={{ backgroundColor: "red"}}>No</button>
                        </>
                    :
                    <button onClick={() => handleClose()}>OK</button>
                    }
                        
                    </div>
                </div>
     
    )
}