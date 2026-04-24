// const multer = require("multer")

// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 3 * 1024 * 1024 // 3MB
//     }
// })

// module.exports = upload


const multer = require("multer");

// Configure storage
const storage = multer.memoryStorage();

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB limit
        files: 1 // Maximum number of files
    },
    fileFilter: fileFilter
});

module.exports = upload;