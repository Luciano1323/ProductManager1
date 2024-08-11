const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se almacenarán los archivos subidos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Rutas que usan multer
router.post('/upload', upload.single('file'), (req, res) => {
  res.send('Archivo subido exitosamente');
});

module.exports = router;
