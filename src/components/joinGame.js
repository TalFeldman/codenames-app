import React, { useState } from "react"
import WelcomePage from "./welcomePage";
import socket from "../socket";




export default function JoinGame(){


    const [userName, setUserName] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [joinAllowed, setJoinAllowed] = useState(true);



    const joinRoom = () => {

        if(userName && room) {
            const data = {
                room: room,
                userName: userName,
           
            }
            socket.emit("join_room", data);
            setShowChat(true);
            socket.on("join_not_allowed", () => {
                setJoinAllowed(false);
                setShowChat(false);
              });


        }
    }
    return (
        <div>
            {!showChat ? 
            <div className="joinChatContainer">
            <h1>Join A Game</h1>
            <input 
                type="text" 
                placeholder="User Name..." 
                onChange={(event) => setUserName(event.target.value)}
                ></input>
            <input 
                type="txet" 
                placeholder="Game ID..." 
                onChange={(event) => setRoom(event.target.value)}
                ></input>
            <button onClick={joinRoom}>Join</button>
            {!joinAllowed && (
            <p style={{ color: "red" }}>This game already started.</p>
          )}
            </div>
            : 
            <WelcomePage  userName={userName} room={room} /> 

            


            }
        </div>
    )
}