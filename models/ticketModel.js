// models/ticketModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String,
});

ticketSchema.pre('save', function(next) {
  this.code = `TICKET-${Date.now()}`;
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
