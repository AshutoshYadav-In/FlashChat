function ChatHeader({ displayName, onlineCount, connectionStatus }) {
  return (
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
  );
}

export default ChatHeader;
