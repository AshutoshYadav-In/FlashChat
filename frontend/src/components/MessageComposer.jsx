function MessageComposer({ messageInput, messageError, onMessageInputChange, onSend }) {
  return (
    <>
      <form onSubmit={onSend} className="message-form">
        <input
          type="text"
          value={messageInput}
          onChange={onMessageInputChange}
          maxLength={500}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      {messageError && <p className="error-text">{messageError}</p>}
    </>
  );
}

export default MessageComposer;
