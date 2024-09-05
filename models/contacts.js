const Contact = require("./contactModel");

const listContacts = async (userId, { page = 1, limit = 10, favorite }) => {
  const skip = (page - 1) * limit;
  const query = { owner: userId };

  if (favorite !== undefined) {
    query.favorite = favorite === "true";
  }

  const contacts = await Contact.find(query).skip(skip).limit(limit).exec();
  const total = await Contact.countDocuments(query);

  return {
    contacts,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
};

const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, owner: userId });
};

const removeContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, owner: userId });
};

const addContact = async body => {
  const newContact = new Contact(body);
  return newContact.save();
};

const updateContact = async (contactId, updateData, userId) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    updateData,
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
