import React, { useEffect, useState } from "react";
import CreateGroups from "./createGroups";
import Chat from "./chat";
import Game from "./game";
import PopUp from "./popup";
import socket from "../socket";


export default function WelcomePage({userName, room}) {

  const [usersList, setUsersList] = useState([userName]);
  const [ready, setReady] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [showPopUP, setShowPopUp] = useState(false);



  const adminReadyStatus = (status) => {
    setReady(status);
  };


  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
  })


  useEffect(() => {

    const newUser = (user) => {
      setUsersList(user);
    };
    const gameStarted = () => {
        setStartGame(true);
      };
    socket.on("user_list", newUser);
    socket.on("admin_ready_status", adminReadyStatus);
    socket.on("start_game", gameStarted);

  }, [socket, room]);

  const handleReady = () => {
    if(usersList.length < 4){
      setShowPopUp(true);
    }
    else{
      setReady(true);
      socket.emit("admin_ready", { room });
    }

  };

  const isAdmin = usersList[0]?.userName === userName;
  

  return (
    <div className="welcome-container">
      {!startGame ? (
        !ready ? (
          <div>
            <h3>Welcome To Game ID: {room}</h3>
            {usersList.map((user) => (
              <>
                {user.isAdmin ? (
                  <p>{user.userName} (admin) </p>
                ) : (
                  <p>{user.userName}</p>
                )}
              </>
            ))}
            {isAdmin ? (
              <>
              <button onClick={handleReady}>Ready</button>
              {showPopUP && <PopUp content={"There must be at least 4 players"} handleClose={()=> setShowPopUp(false)} options={false}/>}
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          <>
            {isAdmin ? (
              <CreateGroups
                usersList={usersList}
                socket={socket}
                room={room}
              />
            ) : (
              <div className="waiting">
                <div className="loader"></div>
                <h2>Waiting for the admin to create groups...</h2>
              </div>
            )}
          </>
        )
      ) : (
        <Game room={room} currentUser={userName} />

      )}
      <Chat socket={socket} userName={userName} room={room} />
    </div>
  );
}
