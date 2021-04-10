const validator = require('../helpers/validate');
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

validateInput = (req, res, next) => {
	const validationRule = {
		"email": "required|email",
        "password": "required|string"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'VALIDATION_ERROR',
                    data: err
                });
        } else {
            next();
        }
    });
};

const verifySignIn = {
  validateInput: validateInput
};

module.exports = verifySignIn;
