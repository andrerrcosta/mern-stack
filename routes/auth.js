const express = require('express');
const router = express.Router();
const { UserModel, RegisterValidation, LoginValidation } = require("../models/user.model");
const bcrypt = require('bcryptjs');
const JWT = require('../services/jwt.service');
const logger = require('../services/logger.service');

router.post('/register', async (req, res) => {

    console.log(req.body);

    try {
        if (req.body === undefined) return res.status(400).send("Bad Request");

        await RegisterValidation.validateAsync(req.body);

        console.log("\n\nbody:", req.body, "\n\n");

        //Check availability
        let mailExists = await UserModel.findOne({ email: req.body.email });
        let userExists = await UserModel.findOne({ email: req.body.user });
        if (mailExists) return res.status(400).send({ error: "This email is already registered" });
        if (userExists) return res.status(400).send({ error: "This username is already registered" });

        const salt = await bcrypt.genSalt(15);
        const hash = await bcrypt.hash(req.body.password, salt);

        let user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            roles: 1,
            password: hash
        });

        const savedUser = await user.save();
        savedUser.password = undefined;
        return res.status(200).send({ savedUser });
    } catch (err) {
        console.log("REGISTRATION FAILED", err);
        return res.status(400).send({ error: "Registration Failed", err });
    }
});

router.post('/login', async (req, res) => {

    try {
        if (req.body === undefined) return res.status(400).send("Bad Request");
        const { username, password } = req.body;
        console.log(username, password);
        // await LoginValidation.validateAsync({ username, password });

        let user = await UserModel.findOne({ email: username }).select("+password");
        if (!user) return res.status(401).send("Wrong username or password");

        let valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            console.log("IS INVALID");
            return res.status(401).send("Wrong username or password");
        } else {
            console.log("IS VALID");
            let token = JWT.sign({ user: user.id });
            user.password = undefined;
            res.header("user-token", token).send({ user, token });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }

});



module.exports = router;
