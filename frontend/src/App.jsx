import { useEffect, useMemo, useReducer, useRef } from 'react';
import { bindSocketEvents, socket } from './lib/socket';
import ChatScreen from './components/ChatScreen';
import JoinScreen from './components/JoinScreen';
import './styles.css';

function App() {
  const initialState = {
    displayNameInput: '',
    displayName: '',
    isJoined: false,
    joinError: '',
    messageInput: '',
    messageError: '',
    messages: [],
    onlineCount: 0,
    connectionStatus: 'connecting',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_FIELDS':
        return { ...state, ...action.payload };
      case 'SET_HISTORY':
        return { ...state, messages: action.payload || [] };
      case 'ADD_MESSAGE':
        if (state.messages.some((item) => item.id === action.payload.id)) {
          return state;
        }
        return { ...state, messages: [...state.messages, action.payload] };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    displayNameInput,
    displayName,
    isJoined,
    joinError,
    messageInput,
    messageError,
    messages,
    onlineCount,
    connectionStatus,
  } = state;
  const endRef = useRef(null);

  useEffect(() => {
    const onConnect = () => dispatch({ type: 'UPDATE_FIELDS', payload: { connectionStatus: 'connected' } });
    const onDisconnect = () =>
      dispatch({ type: 'UPDATE_FIELDS', payload: { connectionStatus: 'disconnected' } });
    const onJoinSuccess = ({ displayName: joinedName }) => {
      dispatch({
        type: 'UPDATE_FIELDS',
        payload: { displayName: joinedName, isJoined: true, joinError: '' },
      });
    };
    const onJoinNameTaken = ({ message }) =>
      dispatch({ type: 'UPDATE_FIELDS', payload: { joinError: message } });
    const onJoinError = ({ message }) =>
      dispatch({ type: 'UPDATE_FIELDS', payload: { joinError: message } });
    const onChatHistory = ({ messages: history }) => dispatch({ type: 'SET_HISTORY', payload: history });
    const onChatMessage = (message) => dispatch({ type: 'ADD_MESSAGE', payload: message });
    const onUsersOnline = ({ count }) =>
      dispatch({ type: 'UPDATE_FIELDS', payload: { onlineCount: count ?? 0 } });
    const onMessageError = ({ message }) =>
      dispatch({ type: 'UPDATE_FIELDS', payload: { messageError: message } });

    return bindSocketEvents({
      connect: onConnect,
      disconnect: onDisconnect,
      join_success: onJoinSuccess,
      join_name_taken: onJoinNameTaken,
      join_error: onJoinError,
      chat_history: onChatHistory,
      chat_message: onChatMessage,
      users_online: onUsersOnline,
      message_error: onMessageError,
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [messages]
  );

  const handleJoin = (event) => {
    event.preventDefault();
    dispatch({ type: 'UPDATE_FIELDS', payload: { joinError: '' } });
    socket.emit('join_chat', { displayName: displayNameInput.trim() });
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (!messageInput.trim()) {
      return;
    }
    dispatch({ type: 'UPDATE_FIELDS', payload: { messageError: '' } });
    socket.emit('chat_message', { text: messageInput.trim() });
    dispatch({ type: 'UPDATE_FIELDS', payload: { messageInput: '' } });
  };

  if (!isJoined) {
    return (
      <JoinScreen
        displayNameInput={displayNameInput}
        joinError={joinError}
        connectionStatus={connectionStatus}
        onJoin={handleJoin}
        onDisplayNameChange={(event) =>
          dispatch({ type: 'UPDATE_FIELDS', payload: { displayNameInput: event.target.value } })
        }
      />
    );
  }

  return (
    <ChatScreen
      displayName={displayName}
      onlineCount={onlineCount}
      connectionStatus={connectionStatus}
      messages={sortedMessages}
      endRef={endRef}
      messageInput={messageInput}
      messageError={messageError}
      onSend={handleSend}
      onMessageInputChange={(event) =>
        dispatch({ type: 'UPDATE_FIELDS', payload: { messageInput: event.target.value } })
      }
    />
  );
}

export default App;
