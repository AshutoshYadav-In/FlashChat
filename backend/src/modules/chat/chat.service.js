const { Message } = require('./message.model');

const saveMessage = async ({ displayName, text }) => {
  const message = await Message.create({ displayName, text });
  return {
    id: message._id.toString(),
    displayName: message.displayName,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
  };
};

const getRecentMessages = async (limit) => {
  const records = await Message.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return records.reverse().map((message) => ({
    id: message._id.toString(),
    displayName: message.displayName,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
  }));
};

module.exports = { saveMessage, getRecentMessages };
