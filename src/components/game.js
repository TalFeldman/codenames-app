import { useEffect, useState } from "react";
import socket from "../socket";
import Cards from "./cards";
import PopUp from "./popup";
import red from '../images/red.jpg';
import blue from '../images/blue.jpg';
import natural from '../images/natural2.jpg';



export default function Game({ room, currentUser }) {

    const [game, setGame] = useState({});
    const [msg, setMsg] = useState(false);
    const [currCaptain, setCurrCaptain] = useState();
    const [wordCode, setWordCode] = useState();
    const [numOfGuesses, setNumOfGuesses] = useState();
    const [userDisconnected, setUserDisconnected] = useState("");



    useEffect(() => {
      const beforeUnloadHandler = (event) => {
        event.preventDefault();
      
        event.returnValue = true;
      };
      window.addEventListener("beforeunload", beforeUnloadHandler);
    });

    const fetchGameDetails = () => {
      socket.emit("game_details", { room });
    };
    useEffect(() => {

        const newGame = (game) => {
            setGame(game[0]);
            if(game[0].turn){
              setCurrCaptain(game[0].captains.red);

            }
            else{
              setCurrCaptain(game[0].captains.blue);

            }

        };
        fetchGameDetails();
        socket.on("get_game_details", newGame);


    },[room, socket]);



      useEffect(() => {
        if (game.msg) {
          setMsg(true);
        }
      }, [game.msg]);

      useEffect(() => {
        // Start listening for "receive_message" events
        socket.on("disconnected_user", (data) => {
            setUserDisconnected(data.user.userName);
        });
      }, [socket]);


      const renderImages = (color) => {
        let numOfImg;
        let imgSrc;
        if (color === 'red') {
          numOfImg = game.redTotal - game.redCorrect;
          imgSrc = red
        }
        else if (color === 'blue') { 
          numOfImg = game.blueTotal - game.blueCorrect;
          imgSrc = blue
        }
        else {
          numOfImg = game.yellowTotal;
          imgSrc = natural;
        }
        const images = [];
      if(numOfImg > 0){
        for (let i = 0; i < numOfImg ; i++) {
          images.push(
            <img
              key={i}
              className="image"
              src= {imgSrc}
              style={{ left: `${i * 8}px`  }} 
              alt={`Image ${i + 1}`}
            />
          );
        }
      
      }

        return images;
      };


      const handleCaptain = () => {

        socket.emit("captain_choose", {room: game.room, wordCode, numOfGuesses});
        fetchGameDetails();

        const updateGame = (updatedGame) => {
          setGame(updatedGame[0]);
          setWordCode("");
          setNumOfGuesses("");
        }

        socket.on("get_game_details", updateGame);
      }

      const chooseCard = async (card) => {
        
        await socket.emit("choose_word", { room: game.room, card });
        fetchGameDetails();
        const updateGame = (updatedGame) => {
          setGame(updatedGame[0]);
        }
        socket.on("get_game_details", updateGame);

      }


    return(
      <>
      {!msg && game.gameOver? 
        <p>Game Over </p> 
        :
        <>
        <div className="user-name">
          <p>Hi {currentUser} &#128571;</p>
        </div>
        <div className="game-container">
          {(msg && <PopUp content={game.msg} handleClose= {() => setMsg(false)}/>) || 
          (userDisconnected !== "" && <PopUp content={`${userDisconnected} disconnected`} handleClose={() => setUserDisconnected("")}/>)}
          
        <div className="red-players">
          {game.redTeam? 
          <>
          <h1>RED TEAM</h1>
          {game.redTeam.map((user) => (
            <>
             {!user.isCaptain? <p>{user.userName}</p>
             : <p>{user.userName} (Captain)</p> }
            </>
          ))}

          {game.cards[0].begginer === 'red'?
          <p>{game.redCorrect}/9 words</p>
        :
        <p>{game.redCorrect}/8 words</p>}
          </>
        : 
        ""}

        </div>
        <div className="cards">
          {currCaptain === currentUser && !game.captainIsReady?
          <div className="captains-input">
            <input 
              type="text"
              value={wordCode}
              placeholder="Your word..."
              onChange={(event) => {
                    setWordCode(event.target.value);
                }}                
                >
            </input>
            <input
              type="number"
              placeholder="Number of guesses..."
              value={numOfGuesses}
              onChange={(event) => {
                setNumOfGuesses(event.target.value)
              }}
            >
            </input>
            <button onClick={handleCaptain}>Send</button>
            </div>
          :
          !game.captainIsReady ?
              <p>{`Waiting for ${currCaptain} to choose a word`}</p>
              :
            <p>{`The word is ${game.word}, Number of gusses: ${game.numOfGuesses}`}</p>
          }
            
          {game.cards? 
          <Cards 
            game={game} 
            currentUser={currentUser} 
            currTeam = {game.turn? game.redTeam: game.blueTeam}
            chooseCard={chooseCard}
            /> 
          : ""
          }

        </div>
        <div className="blue-players">
          
          <h1>BLUE TEAM</h1>
          {game.blueTeam? 
            <>
            {game.blueTeam.map((user) => (
              <>
              {!user.isCaptain? <p>{user.userName}</p>
              : <p>{user.userName} (Captain)</p> }
              </>
            ))}
            {game.cards[0].begginer === 'blue'?
          <p>{game.blueCorrect}/9 words</p>
        :
        <p>{game.blueCorrect}/8 words</p>}

            </>
          : 
          ""}

        </div>

        </div>
        <div className="agent-cards">
        <div className="image-row1">
            {renderImages("red")}
        </div>
        <div className="image-row2">
           {renderImages("natural")}
          </div>
        <div className="image-row3">
           {renderImages("blue")}
          </div>
        </div>
        </>
        }
        </>

        
    )

}