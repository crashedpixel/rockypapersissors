import { useCallback, useEffect, useRef, useState } from 'react';
import { CONST } from './App.constant';
import './App.css';

function App() {
  const hand1 = useRef();
  const hand2 = useRef();
  const choices = ['rock', 'paper', 'sissors'];

  const [game, setGame] = useState(localStorage.getItem('rockpapersissors'));
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [configNewGame, setConfigNewGame] = useState(false);
  const [activePlayer, setActivePlayer] = useState(CONST.player1);

  const isActivePlayer = useCallback((index) => index == activePlayer);
  const getPlayerName = useCallback((index) => game[`player${index}`].name);
  const getPlayerScore = useCallback((index) => game[`player${index}`].score);

  const getPlayerHeaderHTML = useCallback((index) => {
    const classList = isActivePlayer(index) ? 'active' : '';
    return <p className={classList}><span>{CONST.playerLabel} {index} {index === 2 && '(computer)'}:</span> {getPlayerName(index)} - <span>{CONST.scoreLabel}:</span> {getPlayerScore(index)}</p>
  });
  const getPlayerNameFieldHTML = useCallback((index) => 
    <label key={index}>{CONST.playerLabel} {index}: <input name={`player${index}`} type="text" required /></label>);

  const onStartNewGame = (event) => {
    event.preventDefault();
    setGame({
      player1: {
        name: event.target.player1.value,
        score: 0,
      },
      player2: {
        name: event.target.player2.value,
        score: 0,
      },
      // activePlayer: CONST.player1,
    });
    setHasGameStarted(true);
  };
  const onLoadOldGame = () => {
    const parsedGame = JSON.parse(game);
    setGame(parsedGame);
    // setActivePlayer(parsedGame.activePlayer);
    setHasGameStarted(true);
  }
  const onPlayerHand = (ref) => {
    const choice1 = choices[Math.floor(Math.random() * 3)];
    const choice2 = choices[Math.floor(Math.random() * 3)];
    ref.current.classList.remove('rock', 'paper', 'sissors');
    setTimeout(() => ref.current.classList.add(choice1));
    setTimeout(() => {
      hand2.current.classList.remove('rock', 'paper', 'sissors');
      setTimeout(() => hand2.current.classList.add(choice2));

      const temp = {...game};
      const player1 = temp.player1.score;
      const player2 = temp.player2.score;
      temp.player1.score = compareHands(choice1, choice2) ? player1 + 1 : player1;
      temp.player2.score = compareHands(choice2, choice1) ? player2 + 1 : player2;
      setGame(temp);
      localStorage.setItem('rockpapersissors', JSON.stringify(temp));
    }, 500);
  }
  const getHandClasslist = (index) => {
    let classList = 'hand';
    if (activePlayer == index) classList += ' active';
    else classList += ' disabled';
    return classList;
  }
  const compareHands = (a, b) => {
    return (a == 'rock' && b == 'sissors')
      || (a == 'paper' && b == 'rock')
      || (a == 'sissors' && b == 'paper');
  }

  return (
    <div className="app">
        {!hasGameStarted && <div className="model">
          <div className="container">
            <h2>{CONST.title}</h2>
              {configNewGame ? <form onSubmit={(event) => onStartNewGame(event)}>
                {[1,2].map((index) => getPlayerNameFieldHTML(index))}
                <button>{CONST.startGameBtn}</button>
              </form> : <div className="controls">
                <button onClick={() => setConfigNewGame(true)}>{CONST.newGameBtn}</button>
                <button onClick={() => onLoadOldGame()} disabled={!game}>{CONST.loadGameBtn}</button>
              </div>}
          </div>
        </div>}
      {hasGameStarted && <div className="game">
        <div className="header">
          {getPlayerHeaderHTML(CONST.player1)}
          <p>{CONST.vsLabel}</p>
          {getPlayerHeaderHTML(CONST.player2)}
        </div>
        <div className="container">
          <div className="player"><div ref={hand1} className={getHandClasslist(CONST.player1)} onClick={() => onPlayerHand(hand1)}></div></div>
          <div className="player"><div ref={hand2} className={getHandClasslist(CONST.player2)}></div></div>
        </div>
      </div>}
    </div>
  );
}

export default App;
