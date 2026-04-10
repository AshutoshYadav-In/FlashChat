import { useEffect, useMemo, useRef, useState } from 'react';
import { socket } from './lib/socket';
import './styles.css';

const formatTime = (isoDate) =>
  new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function App() {
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const endRef = useRef(null);

  useEffect(() => {
    const onConnect = () => setConnectionStatus('connected');
    const onDisconnect = () => setConnectionStatus('disconnected');
    const onJoinSuccess = ({ displayName: joinedName }) => {
      setDisplayName(joinedName);
      setIsJoined(true);
      setJoinError('');
    };
    const onJoinNameTaken = ({ message }) => setJoinError(message);
    const onJoinError = ({ message }) => setJoinError(message);
    const onChatHistory = ({ messages: history }) => setMessages(history || []);
    const onChatMessage = (message) =>
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) {
          return current;
        }
        return [...current, message];
      });
    const onUsersOnline = ({ count }) => setOnlineCount(count ?? 0);
    const onMessageError = ({ message }) => setMessageError(message);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('join_success', onJoinSuccess);
    socket.on('join_name_taken', onJoinNameTaken);
    socket.on('join_error', onJoinError);
    socket.on('chat_history', onChatHistory);
    socket.on('chat_message', onChatMessage);
    socket.on('users_online', onUsersOnline);
    socket.on('message_error', onMessageError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('join_success', onJoinSuccess);
      socket.off('join_name_taken', onJoinNameTaken);
      socket.off('join_error', onJoinError);
      socket.off('chat_history', onChatHistory);
      socket.off('chat_message', onChatMessage);
      socket.off('users_online', onUsersOnline);
      socket.off('message_error', onMessageError);
    };
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
    setJoinError('');
    socket.emit('join_chat', { displayName: displayNameInput.trim() });
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (!messageInput.trim()) {
      return;
    }
    setMessageError('');
    socket.emit('chat_message', { text: messageInput.trim() });
    setMessageInput('');
  };

  if (!isJoined) {
    return (
      <div className="page">
        <div className="card join-card">
          <h1>FlashChat</h1>
          <p className="subtitle">Enter your display name to join live chat.</p>
          <form onSubmit={handleJoin} className="join-form">
            <input
              type="text"
              value={displayNameInput}
              onChange={(event) => setDisplayNameInput(event.target.value)}
              placeholder="Display name"
              maxLength={24}
            />
            <button type="submit">Join Chat</button>
          </form>
          {joinError && <p className="error-text">{joinError}</p>}
          <p className="connection-text">Socket: {connectionStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card chat-card">
        <header className="chat-header">
          <div>
            <h2>FlashChat</h2>
            <p className="subtitle">Signed in as {displayName}</p>
          </div>
          <div className="header-stats">
            <span className="badge">Users Online: {onlineCount}</span>
            <span className={`badge ${connectionStatus !== 'connected' ? 'warn' : ''}`}>
              {connectionStatus}
            </span>
          </div>
        </header>

        <section className="messages">
          {sortedMessages.map((message) => {
            const mine = message.displayName === displayName;
            return (
              <article key={message.id} className={`message ${mine ? 'mine' : ''}`}>
                <div className="meta">
                  <strong>{message.displayName}</strong>
                  <span>{formatTime(message.createdAt)}</span>
                </div>
                <p>{message.text}</p>
              </article>
            );
          })}
          <div ref={endRef} />
        </section>

        <form onSubmit={handleSend} className="message-form">
          <input
            type="text"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            maxLength={500}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
        {messageError && <p className="error-text">{messageError}</p>}
      </div>
    </div>
  );
}

export default App;
