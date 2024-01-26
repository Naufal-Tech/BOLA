import DataParser from "datauri/parser.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Not Using Buffer
const setupMulter = (importMetaUrl) => {
  const __dirname = path.dirname(fileURLToPath(importMetaUrl));
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../images");
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname;
      // Format timestamp to "DD-MMM-YYYY" in Asia/Jakarta timezone
      const formattedDate = moment().tz("Asia/Jakarta").format("DD-MMMM-YYYY");
      // Combine formatted date and original filename
      const newFileName = `${formattedDate}-${fileName}`;
      cb(null, newFileName);
    },
  });
  return multer({ storage });
};

const storage = multer.memoryStorage();
const upload = multer({ storage });
const parser = new DataParser();

export const formatImage = (file) => {
  const fileExtention = path.extname(file.originalname).toString();
  return parser.format(fileExtention, file.buffer).content;
};

// Using Validation Extension:
// const setupMulter = (importMetaUrl) => {
//   const __dirname = path.dirname(fileURLToPath(importMetaUrl));
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = path.join(__dirname, "../images");
//       cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//       const fileName = file.originalname;
//       const validExtensions = [".jpg", ".jpeg", ".png"];

//       // Check if the file has a valid extension
//       if (validExtensions.includes(path.extname(fileName).toLowerCase())) {
//         const formattedDate = moment()
//           .tz("Asia/Jakarta")
//           .format("DD-MMMM-YYYY");
//         const newFileName = `${formattedDate}-${fileName}`;
//         cb(null, newFileName);
//       } else {
//         cb(new Error("Invalid file extension"), null);
//       }
//     },
//   });
//   return multer({ storage });
// };

// export const formatImage = (file) => {
//   const validExtensions = [".jpg", ".jpeg", ".png"];

//   // Using validation extension
//   if (validExtensions.includes(path.extname(file.originalname).toLowerCase())) {
//     return parser.format(path.extname(file.originalname), file.buffer).content;
//   } else {
//     throw new Error("Invalid file extension");
//   }
// };

// Also Handling Size:
// const setupMulter = (importMetaUrl) => {
//   const __dirname = path.dirname(fileURLToPath(importMetaUrl));
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = path.join(__dirname, "../images");
//       cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//       const fileName = file.originalname;
//       const validExtensions = [".jpg", ".jpeg", ".png"];
//       const maxFileSize = 5 * 1024 * 1024; // 5 MB

//       // Check if the file has a valid extension
//       if (validExtensions.includes(path.extname(fileName).toLowerCase())) {
//         // Check if the file size is within the acceptable range
//         if (file.size <= maxFileSize) {
//           const formattedDate = moment()
//             .tz("Asia/Jakarta")
//             .format("DD-MMMM-YYYY");
//           const newFileName = `${formattedDate}-${fileName}`;
//           cb(null, newFileName);
//         } else {
//           cb(new Error("File size exceeds the allowed limit"), null);
//         }
//       } else {
//         cb(new Error("Invalid file extension"), null);
//       }
//     },
//   });
//   return multer({ storage });
// };

// export const formatImage = (file) => {
//   const validExtensions = [".jpg", ".jpeg", ".png"];
//   const maxFileSize = 5 * 1024 * 1024; // 5 MB

//   // Using validation extension and size
//   if (
//     validExtensions.includes(path.extname(file.originalname).toLowerCase()) &&
//     file.size <= maxFileSize
//   ) {
//     return parser.format(path.extname(file.originalname), file.buffer).content;
//   } else {
//     throw new Error("Invalid file extension or file size exceeds the limit");
//   }
// };

export { setupMulter, upload };
