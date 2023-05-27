const express = require("express");
const cores = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const imgJson = require("./imageGallery.json");

const app = express();
app.use(cores());
app.use(express.static("public"));

const uploadProgress = {
  value: 0,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const upload = multer({
  storage: storage, // Define the onProgress method to store progress updates in a global variable
  //   onProgress: (progressEvent) => {
  //     uploadProgress.value = Math.round(
  //       (progressEvent.loaded / progressEvent.total) * 100
  //     );
  //   },
});

app.get("/api/getimages", (req, res) => {
  res.json(imgJson);
});

// app.get("/api/uploadprogress", (req, res) => {
//   console.log(
//     "🚀 ~ file: index.js:40 ~ app.get ~   uploadProgress.value:",
//     uploadProgress.value
//   );
//   res.status(200).send({ progress: global.progress || 0 });
// });

app.post("/api/upload", upload.single("upload_file"), (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  const delay = Math.floor(Math.random() * 3000) + 1000; // random delay of 1-4 seconds
  const uploadPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!req.file) {
        reject("Error uploading file.");
      } else {
        resolve("File uploaded successfully.");
      }
    }, delay);
  });

  uploadPromise
    .then((response) => {
      console.log(response);

      //   const data = JSON.parse(imgJson);
      imgJson.push({ id: uuidv4(), fileName: req.file.filename });
      fs.writeFileSync("./imageGallery.json", JSON.stringify(imgJson));

      res.status(200).json({ message: "image uploaded" });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

const PORT = 3008;
app.listen(PORT, () => console.log("server running"));
