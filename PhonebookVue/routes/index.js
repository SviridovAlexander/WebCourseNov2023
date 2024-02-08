const express = require('express');
const router = express.Router();

let contacts = [];
let currentContactId = 1;

router.get("/api/contacts", function (req, res) {
    const term = (req.query.term || "").toUpperCase();

    const result = term.length === 0
        ? contacts
        : contacts.filter(c => c.name.toUpperCase().includes(term) || c.phone.toUpperCase().includes(term));

    res.send(result);
});

router.delete("/api/contacts/:id", function (req, res) {
    const id = Number(req.params.id);

    contacts = contacts.filter(c => c.id !== id);

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/contacts", function (req, res) {
    const contact = {
        name: req.body.name,
        phone: req.body.phone
    };

    if (!contact.name) {
        res.send({
            success: false,
            message: "You must specify a contact name"
        });

        return;
    }

    if (!contact.phone) {
        res.send({
            success: false,
            message: "You must specify a contact phone number"
        });

        return;
    }

    const upperCasePhone = contact.phone.toUpperCase();

    if (contacts.some(c => c.phone.toUpperCase() === upperCasePhone)) {
        res.send({
            success: false,
            message: "A contact with the same number already exists"
        });
        return;
    }

    contact.id = currentContactId;
    currentContactId++;

    contacts.push(contact);

    res.send({
        success: true,
        message: null
    });
});

router.put("/api/contacts/:id", function (req, res) {
   // const id = Number(req.params.id);
    const updatedContact = {
        id: req.body.id,
        name: req.body.name,
        phone: req.body.phone
    };

    if (!updatedContact.name || !updatedContact.phone) {
        res.send({
            success: false,
            message: "Both contact name and phone number are required for update"
        });
        return;
    }

    const existingContact = contacts.find(c => c.id === updatedContact.id);
    if (!existingContact) {
        res.send({
            success: false,
            message: "Contact not found for update"
        });
        return;
    }

    const isPhoneNumberTaken = contacts.some(c => c.id !== updatedContact.id && c.phone === updatedContact.phone);
    if (isPhoneNumberTaken) {
        res.send({
            success: false,
            message: "Phone number is already associated with another contact"
        });
        return;
    }

    // Update the contact details
    existingContact.name = updatedContact.name;
    existingContact.phone = updatedContact.phone;

    res.send({
        success: true,
        message: null
    });
});

module.exports = router;
