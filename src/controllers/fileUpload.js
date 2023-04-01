const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploaded-media/");
  },
  filename: function (req, file, cb) {
    var fileName = path.parse(file.originalname).name; //Filename without extension
    var name = `${fileName}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});

const upload = multer({
  // dest:"uploaded-media",
  storage: storage,
  limits: {
    fileSize: 10485760,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith(".pdf")) {
      return cb(
        new Error(
          "You're uploading other than pdf file. File should be pdf. Try again!"
        )
      );
    }
    cb(undefined, true);
  },
});
const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    var name = `logo${path.extname(file.originalname)}`;
    cb(null, name);
  },
});
const logoUpload = multer({
  storage: logoStorage,
  limits: {
    fileSize: 10485760,
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      return cb(undefined, true);
    }
    cb(new Error("File should be image. Try again!"));
  },
});
const userAvatar = multer({
  limits: {
    fileSize: 2056000,
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      return cb(undefined, true);
    }
    cb(new Error("File should be image. Try again!"));
  },
});
const courseBanner = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images/course/");
    },
    filename: function (req, file, cb) {
      var name = `${
        path.parse(file.originalname).name
      }-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, name);
    },
  }),
  limits: {
    fileSize: 10485760,
  },
  fileFilter(req, file, cb) {
    imageFileFilter(file, cb);
  },
  // fileFilter(req, file, cb) {
  //   if (
  //     file.mimetype === "image/png" ||
  //     file.mimetype === "image/jpg" ||
  //     file.mimetype === "image/jpeg"
  //   ) {
  //     return cb(undefined, true);
  //   }
  //   cb(new Error("File should be image. Try again!"));
  // },
});
const postImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images/posts"),
    filename: (req, file, cb) => {
      var name = `${
        path.parse(file.originalname).name
      }-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, name);
    }
  }),
  fileFilter(req, file, cb) {
    imageFileFilter(file, cb);
  },
}).array('image[]', 2);

function imageFileFilter(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extname && mimeType) {
    return cb(undefined, true);
  } else {
    cb(null, false);
    cb(new Error("Error: Images only!"));
  }
}
module.exports = { upload, logoUpload, userAvatar, courseBanner, postImage };
