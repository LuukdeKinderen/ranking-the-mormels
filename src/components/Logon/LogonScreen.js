import React, { useState, useEffect } from 'react';

import { useHistory } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';

import logo from '../../Images/mormel.svg';
import { makeid, makeRoomCode } from '../../HelperFunctions';

import { publish, subscribe } from '../Websocket';

import { setInStorage } from '../../HelperFunctions'


export default function LogonScreen() {

    const history = useHistory();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [host, setHost] = useState(false);


    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            fetch("https://randomuser.me/api/")
                .then(res => res.json())
                .then(res => {
                    setName(res.results[0].login.username);
                });
        }
    }, [])


    function ChangeHost() {
        setHost(!host);
        if (!host) {
            setRoomId(makeRoomCode(4));
        } else {
            setRoomId("");
        }
    }

    function Join(e) {
        e.preventDefault();
        var newPlayer = {
            id: makeid(25),
            name: name,
            host: true
        }

        setInStorage('roomId', roomId);
        subscribe(roomId);


        if (host) {
            var gameRoom = {
                id: roomId,
                players: [newPlayer],
                questionCount: questionCount,
            };
            publish({ destination: '/app/room/create', body: JSON.stringify(gameRoom) });
        } else {
            newPlayer.host = false;
            publish({ destination: `/app/room/${roomId}/addPlayer`, body: JSON.stringify(newPlayer) });
        }
        setInStorage('player', newPlayer);
        history.push(`/game`);
    }


    var roomCodeOrQuestionCount =
        host ?
            <>
                <TextField
                    InputProps={{ inputProps: { max: 15, min: 1 } }}
                    style={{width:"190px"}}
                    type="number"
                    required
                    disabled={!host}
                    label="Room code"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                />

            </> :
            <>
                <TextField
                    InputProps={{ inputProps: { maxLength: 4 } }}
                    required
                    disabled={host}
                    label="Room code"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
            </>


    return (

        <>
            <div className="LogoContianer">
                <img alt="Mormel logo" src={logo}
                    className="Logo"
                // style={{minWidth:'70%', maxWidth: '400px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
            </div>
            <h1>Ranking the Mormels</h1>
            <form onSubmit={(e) => Join(e)}>
                <Grid

                    container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item>
                        <TextField
                            InputProps={{ inputProps: { minLength: 3, maxLength: 20 } }}
                            required
                            label="Nickname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        {roomCodeOrQuestionCount}

                    </Grid>
                    <Grid item>

                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" type="submit" size="large">
                            {host ? 'HOST' : 'JOIN'}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => ChangeHost()}>
                            {host ? 'Or Join a room...' : 'Or host a room...'}
                        </Button>
                    </Grid>
                </Grid>
            </form>

        </>


    );
}