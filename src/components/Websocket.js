import { Client } from '@stomp/stompjs'

const client = new Client({
    brokerURL: process.env.REACT_APP_WEBSOCKET,
    // connectHeaders: {
    //   login: "user",
    //   passcode: "password"
    // },
    debug: function (str) {
        if (process.env.NODE_ENV !== 'production') { console.log(str) };
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
});



client.onStompError = (frame) => {
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
};

client.onConnect = () => {
    var roomId = sessionStorage.getItem('roomId')
    var player = sessionStorage.getItem('player');
    if (roomId != null && player != null) {
        subscribe(roomId);
        publish({ destination: `/app/game/${roomId}/state`, body: player });
    }
}

client.activate();

var subscription = null;
let messageHandler = () => { };

export function subscribe(newRoomId) {
    if (subscription != null) {
        subscription.unsubscribe();
    }
    subscription = client.subscribe(`/room/${newRoomId}`, message => {
        messageHandler(message.body);
    })
}

export function publish(publish) {
    client.publish(publish);
}

export function setMessageHandler(newMessageHandler) {
    messageHandler = (msg) => {
        newMessageHandler(msg);
        if (process.env.NODE_ENV !== 'production') {
            console.log(msg)
        }
    };
}