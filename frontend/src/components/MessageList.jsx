const formatTime = (isoDate) =>
  new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function MessageList({ messages, displayName, endRef }) {
  return (
    <section className="messages">
      {messages.map((message) => {
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
  );
}

export default MessageList;
