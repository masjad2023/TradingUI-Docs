// WebSocketReducer.jsx
export const actionTypes = {
    CONNECT: 'CONNECT',
    DISCONNECT: 'DISCONNECT',
    RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  };

  const WebSocketReducer = (state, action) => {
    switch (action.type) {
      case actionTypes.CONNECT:
        return { ...state, ws: action.payload, isConnected: true };
      case actionTypes.DISCONNECT:
        state.ws.close();
        return { ...state, ws: null, isConnected: false, messages: [] };
      case actionTypes.RECEIVE_MESSAGE:
        return { ...state, messages: [...state.messages, action.payload] };
      default:
        return state;
    }
  };

  export default WebSocketReducer;