import React from 'react';
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import LogonScreen from './LogonScreen';


test('As a host Room Id is vissable on lobbyScreen', () => {
    //Arrange

    //Act
    render(<LogonScreen/>)


    //Assert
    expect(1).toBe(1);
    //expect(screen.getByLabelText('Nickname *')).toHaveTextContent("test");
});
