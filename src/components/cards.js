import React, { memo, useEffect, useState } from 'react';
import red from '../images/red.jpg';
import blue from '../images/blue.jpg';
import natural from '../images/natural2.jpg';
import black from '../images/black.jpg';


const Cards = ({ game, currentUser, currTeam, chooseCard }) => {
  const [selectedCards, setSelectedCards] = useState();

  const isCaptain = game.captains.blue === currentUser || game.captains.red === currentUser;

  useEffect(() => {
    // Update the selected cards state when the game's selected cards change
    const newSelectedCards = game.selectedCards.map(card => card.word);
    setSelectedCards(newSelectedCards);

  }, [game.selectedCards, game.captainIsReady, currTeam]);


  const chooseWord = async (card) => {

    chooseCard(card);

  }

  return (
    <div className='cards-container'>
      {game.cards.map((card, index) => (
        <div key={index} className='single-card' >
          {selectedCards && selectedCards.includes(card.word) ? (
            <img 
            src={card.color === 'red' ? red : card.color === 'blue' ? blue : card.color === 'yellow' ? natural : black}
             alt={card.word} />
          ) : (
            isCaptain ? (
              <div style={{ color: card.color }}>{card.word}</div>
            ) : (
              game.captainIsReady && currTeam.some((user) => user.userName === currentUser) ? (
                <button onClick={() => chooseWord(card)}>{card.word}</button>
              ) : (
                <>{card.word}</>
              )
            )
          )}

            
        </div>
      ))}

    </div>
  );
};

export default memo(Cards);
