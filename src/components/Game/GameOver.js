import React from 'react';
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

import Button from "@material-ui/core/Button";

import { clearStorage } from '../../HelperFunctions'
import {useHistory} from "react-router-dom";
import {disconnect} from '../Websocket';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Lobby(props) {
    const history = useHistory();
    const classes = useStyles();

    function newGame(){
        clearStorage();
        disconnect();
        history.push("/");    

    }
    

    return (
        <>
            <h1>Game Over</h1>
            <List
                className={classes.root}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Result:
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
                            secondary={<>drink count: {player.drinkCount} </>}
                        />
                        <ListItemSecondaryAction />
                    </ListItem>
                )}
            </List>
            <Button
            style={{marginTop:"20px"}}
             variant="contained" color="primary" onClick={() => newGame()} size="large">
                GO BACK TO HOME
            </Button>
        </>
    );
}