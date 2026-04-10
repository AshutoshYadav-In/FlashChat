import ChatHeader from './ChatHeader';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';

function ChatScreen({
  displayName,
  onlineCount,
  connectionStatus,
  messages,
  endRef,
  messageInput,
  messageError,
  onMessageInputChange,
  onSend,
}) {
  return (
    <div className="page">
      <div className="card chat-card">
        <ChatHeader
          displayName={displayName}
          onlineCount={onlineCount}
          connectionStatus={connectionStatus}
        />
        <MessageList messages={messages} displayName={displayName} endRef={endRef} />
        <MessageComposer
          messageInput={messageInput}
          messageError={messageError}
          onMessageInputChange={onMessageInputChange}
          onSend={onSend}
        />
      </div>
    </div>
  );
}

export default ChatScreen;
