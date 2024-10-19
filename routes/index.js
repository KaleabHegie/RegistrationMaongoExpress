const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");

const mongoose = require("mongoose");
const Registration = mongoose.model("Registration");

const path = require('path');
const auth = require('http-auth');

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
  });

module.exports = router;
router.post(
    "/",
    [
      check("name").isLength({ min: 5 }).withMessage("Please enter a name"),
      check("email").isLength({ min: 1 }).withMessage("Please enter an email"),
    ],
    (req, res) => {
      const errors = validationResult(req);
  
      if (errors.isEmpty()) {
        res.send("Thank you for your registration!");
        const registration = new Registration(req.body);
        registration
          .save()
          .then(() => {
            res.send("Thank you for your registration!");
          })
          .catch((err) => {
            console.log(err);
            res.send("Sorry! Something went wrong.");
          });
      } else {
        res.render("form", {
          title: "Registration form",
          errors: errors.array(),
          data: req.body,
        });
      }
    }
  );
  
  router.get('/registrations', basic.check((req, res) =>  {
    Registration.find()
      .then((registrations) => {
        res.render('index', { title: 'Listing registrations', registrations });
      })
      .catch(() => { res.send('Sorry! Something went wrong.'); });
  }));



router.get('/', (req, res) => {
    res.render('form', { title: 'Registration form' });
  });

