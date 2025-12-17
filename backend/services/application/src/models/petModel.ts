import mongoose, { Document, Schema } from 'mongoose';

export interface IPet extends Document {
    name: string;
    species: string;
    breed: string;
    age: number;
    description: string;
    category: 'adoption' | 'sale';
    price: number;
    status: 'available' | 'pending' | 'adopted' | 'sold';
    images: string[];
}

const petSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['adoption', 'sale'],
        default: 'adoption',
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted', 'sold'],
        default: 'available',
    },
    images: [{
        type: String,
    }],
}, {
    timestamps: true,
});

const Pet = mongoose.model<IPet>('Pet', petSchema);
export default Pet;
