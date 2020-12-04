import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Lobby from './Lobby';
import { setInStorage } from '../../HelperFunctions'

const roomId = "TEST";
const hostPlayer = {
    host: true,
    id: "testId1",
    name: "host",
    imageIndex: 0,
}
const player = {
    host: false,
    id: "testId2",
    name: "player",
}

const hostSetup = () => {
    setInStorage('player', hostPlayer);
    setInStorage('roomId', roomId);
}

const playerSetup = () => {
    setInStorage('player', player);
    setInStorage('roomId', roomId);
}

const players = [
    { name: 'henk', imageIndex: 1 },
    { name: 'ingrit', imageIndex: 2 },
    { name: 'pieter', imageIndex: 3 },
    { name: 'jan', imageIndex: 4 },
    { name: 'klaasen', imageIndex: 5 },
];

test('As a host Room Id is vissable on lobbyScreen', () => {
    //Arrange
    hostSetup();

    //Act
    render(<Lobby players={players} />)


    //Assert
    expect(screen.getByRole('heading')).toHaveTextContent(roomId);
});

test('As a player Room Id is vissable on lobbyScreen', () => {
    //Arrange
    playerSetup();

    //Act
    render(<Lobby players={players} />)


    //Assert
    expect(screen.getByRole('heading')).toHaveTextContent(roomId);
});

test('As a host start button is visible', () => {
    //Arrange
    hostSetup();

    //Act
    render(<Lobby players={players} />)

    //Assert
    expect(screen.getByTestId('startButton')).not.toBeNull();
});

test('As a host playernumber till start is vissable', () => {
    //Arrange
    hostSetup();
    var fewPlayers = [
        players[0],
        players[1],
    ]
    var expected = 5 - fewPlayers.length; //minimum is 5

    //Act
    render(<Lobby players={fewPlayers} />)

    //Assert
    expect(screen.getByTestId('untilStart')).toHaveTextContent(`${expected} players need to join`);
});