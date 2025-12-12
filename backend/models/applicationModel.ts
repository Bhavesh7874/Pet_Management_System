import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
    user: mongoose.Schema.Types.ObjectId;
    pet: mongoose.Schema.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    message: string;
}

const applicationSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Application = mongoose.model<IApplication>('Application', applicationSchema);
export default Application;
