function JoinScreen({
  displayNameInput,
  joinError,
  connectionStatus,
  onDisplayNameChange,
  onJoin,
}) {
  return (
    <div className="page">
      <div className="card join-card">
        <h1>FlashChat</h1>
        <p className="subtitle">Enter your display name to join live chat.</p>
        <form onSubmit={onJoin} className="join-form">
          <input
            type="text"
            value={displayNameInput}
            onChange={onDisplayNameChange}
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

export default JoinScreen;
