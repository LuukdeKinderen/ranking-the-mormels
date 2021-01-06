import React, { useState } from "react";

import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    ListSubheader
    // ,IconButton
} from "@material-ui/core";

// import AddIcon from '@material-ui/icons/Add';
// import RemoveIcon from '@material-ui/icons/Remove';


import Button from "@material-ui/core/Button";

import { makeStyles } from '@material-ui/core/styles';
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import images from '../../Images/playerImages/playerImage'

import { publish } from '../Websocket'

import { getFromStorage } from '../../HelperFunctions'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    result.forEach((item, key) => {
        switch (key) {
            case 0:
                item.ranking = '1st'
                break;
            case 1:
                item.ranking = '2nd'
                break;
            case 2:
                item.ranking = '3th'
                break;
            case result.length - 1:
                item.ranking = 'Last best'
                break;
            default:
                item.ranking = null
                break;
        }
    });

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));


export default function Ranking(props) {
    const classes = useStyles();
    const player = getFromStorage('player');
    const roomId = getFromStorage("roomId");

    var players = props.players;
    players = players.filter(function (obj) {
        return obj.id !== player.id;
    });

    const [items, setItems] = useState(players);

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        setItems(
            reorder(
                items,
                result.source.index,
                result.destination.index
            )
        );
    }

    function sendbutton() {
        var state = false;
        players.forEach(player => {
            console.log(player.ranking);
            if (player.ranking !== null && player.ranking !== undefined) {
                state = true;
            }
        });
        
        if (state) {
            return (
                <Button
                style={{marginTop:"20px"}}
                 variant="contained" color="primary" onClick={() => sendRanking()} size="large">
                    SEND RANKING
                </Button>
            );
        }
    }


    function sendRanking() {
        props.setRanking(false);
        var ranking = {
            firstId: items[0].id,
            secondId: items[1].id,
            thirdId: items[2].id,
            lastBestId: items[items.length - 1].id
        }
        players.forEach(player => {
            player.ranking = null;
        });
        publish(
            { destination: `/app/game/${roomId}/ranking`, body: JSON.stringify(ranking) }
        );
    }


    return (
        <>
            <p>Drag the players to the correct position</p>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List
                                className={classes.root}
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        Ranking:
                                    </ListSubheader>
                                }
                            >
                                {items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <ListItem
                                                key={item.id}
                                                ContainerComponent="li"
                                                ContainerProps={{ ref: provided.innerRef }}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <div style={{ display: 'none' }}
                                                    data-testid="playerName">{JSON.stringify(item)}</div>
                                                <ListItemIcon>
                                                    <img alt="Mormel logo" src={images[item.imageIndex]}
                                                        style={{ width: '100%', marginRight: '5px' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.name}
                                                    secondary={item.ranking ? <b>{item.ranking}</b> : <i>neutral</i>}
                                                />
                                                <ListItemSecondaryAction>
                                                    {/* <IconButton disabled={index === 0} onClick={() => placeUp(items, index)}>
                                                        <AddIcon fontSize="large" />
                                                    </IconButton>
                                                    <IconButton disabled={index === items.length - 1} onClick={() => placeDown(items, index)}>
                                                        <RemoveIcon fontSize="large" />
                                                    </IconButton> */}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </RootRef>
                    )}
                </Droppable>
            </DragDropContext>
            {sendbutton()}
        </>
    );
}


