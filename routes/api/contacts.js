const express = require("express");
const Joi = require("joi");
const router = express.Router();
const {
  contactSchema,
  updateContactSchema,
  idSchema,
} = require("../../models/validationSchemas");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const validateId = contactId => idSchema.validate(contactId);

router.get("/", async (_req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      status: "success",
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const { error } = validateId(contactId);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid contact ID",
    });
  }

  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: `Validation error: ${error.details[0].message}`,
      });
    }

    const newContact = await addContact(value);
    res.status(201).json({
      status: "success",
      message: "Contact added successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const { error } = validateId(contactId);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid contact ID",
    });
  }

  try {
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.put("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const { error: idError } = validateId(contactId);
  if (idError) {
    return res.status(400).json({
      status: "error",
      message: "Invalid contact ID",
    });
  }

  try {
    const { error, value } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: `Validation error: ${error.details[0].message}`,
      });
    }

    const updatedContact = await updateContact(contactId, value);
    if (!updatedContact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.patch("/:contactId/favorite", async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { error: idError } = validateId(contactId);
  if (idError) {
    return res.status(400).json({
      status: "error",
      message: "Invalid contact ID",
    });
  }

  if (typeof favorite !== "boolean") {
    return res.status(400).json({
      status: "error",
      message: "Invalid favorite status, must be true or false",
    });
  }

  try {
    const updatedContact = await updateContact(contactId, { favorite });
    if (!updatedContact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: `Contact's favorite status updated to ${favorite}`,
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

module.exports = router;
