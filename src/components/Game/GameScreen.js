import React, { useState } from 'react';

import Lobby from './Lobby';
import Ranking from './Ranking';
import Result from './Result'
import GameOver from './GameOver';

import { useHistory } from "react-router-dom";

import { setMessageHandler } from '../Websocket'

import { getFromStorage, setInStorage } from '../../HelperFunctions'

import CircularProgress from '@material-ui/core/CircularProgress';

export default function GameScreen() {
    const history = useHistory();

    const [players, setPlayers] = useState(null);
    const [question, setQuestion] = useState(null);
    const [result, setResult] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [ranking, setRanking] = useState(true);

    setMessageHandler((message) => {
        message = JSON.parse(message);

        if (message.players != null) {
            setPlayers(message.players)
        }

        if (message.question != null) {
            setQuestion(message.question)
            setRanking(true);
            setResult(null);
        }

        if (message.gameOver != null) {
            setGameOver(true);
        }

        if (message.result != null) {
            setResult(message.result);
        }
        // if message is for player
        if (message.player != null && message.player.id === getFromStorage('player').id) {
            if (message.error != null) {
                alert(message.error);
                history.push('/');
            } else {
                setInStorage('player', message.player);
            }
        }
    })

    if (gameOver === true) {
        return (
            <GameOver players={players} />
        );
    } else if (question === null) {
        return (
            <Lobby players={players} />
        );
    } else if (result === null && ranking) {
        return (
            <>
                <h1>{question}</h1>
                <Ranking setRanking={setRanking} players={players} />
            </>
        );
    } else if (result === null && !ranking) {
        return (
            <>
                <h1>waiting for results</h1>
                <CircularProgress />
            </>
        );
    } else if (result !== null) {
        return (
            <>
                <h1>{question}</h1>
                <Result result={result} />
            </>
        )
    }
}