const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    action: { type: String, enum: ['agregado', 'editado', 'eliminado'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
