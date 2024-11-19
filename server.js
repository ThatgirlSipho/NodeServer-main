
//const express = require('express');
//const bodyParser = require('body-parser');
//const cors = require('cors');
//const multer = require('multer');
//const { google } = require('googleapis');
//const fs = require('fs');
//const util = require('util');
//const nodemailer = require('nodemailer'); // Optional: For sending alerts when the refresh token expires
//const { exec } = require('child_process');

//const app = express();
//app.use(bodyParser.json());
//app.use(cors());

//const CLIENT_ID = '425519794407-76tl7n3k2qgorhp3ru24p1i8036vetbu.apps.googleusercontent.com';
//const CLIENT_SECRET = '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';
//const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
//let REFRESH_TOKEN = '1//04JhGsoSquLkuCgYIARAAGAQSNwF-L9IrQ-QUlVqFMbzOY3vOzDT2fbnE_xsPymaG9Ya9nQKX8svVlpnTuoD7SE2uRmpxiJ-k_LM'; // Initial refresh token

//const oauth2Client = new google.auth.OAuth2(
//    CLIENT_ID,
//    CLIENT_SECRET,
//    REDIRECT_URI
//);

//oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//const drive = google.drive({ version: 'v3', auth: oauth2Client });
//const upload = multer({ dest: 'uploads/' });
//const unlinkAsync = util.promisify(fs.unlink);

//const MAIN_FOLDER_ID = '1sNtmCYXDAAizXM5X6_jCP5cCOAo660Ku';

//// Utility to send alert email when refresh token expires (optional)
//const sendTokenExpiredAlert = async () => {
//    let transporter = nodemailer.createTransport({
//        service: 'gmail',
//        auth: {
//            user: 'ampliflowsystem@gmail.com',
//            pass: 'klaoqyklieionces',
//        },
//    });

//    let info = await transporter.sendMail({
//        from: '"Google API Alert" <your_email@gmail.com>',
//        to: 'mkhefasipho@gmail.com',
//        subject: 'Refresh Token Expired',
//        text: 'The refresh token has expired or been revoked. Please reauthorize the app.',
//    });

//    console.log('Token expired alert sent: %s', info.messageId);
//};

//// Function to ensure the access token is fresh before making requests
//async function ensureAccessTokenIsFresh() {
//    try {
//        const tokenInfo = await oauth2Client.getAccessToken();
//        if (!tokenInfo.token || oauth2Client.isTokenExpiring()) {
//            // Automatically refresh the token
//            await oauth2Client.getRequestHeaders();
//        }
//    } catch (error) {
//        if (error.response && error.response.data.error === 'invalid_grant') {
//            console.log('Refresh token expired or revoked.');
//            await sendTokenExpiredAlert();
//            // You could also implement automatic re-authorization using a headless browser here
//        } else {
//            console.error('Error while refreshing token:', error);
//        }
//    }
//}

//// Route to create a folder in Google Drive
//app.post('/create-folder', async (req, res) => {
//    try {
//        // Ensure access token is fresh
//        await ensureAccessTokenIsFresh();

//        const folderMetadata = {
//            'name': 'New Folder',
//            'mimeType': 'application/vnd.google-apps.folder',
//            'parents': [MAIN_FOLDER_ID]
//        };

//        const folder = await drive.files.create({
//            resource: folderMetadata,
//            fields: 'id'
//        });

//        res.status(200).json({ folderId: folder.data.id });
//    } catch (error) {
//        console.error('Error creating folder:', error);
//        res.status(500).send('Error creating folder');
//    }
//});

//// Route to upload a file to Google Drive
//app.post('/upload', upload.single('file'), async (req, res) => {
//    try {
//        // Ensure access token is fresh
//        await ensureAccessTokenIsFresh();

//        const { folderId } = req.body;

//        const filePath = req.file.path;
//        const fileResponse = await drive.files.create({
//            requestBody: {
//                name: req.file.originalname,
//                mimeType: req.file.mimetype,
//                parents: [folderId]
//            },
//            media: {
//                mimeType: req.file.mimetype,
//                body: fs.createReadStream(filePath),
//            },
//            fields: 'id, webViewLink'
//        });

//        await unlinkAsync(filePath);

//        res.status(200).json({ fileId: fileResponse.data.id, link: fileResponse.data.webViewLink });
//    } catch (error) {
//        console.error('Error uploading file:', error);
//        res.status(500).send('Error uploading file');
//    }
//});

//// Start the server
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}`);
//});











//const express = require('express');
//const bodyParser = require('body-parser');
//const cors = require('cors');
//const multer = require('multer');
//const { google } = require('googleapis');
//const fs = require('fs');
//const path = require('path');
//const util = require('util');

//// Load service account credentials from JSON key file
//const SERVICE_ACCOUNT_KEY_FILE = 'C:/service/upload-431218-b678cdbc42b5.json'; // Replace with the path to your service account key file
//const SCOPES = ['https://www.googleapis.com/auth/drive'];
//const MAIN_FOLDER_ID = '1sNtmCYXDAAizXM5X6_jCP5cCOAo660Ku';
//// Initialize express app
//const app = express();
//app.use(bodyParser.json());
//app.use(cors());

//// Authenticate using the service account credentials
//const auth = new google.auth.GoogleAuth({
//    keyFile: SERVICE_ACCOUNT_KEY_FILE,
//    scopes: SCOPES,
//});

//// Create a Google Drive API client
//const drive = google.drive({ version: 'v3', auth });

//// Define unlinkAsync using util.promisify to delete files after upload
//const unlinkAsync = util.promisify(fs.unlink);

//// Function to upload a file to Google Drive
//const uploadFile = async(filePath, fileName, folderId = MAIN_FOLDER_ID) => {
//    try {
//        const fileMetadata = {
//            name: fileName,
//            parents: [folderId], // Specify the folder ID where the file should be uploaded
//        };

//        const media = {
//            mimeType: 'application/octet-stream',
//            body: fs.createReadStream(filePath),
//        };

//        const file = await drive.files.create({
//            resource: fileMetadata,
//            media: media,
//            fields: 'id, webViewLink',
//        });

//        return file.data;
//    } catch (error) {
//        console.error('Error uploading file to Google Drive:', error);
//        throw error;
//    }
//};

//// Function to create a folder in Google Drive
//const createFolder = async ( parentFolderId = MAIN_FOLDER_ID) => {
//    try {
//        const folderMetadata = {
//            name: 'New Folder',
//            mimeType: 'application/vnd.google-apps.folder',
//            parents: parentFolderId ? [parentFolderId] : [],
//        };

//        const folder = await drive.files.create({
//            resource: folderMetadata,
//            fields: 'id',
//        });

//        return folder.data.id;
//    } catch (error) {
//        console.error('Error creating folder in Google Drive:', error);
//        throw error;
//    }
//};

//// API to upload a file
//app.post('/upload', multer({ dest: 'uploads/' }).single('file'), async (req, res) => {
//    try {
//        const { folderId } = req.body;
//        const filePath = req.file.path;
//        const fileName = req.file.originalname;

//        // Upload the file to Google Drive
//        const fileData = await uploadFile(filePath, fileName, folderId);

//        // Delete the file from local server storage
//        await unlinkAsync(filePath);

//        res.status(200).json({ docId: fileData.id, link: fileData.webViewLink });
//    } catch (error) {
//        res.status(500).send('Error uploading file');
//    }
//});

//// API to create a folder in Google Drive
//app.post('/create-folder', async (req, res) => {
//    try {
//        const { parentFolderId } = req.body;

//        // Create a new folder in Google Drive
//        const folderId = await createFolder( parentFolderId);

//        res.status(200).json({ folderId });
//    } catch (error) {
//        res.status(500).send('Error creating folder');
//    }
//});

//// Start the express server
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}`);
//});








const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Load service account credentials from JSON key file
const SERVICE_ACCOUNT_KEY_FILE = 'C:/service/upload-431218-b678cdbc42b5.json'; // Replace with your service account key file
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const MAIN_FOLDER_ID = '1sNtmCYXDAAizXM5X6_jCP5cCOAo660Ku';

// Initialize express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Authenticate using the service account credentials
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_FILE,
    scopes: SCOPES,
});

// Create a Google Drive API client
const drive = google.drive({ version: 'v3', auth });

// Define unlinkAsync using util.promisify to delete files after upload
const unlinkAsync = util.promisify(fs.unlink);

// Set multer storage and file validation
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept file
        } else {
            cb(new Error('Invalid file type. Only images, documents, and PDFs are allowed.'), false); // Reject file
        }
    },
});

// Function to upload a file to Google Drive
const uploadFile = async (filePath, fileName, folderId = MAIN_FOLDER_ID) => {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };

        const media = {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(filePath),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        return file.data;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
    }
};

// Function to create a folder in Google Drive
const createFolder = async (parentFolderId = MAIN_FOLDER_ID) => {
    try {
        const folderMetadata = {
            name: 'New Folder',
            mimeType: 'application/vnd.google-apps.folder',
            parents: parentFolderId ? [parentFolderId] : [],
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id',
        });

        return folder.data.id;
    } catch (error) {
        console.error('Error creating folder in Google Drive:', error);
        throw error;
    }
};

// API to upload a file
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { folderId } = req.body;
        const filePath = req.file.path;
        const fileName = req.file.originalname;

        // Upload the file to Google Drive
        const fileData = await uploadFile(filePath, fileName, folderId);

        // Delete the file from local server storage
        await unlinkAsync(filePath);

        res.status(200).json({ docId: fileData.id, link: fileData.webViewLink });
    } catch (error) {
        if (error.message === 'Invalid file type. Only images, documents, and PDFs are allowed.') {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Error uploading file');
        }
    }
});

// API to create a folder in Google Drive
app.post('/create-folder', async (req, res) => {
    try {
        const { parentFolderId } = req.body;

        // Create a new folder in Google Drive
        const folderId = await createFolder(parentFolderId);

        res.status(200).json({ folderId });
    } catch (error) {
        res.status(500).send('Error creating folder');
    }
});

// Start the express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// API to delete a file from Google Drive
app.delete('/delete-file/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        // Delete the file from Google Drive
        await drive.files.delete({
            fileId: fileId,
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting file from Google Drive:', error);
        res.status(500).json({ success: false });
    }
});



const deleteFolder = async (folderId) => {
    try {
        await drive.files.delete({
            fileId: folderId,
        });
        console.log(`Folder with ID ${folderId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting folder in Google Drive:', error);
        throw error;
    }
};

// API to delete a folder
app.delete('/delete-folder', async (req, res) => {
    const { folderId } = req.body;

    if (!folderId) {
        return res.status(400).send('folderId is required');
    }

    try {
        // Delete the folder from Google Drive
        await deleteFolder(folderId);

        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Folder deleted successfully'
        });
    } catch (error) {
        // Send error response with additional error details
        res.status(500).json({
            status: 'error',
            message: 'Error deleting folder',
            error: error.message
        });
    }
});