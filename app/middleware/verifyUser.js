const validator = require('../helpers/validate');
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

validateUpdateProfile = (req, res, next) => {
	const validationRule = {
		"fullname": "required|string",
        "gender": "required|max:1|integer",
        "dateBirth": "required|date"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if(!status){
            res.status(412)
                .send({
                    success: false,
                    message: 'VALIDATION_ERROR',
                    data: err
                });
        }else{
            next();
        }
    });
};

validateUpdatePassword = (req, res, next) => {
	const validationRule = {
        "currentPassword": "required|string|min:6",
        "password": "required|string|min:6|confirmed",
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if(!status){
            res.status(412)
                .send({
                    success: false,
                    message: 'VALIDATION_ERROR',
                    data: err
                });
        }else{
            next();
        }
    });
};

const verifyUser = {
  validateUpdateProfile: validateUpdateProfile,
  validateUpdatePassword: validateUpdatePassword
};
module.exports = verifyUser;