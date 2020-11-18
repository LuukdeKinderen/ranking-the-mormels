import React, { useState } from 'react';

import LobbyScreen from './LobbyScreen';
import Ranking from './Ranking';

import { useHistory } from "react-router-dom";

import { setMessageHandler } from '../Websocket'



export default function GameScreen() {
    const history = useHistory();

    const [players, setPlayers] = useState(null);
    const [question, setQuestion] = useState(null);

    setMessageHandler((message) => {
        message = JSON.parse(message);

        if (message.players != null) {
            setPlayers(message.players)
        }

        if (message.question != null) {
            setQuestion(message.question)
        }

        // if message is for player
        if (message.player != null && message.player.id === JSON.parse(sessionStorage.getItem('player')).id) {
            if (message.error != null) {
                alert(message.error);
                //sessionStorage.clear();
                history.push('/');
            } else {
                sessionStorage.setItem('player', JSON.stringify(message.player));
            }
        }
    })

    if (question === null) {
        return (
            <LobbyScreen players={players} />
        );
    } else {
        return (
            <>
                <p>Question: {question}</p>
                <Ranking players={players} />
            </>
        );
    }
}