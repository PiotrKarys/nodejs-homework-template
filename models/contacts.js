const Contact = require("./contactModel");

const listContacts = async () => {
  return await Contact.find({});
};

const getContactById = async contactId => {
  return await Contact.findById(contactId);
};

const removeContact = async contactId => {
  return await Contact.findByIdAndDelete(contactId);
};

const addContact = async body => {
  const newContact = new Contact(body);
  return await newContact.save();
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
