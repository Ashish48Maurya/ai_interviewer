import 'dotenv/config'
import express from "express"
import multer from "multer"
import path from "path"
import fs from "node:fs"
import { PdfReader } from 'pdfreader'

const upload = multer({ dest: 'uploads/' });
const app = express();
const port = process.env.PORT || 3000;

const extractPdfContent = (filePath) => {
    return new Promise((resolve, reject) => {
        const textItems = [];
        let lastY = 0;
        let currentLine = [];

        fs.readFile(filePath, (err, pdfBuffer) => {
            if (err) {
                return reject(err);
            }

            new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    return reject(err);
                }

                if (!item) {
                    if (currentLine.length > 0) {
                        textItems.push(currentLine.join(' '));
                    }
                    if (textItems.length === 0) {
                        return resolve('No content found in the PDF');
                    }
                    return resolve(textItems.join('\n'));
                }

                if (item.text) {
                    if (item.y !== lastY && lastY !== 0) {
                        textItems.push(currentLine.join(' '));
                        currentLine = [];
                    }

                    currentLine.push(item.text);
                    lastY = item.y;
                }
            });
        });
    });
};

const extractResumeContent = async (filePath) => {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension === '.pdf') {
        const text = await extractPdfContent(filePath);
        return text;
    } else {
        return Promise.reject('Unsupported file format');
    }
};

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post('/upload-resume', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const filePath = newPath;

    try {
        const resumeText = await extractResumeContent(filePath);
        if (!resumeText) {
            return res.status(500).json({ success: false, message: 'Failed to extract resume text' });
        }
        res.json({
            success: true,
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
