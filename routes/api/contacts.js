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
const authMiddleware = require("../../middleware/authMiddleware");

const validateId = contactId => idSchema.validate(contactId);

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    console.log("Query params:", req.query);

    const { page = 1, limit = 10, favorite } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      favorite,
    };

    console.log("Options:", options);

    const result = await listContacts(req.user._id, options);
    res.status(200).json({
      status: "success",
      message: "Contacts retrieved successfully",
      data: result.contacts,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);

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
    const contact = await getContactById(contactId, req.user._id);
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

    const newContact = await addContact({ ...value, owner: req.user._id });
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
    const removedContact = await removeContact(contactId, req.user._id);
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

    const updatedContact = await updateContact(contactId, value, req.user._id);
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
    const updatedContact = await updateContact(
      contactId,
      { favorite },
      req.user._id
    );
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
