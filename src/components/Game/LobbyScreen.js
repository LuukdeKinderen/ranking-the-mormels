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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function LobbyScreen(props) {
    const classes = useStyles();

    const roomId = sessionStorage.getItem("roomId");
    const player = JSON.parse(sessionStorage.getItem("player"));


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
                        <ListItem key={key} >
                            <ListItemIcon>
                                <img alt="Mormel logo" src={images[player.imageIndex]} style={{ width: '100%', marginRight: '5px' }} />
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
                <Button variant="contained" color="primary" onClick={() => start()} size="large">
                    START
                </Button>
        } else {
            StartButton =
                <p>
                    <b>{5 - props.players.length}</b> players need to join
                </p>

        }
        return (
            <>
                <h1>Room code: <i>{roomId}</i></h1>
                {PlayerList}
                {StartButton}
            </>
        );
    } else {
        return (
            <>
                <h4>Waiting for host to start the game...</h4>
            </>
        );
    }
}