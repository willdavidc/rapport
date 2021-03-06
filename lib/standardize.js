'use strict';

/**
 * Standardizes a browser websocket implementation.
 *
 * @param {object} ws The websocket instance.
 * @return {object} The standardized websocket.
 */
const standardizeBrowserSocket = (ws) => {
    return {
        onOpen: function onOpen(handler) {
            ws.onopen = handler;
        },
        onClose: function onClose(handler) {
            ws.onclose = handler;
        },
        onError: function onError(handler) {
            ws.onerror = handler;
        },
        onMessage: function onMessage(handler) {
            ws.onmessage = function onMessage(msg) {
                handler(msg.data);
            };
        },
        send: ws.send.bind(ws),
        close: ws.close.bind(ws)
    };
};

/**
 * Standardizes a node event emitter based websocket implementation.
 *
 * @param {object} ws The websocket instance.
 * @return {object} The standardized websocket.
 */
const standardizeNodeSocket = (ws) => {

    // Helper function for event emitter based websockets that limits the handler count to 1
    function oneHandler(event, handler) {
        ws.removeAllListeners(event);
        ws.on(event, handler);
    }

    return {
        onOpen: oneHandler.bind(null, 'open'),
        onClose: oneHandler.bind(null, 'close'),
        onError: oneHandler.bind(null, 'error'),
        onMessage: oneHandler.bind(null, 'message'),
        send: ws.send.bind(ws),
        close: ws.close.bind(ws)
    };
};

/**
 * Standardizes a websocket implementation.
 *
 * @param {object} ws The websocket instance.
 * @return {object} The standardized websocket instance.
 */
module.exports = (ws) => {
    if (ws.on) {
        return standardizeNodeSocket(ws);
    }
    return standardizeBrowserSocket(ws);
};
