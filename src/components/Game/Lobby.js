import React from 'react';

import Button from "@material-ui/core/Button";
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    ListSubheader
} from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles';
import images from '../../Images/playerImages/playerImage'

import { publish } from '../Websocket'

import { getFromStorage } from '../../HelperFunctions'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Lobby(props) {
    const classes = useStyles();

    const roomId = getFromStorage("roomId");
    const player = getFromStorage("player");

    if (player.host && props.players != null) {

        function start() {
            publish(
                { destination: `/app/game/${roomId}/new-question`, body: JSON.stringify(player) }
            );
        }

        var StartButton = '';
        var PlayerList = (
            <>
                <List
                    className={classes.root}
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Players:
                        </ListSubheader>
                    }
                >
                    {props.players.map((player, key) =>
                        <ListItem key={key}>
                            <ListItemIcon>
                                <img alt="Mormel logo" src={images[player.imageIndex]}
                                    style={{ width: '100%', marginRight: '5px' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={player.name}
                            />
                            <ListItemSecondaryAction />
                        </ListItem>
                    )}
                </List>
            </>
        );
        if (props.players.length > 4) {
            StartButton =
                <>
                    <p>Players: <b>{props.players.length}</b> / 10</p>
                    <Button data-testid="startButton" variant="contained" color="primary" onClick={() => start()}
                        size="large">
                        START
                </Button>
                </>
        } else {
            StartButton = <p>
                Players: <b>{props.players.length}</b> / 10<br />
                <span data-testid="untilStart">Waiting for {5 - props.players.length} more player(s) to join...</span>
            </p>
            //  <p data-testid="untilStart"> <b>{5 - props.players.length}</b> players need to join</p>

        }
        return (
            <>
                <h1>Room code: <i>{roomId}</i></h1>
                {PlayerList}
                {StartButton}
            </>
        );
    } else if (props.players != null) {
        var message = `Waiting for ${5 - props.players.length} more player(s) to join...`
        if (props.players.length > 4) {
            message = "Waiting for host to start the game..."
        }
        return (
            <>
                <h1>You are in room: <i>{roomId}</i> </h1>
                <p>
                    Players: <b>{props.players.length}</b> / 10<br />
                    {message}
                </p>
            </>
        );
    } else {
        return (
            <>
                <h1>Joining room: <i>{roomId}</i>...</h1>
            </>
        );
    }
}