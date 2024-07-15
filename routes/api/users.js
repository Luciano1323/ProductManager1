const express = require('express');
const passport = require('passport');
const multer = require('multer');
const User = require('../../models/userModel');
const { isAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profile') {
      cb(null, 'profiles/');
    } else if (file.fieldname === 'product') {
      cb(null, 'products/');
    } else {
      cb(null, 'documents/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ruta para actualizar usuario a premium
router.patch('/premium/:uid', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verificar que el usuario haya subido los documentos requeridos
  const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
  const uploadedDocuments = user.documents.map(doc => doc.name);

  const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

  if (!hasAllDocuments) {
    return res.status(400).json({ message: 'User has not uploaded all required documents' });
  }

  user.role = 'premium';
  await user.save();

  res.json({ message: `User role updated to ${user.role}` });
});

// Ruta para subir documentos
router.post('/:uid/documents', passport.authenticate('jwt', { session: false }), upload.array('documents'), async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.files) {
    req.files.forEach(file => {
      user.documents.push({ name: file.originalname, reference: file.path });
    });
  }

  user.last_connection = new Date();
  await user.save();

  res.json({ message: 'Documents uploaded successfully', documents: user.documents });
});

module.exports = router;
