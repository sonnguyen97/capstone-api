const Email = require("../models/Email");
const EmailTemplate = require("../models/EmailTemplate");
const EmailSubscriber = require("../models/Email_Subscriber");
const uuidv1 = require("uuid/v1");
const sequelize = require("sequelize");
const EmailStatusConstant = require("../constants/email/EmailActivationStatus.constant");
const nodemailer = require("nodemailer");
const emailCredential = require("../config/GmailAccountCredential");
const htmltoText = require("html-to-text");
const EmailValidator = require("email-deep-validator");

module.exports = {
  createEmail: async email => {
    try {
      let newEmail = new Email();
      newEmail.id = uuidv1();
      newEmail.from = !email ? "" : email.from;
      newEmail.subject = !email ? "" : email.subject;
      newEmail.body = !email ? "" : email.body;
      newEmail.raw_content = !email ? "" : email.raw_content;
      newEmail.template_id = !email ? null : email.template_id;
      newEmail.status_id = EmailStatusConstant.ACTIVATED.id;
      newEmail.origin_id = !email ? newEmail.id : email.origin_id;

      let createResult = await newEmail
        .save()
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO ADD EMAIL ERROR");
          console.log(error.message);
          return null;
        });

      return createResult;
    } catch (error) {
      console.log("* DAO ADD EMAIL ERROR");
      console.log(error.message);
      return null;
    }
  },

  findEmailById: async emailId => {
    try {
      const email = await Email.findAll({
        where: {
          id: emailId
        }
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO GET EMAIL BY ID ERROR");
          console.log(error);
          return null;
        });

      return email;
    } catch (error) {
      console.log("* DAO GET EMAIL BY ID ERROR");
      console.log(error);
      return null;
    }
  },

  deleteEmail: async emailId => {
    try {
      const deleteResult = await Email.update(
        { status_id: EmailStatusConstant.DEACTIVATED.id },
        {
          where: {
            origin_id: emailId
          }
        }
      )
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO DELETE EMAIL ERROR");
          console.log(error);
          return false;
        });

      console.log("* DAO DELETE EMAIL deleteResult");
      console.log(deleteResult);
      return deleteResult;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  },

  updateEmailContent: async email => {
    try {
      // const rawContent = JSON.stringify(email.rawContent);
      const rawContent = email.rawContent;
      const updateResult = await Email.update(
        {
          from: email.from,
          body: email.htmlContent,
          subject: email.subject,
          raw_content: rawContent,
          template_id: email.templateId
        },
        { where: { id: email.id } }
      )
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO UPDATE EMAIL ERROR");
          console.log(error);
          return false;
        });

      console.log("* DAO UPDATE EMAIL updateResult");
      console.log(updateResult);
      return updateResult;
    } catch (error) {
      console.log("* DAO UPDATE EMAIL ERROR");
      console.log(error);
      return false;
    }
  },

  findEmailSubscriberById: async emailSubscriber => {
    try {
      const email = await EmailSubscriber.findAll({
        where: {
          subscriber_id: emailSubscriber.subscriber_id,
          email_id: emailSubscriber.email_id
        }
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO FIND EMAIL_SUBSCRIBER BY ID ERROR");
          console.log(error);
          return null;
        });

      return email;
    } catch (error) {
      console.log("* DAO FIND EMAIL_SUBSCRIBER BY ID ERROR");
      console.log(error);
      return null;
    }
  },

  addEmailSubscriber: async emailSubscriber => {
    try {
      let newEmailSubscriber = new EmailSubscriber();
      newEmailSubscriber.subscriber_id = emailSubscriber.subscriber_id;
      newEmailSubscriber.email_id = emailSubscriber.email_id;
      newEmailSubscriber.has_opened_email = emailSubscriber.has_opened_email;
      newEmailSubscriber.has_clicked_url = emailSubscriber.has_clicked_url;
      newEmailSubscriber.is_bounced = emailSubscriber.is_bounced;
      newEmailSubscriber.is_sent = emailSubscriber.is_sent;
      newEmailSubscriber.is_tracking_open = emailSubscriber.is_tracking_open;
      newEmailSubscriber.is_tracking_click = emailSubscriber.is_tracking_click;

      const addResult = await newEmailSubscriber
        .save()
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("ADD EMAIL_SUBSCRIBER ERROR");
          console.log(error.message);
          return null;
        });

      // CHECKING RESULT
      // console.log("ADD EMAIL_SUBSCRIBER RESULT");
      // console.log(addResult);

      return addResult;
    } catch (error) {
      console.log("ADD EMAIL_SUBSCRIBER ERROR");
      console.log(error.message);
      return null;
    }
  },

  updateEmailSubscriberIsBounced: async emailSubscriber => {
    try {
      const updateResult = await EmailSubscriber.update(
        {
          is_bounced: emailSubscriber.is_bounced
        },
        {
          where: {
            subscriber_id: emailSubscriber.subscriber_id,
            email_id: emailSubscriber.email_id
          }
        }
      )
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("UPDATE EMAIL_SUBSCRIBER IS_BOUNCED ERROR");
          console.log(error);
          return null;
        });

      // CHECKING RESULT
      console.log("UPDATE EMAIL_SUBSCRIBER IS_BOUNCED RESULT");
      console.log(updateResult);
    } catch (error) {
      console.log("UPDATE EMAIL_SUBSCRIBER IS_BOUNCED ERROR");
      console.log(error);
      return null;
    }
  },

  updateEmailSubscriberSentTime: async emailSubscriber => {
    try {
      const updateResult = await EmailSubscriber.update(
        {
          sent_time: null
        },
        {
          where: {
            subscriber_id: emailSubscriber.subscriber_id,
            email_id: emailSubscriber.email_id
          }
        }
      )
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("UPDATE EMAIL_SUBSCRIBER SENT_TIME ERROR");
          console.log(error);
          return null;
        });

      // CHECKING RESULT
      console.log("UPDATE EMAIL_SUBSCRIBER SENT_TIME RESULT");
      console.log(updateResult);
    } catch (error) {
      console.log("UPDATE EMAIL_SUBSCRIBER SENT_TIME ERROR");
      console.log(error);
      return null;
    }
  },

  updateEmailSubscriberHasOpened: async emailSubscriber => {
    try {
      const updateResult = await EmailSubscriber.update(
        {
          has_opened_email: emailSubscriber.has_opened_email
        },
        {
          where: {
            subscriber_id: emailSubscriber.subscriber_id,
            email_id: emailSubscriber.email_id
          }
        }
      )
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("UPDATE EMAIL_SUBSCRIBER HAS_OPENED ERROR");
          console.log(error);
          return null;
        });

      // CHECKING RESULT
      console.log("UPDATE EMAIL_SUBSCRIBER HAS_OPENED RESULT");
      console.log(updateResult);
      return updateResult;
    } catch (error) {
      console.log("UPDATE EMAIL_SUBSCRIBER HAS_OPENED ERROR");
      console.log(error);
      return null;
    }
  },

  updateEmailSubscriberHasClicked: async emailSubscriber => {
    try {
      const updateResult = await EmailSubscriber.update(
        {
          has_clicked_url: emailSubscriber.has_clicked_url
        },
        {
          where: {
            subscriber_id: emailSubscriber.subscriber_id,
            email_id: emailSubscriber.email_id
          }
        }
      )
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("UPDATE EMAIL_SUBSCRIBER HAS_CLICKED ERROR");
          console.log(error);
          return null;
        });

      // CHECKING RESULT
      console.log("UPDATE EMAIL_SUBSCRIBER HAS_CLICKED RESULT");
      console.log(updateResult);
    } catch (error) {
      console.log("UPDATE EMAIL_SUBSCRIBER HAS_CLICKED ERROR");
      console.log(error);
      return null;
    }
  },

  deleteEmailSubscribers: async emailSubscriber => {
    try {
      const deleteResult = await EmailSubscriber.destroy({
        where: {
          subscriber_id: emailSubscriber.subscriber_id,
          email_id: emailSubscriber.email_id
        }
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("DELETE EMAIL_SUBSCRIBER ERROR");
          console.log(error.message);
          return false;
        });

      console.log("DELETE EMAIL_SUBSCRIBER RESULT");
      console.log(deleteResult);
      return deleteResult;
    } catch (error) {
      console.log("DELETE EMAIL_SUBSCRIBER ERROR");
      console.log(error.message);
      return false;
    }
  },

  sendMail: async email => {
    try {
      const receiver = !email.to ? null : email.to;
      const subject = !email.subject ? null : email.subject;
      const htmlContent = !email.html ? '' : email.html;

      // console.log(htmlContent)

      if (!receiver || !subject || !htmlContent) {
        return false;
      }

      let transporter = nodemailer.createTransport({
        // logger: true,
        socketTimeout: 5000,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: emailCredential.GmailAccount.email,
          pass: emailCredential.GmailAccount.pass
        }
      });

      const textContent = htmltoText.fromString(htmlContent);
      console.log(textContent);

      console.log(`*----- SEND MAIL - START ------*`);
      console.log(`Start emailing to <${receiver}> \n... ... ...`);

      const sendingResult = await transporter
        .sendMail({
          from: '"EMM_Capstone_Project" <noreply@vqn.com>',
          replyTo: "no-reply@emm-capstone-project.com",
          to: receiver,
          subject: subject,
          text: textContent,
          html: htmlContent
        })
        .then(info => {
          console.log(`success with id <${info.messageId}>`);
          console.log(`*----- SEND MAIL - END ------*`);
          return true;
        })
        .catch(error => {
          console.log(`*** ERROR !!!`);
          console.log(error);
          console.log(`*----- SEND MAIL - END ------*`);
          return false;
        });

      console.log(`SENDING RESULT`);
      console.log(sendingResult);
      return sendingResult;
    } catch (error) {
      console.log("SENDING EMAIL ERROR");
      console.log(error.message);
      return false;
    }
  },

  // EMAIL TEMPLATE
  createEmailTemplate: async emailTemplate => {
    try {
      let newEmailTemplate = new EmailTemplate();
      newEmailTemplate.id = uuidv1();
      newEmailTemplate.name = emailTemplate.name;
      newEmailTemplate.body = emailTemplate.htmlContent;
      newEmailTemplate.raw_content = emailTemplate.designContent;
      const createResult = await newEmailTemplate
        .save()
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO ADD EMAIL TEMPLATE ERROR");
          console.log(error);
          return null;
        });

      return createResult;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  },

  getAllEmailTemplates: async () => {
    try {
      const getEmailTemplatesResult = await EmailTemplate.findAll()
        .then(result => {
          return result;
        })
        .catch(error => {
          console.log("* DAO GET EMAIL TEMPLATES ERROR");
          console.log(error.message);
          return null;
        });

      return getEmailTemplatesResult;
    } catch (error) {
      console.log("* DAO GET EMAIL TEMPLATES ERROR");
      console.log(error.message);
      return null;
    }
  },

  /**
   * Create a transaction process to retrieve an available Email by its ID.
   * @param {string} emailId ID of the Email to be retrieved
   * @param {object} transaction A transaction instance
   * @returns {Promise<any>} A retrieved Email or null if not found
   */
  find: async (emailId, transaction = null) => {
    var queryOptions = {
      attributes: ["id", "from", "subject", "template_id", "body", "raw_content", "status_id", "origin_id"],
      where: {
        id: emailId,
        status_id: EmailStatusConstant.ACTIVATED.id
      }
    };

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const email = Email.findOne(queryOptions).then(result => result.dataValues || null);

    return email ? email : null;
  },

  /**
   * Perform querying to save an Email.
   * If a transaction is passed as second argument, this will perform a transaction query process instead of an independent query.
   * @param {object} data Raw data of the Email information
   * @param {object} transaction A transaction instance
   * @returns {object} A new created Email or null if any exception occurs
   */
  save: async (data, transaction = null) => {
    var queryOptions = {};

    if (transaction !== null) {
      queryOptions["transaction"] = transaction;
    }

    const email = await Email.create(data, queryOptions)
      .then(result => result)
      .catch(error => console.log(error.message));

    return email ? email : null;
  },

  /**
   * Verify en email address whether it's existed or not.
   * @param {string} email An email address to be verified
   * @returns {Promise<boolean>} true if the email address is existed, otherwise false
   */
  verify: async email => {
    const emailValidator = new EmailValidator();
    const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(email);

    return wellFormed && validDomain && validMailbox;
  }
};
