import Contact from "../models/contactMessageModel.js";

// POST /api/contact — public
export const submitContact = async (req, res) => {
  try {
    const { name, phone, email, subject, message, orderRef } = req.body;

    if (!name || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: "Name, phone, subject and message are required" });
    }

    const contact = await Contact.create({
      name,
      phone,
      email: email || "",
      subject,
      message,
      orderRef: orderRef || "",
    });

    res.status(201).json({ success: true, message: "Message sent successfully", contact });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/contact — admin
export const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, { status: 'read' }, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    console.error('Mark contact as read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/contact/:id/status — admin
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status required (new, read, replied)" });
    }

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    console.error("Update contact status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
