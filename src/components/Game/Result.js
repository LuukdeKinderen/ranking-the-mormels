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

import {makeStyles} from '@material-ui/core/styles';
import images from '../../Images/playerImages/playerImage'

import {publish} from '../Websocket'

import {getFromStorage} from '../../HelperFunctions'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

const ranking = (key) => {
    switch (key) {
        case 0:
            return '1st'
        case 1:
            return '2nd'
        case 2:
            return '3th'
        default:
            return 'Last best'
    }
}

export default function Result(props) {
    const classes = useStyles();

    //const taskFor = props.result.player.name;

    const task = props.result.task;
    const result = props.result.result;

    const player = getFromStorage("player");
    const roomId = getFromStorage("roomId");

    var nextButton;
    if (player.host) {
        nextButton = (
            <Button 
            style={{marginTop:"20px"}}
            variant="contained" color="primary" onClick={() => next()} size="large">
                Next question
            </Button>
        )
    }

    function next() {
        publish(
            {destination: `/app/game/${roomId}/new-question`, body: JSON.stringify(player)}
        );
    }

    return (
        <>
            <p>{task}</p>
            <List
                className={classes.root}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Average result:
                    </ListSubheader>
                }
            >
                {result.map((player, key) =>
                    <ListItem key={key}>
                        <ListItemIcon>
                            <img alt="Mormel logo" src={images[player.imageIndex]}
                                 style={{width: '100%', marginRight: '5px'}}/>
                        </ListItemIcon>
                        <ListItemText
                            primary={player.name}
                            secondary={ranking(key)}
                        />
                        <ListItemSecondaryAction/>
                    </ListItem>
                )}
            </List>
            {nextButton}


        </>
    );
}