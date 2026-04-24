import mongoose from "mongoose";

const Transaction = new mongoose.Schema({
    // montante
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['expense', 'income'], // entrada ou saida
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

export default mongoose.model("Transaction", Transaction);