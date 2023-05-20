const multer = require("multer");
const firebase = require("../config/firebase_config");
const { NotFoundError } = require("../errors");
// const request = require("request");
const path = require("path");
const joi = require("joi");
const fs = require("fs");
const { title, body, device_token } = require("../helpers/joi_schema");

const parentDirectory = path.dirname(__dirname);

const uploadFile = async (req, res, next) => {
  const upload = multer({
    storage: multer.memoryStorage(),
  });

  upload.array("files", 10)(req, res, async () => {
    if (!req.files) {
      throw new NotFoundError("No files found");
    }

    const uploadPromises = req.files.map(file => {
      const blob = firebase.bucket.file(file.originalname);

      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        blobWriter.on("error", async (err) => {
          console.log(err);
          await firebase.storage().bucket().file(file.originalname).delete();
          reject(new Error("Upload file to Firebase error!"));
        });

        blobWriter.on("finish", () => {
          console.log(`File upload ${file.originalname}`);
          resolve();
        });

        blob.getSignedUrl({
          action: "read",
          expires: "10-17-2023", // expiration date in mm-dd-yyyy format
        })
          .then(([url]) => {
            console.log(url);
            blob.download()
              .then((data) => {
                const pathImg = parentDirectory + "/public/" + file.originalname;
                fs.writeFile(pathImg, data[0], (err) => {
                  if (err) {
                    console.log(err);
                    reject(new Error("Get file from Firebase error!"));
                  } else {
                    console.log(`File written to disk ${file.originalname}`);
                    resolve(url);
                  }
                });
              })
              .catch((err) => {
                console.log(err);
                reject(new Error("Download file from Firebase error!"));
              });
          })
          .catch((err) => {
            console.log(err);
            reject(new Error("Get signed URL from Firebase error!"));
          });

        blobWriter.end(file.buffer);
        
      });
    });
      const results = await Promise.all(uploadPromises);
      req.file_image = results;
      next();
  });
};

const pushNotification = (req, res) => {
  const { error } = joi
    .object({ title, body, device_token })
    .validate( req.body );
  if (error) throw new BadRequestError(error.details[0].message);
  const message = {
    notification: {
      title: req.body.title,
      body: req.body.content,
    },
    token: req.body.device_token,
  };

  firebase
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

module.exports =  {uploadFile, pushNotification};
