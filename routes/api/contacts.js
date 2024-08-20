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

router.get("/", async (_req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ status: "success", data: contacts });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", data: contact });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }

    const newContact = await addContact(value);
    res.status(201).json({ status: "success", data: newContact });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
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
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", data: updatedContact });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await updateStatusContact(contactId, { favorite });
    if (!updatedContact) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", data: updatedContact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
