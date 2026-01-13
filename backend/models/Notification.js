const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['status_update', 'new_job', 'system'], default: 'system' },
    read: { type: Boolean, default: false },
    link: { type: String } // Optional link to redirect to
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
