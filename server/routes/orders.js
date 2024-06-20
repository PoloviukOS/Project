const { Router, request } = require("express");
const { check, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");
const config = require("config");

const User = require("../models/User");

const router = Router();
sgMail.setApiKey(config.get("sendgridMailApiKey")); //https://app.sendgrid.com <-- real.estate.navigator.mediator@gmail.com

router.get("/getDataUser/:id", async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await User.findById(userId);
    if (!user) return response.status(400).json({ message: "Error: User" });
    const { fullName, numberPhone, email } = user;

    response.status(200).json({ fullName, numberPhone, email });
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.post(
  "/placingAnOrder",
  [
    check("fullName").notEmpty().withMessage("Error: Full name"),
    check("numberPhone").notEmpty().withMessage("Error: Phone number"),
    check("email").notEmpty().withMessage("Error: Email"),
    check("order").notEmpty().withMessage("Error: Order"),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Error: Data",
        });
      }

      const { fullName, numberPhone, email, order } = request.body;

      const msg = {
        to: "real.estate.navigator.main@gmail.com",
        from: "real.estate.navigator.mediator@gmail.com",
        subject: `Order from ${fullName}`,
        text: `${order}\n\nNumber phone: ${numberPhone}\nEmail: ${email}`,
      };

      const sendMain = async () => {
        try {
          await sgMail.send(msg);
          console.log("Email sent...");
          response.status(200).json({ message: "Successful request" });
        } catch (error) {
          response.status(500).json({ message: "Error: Mail" });
        }
      };
      sendMain();
    } catch (error) {
      response.status(500).json({ message: "Error: Server" });
      console.log(error);
    }
  }
);

module.exports = router;
