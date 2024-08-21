const Contact = require("./contactModel");

const listContacts = async () => {
  return Contact.find({});
};

const getContactById = async contactId => {
  return Contact.findById(contactId);
};

const removeContact = async contactId => {
  return Contact.findByIdAndDelete(contactId);
};

const addContact = async body => {
  const newContact = new Contact(body);
  return newContact.save();
};

const updateContact = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
