const express = require("express");
const router = express.Router();
const {
  contactSchema,
  updateContactSchema,
} = require("../../models/validationSchemas");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (_req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      status: "success",
      message: "Contacts successfully retrieved",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: Could not retrieve contacts",
    });
  }
});

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Exact contact successfully retrieved",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: Could not retrieve exact contact",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }

    const newContact = await addContact(value);
    res.status(201).json({
      status: "success",
      message: "Contact successfully added",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error! Cannot add contact :(",
    });
  }
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact not found" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Contact successfully deleted" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error! Cannot delete contact :(",
    });
  }
});

router.put("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const { error, value } = updateContactSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }

    const updatedContact = await updateContact(contactId, value);
    if (!updatedContact) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact Not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Contact successfully updated",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error! cannot update contact :(",
    });
  }
});

router.patch("/:contactId/favorite", async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await updateStatusContact(contactId, { favorite });
    if (!updatedContact) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Contact is now your favourite!",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error! It's not your favourite!",
    });
  }
});

module.exports = router;
