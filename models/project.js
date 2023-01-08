const mongoose = require('mongoose');

const projectTemplate = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    start:{
        type: Date,
        required: true,
    },
    end:{
        type: Date,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    notes:{
        type: String,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps:{
        createdAt: true,
        updatedAt: true,
    }
});

module.exports=mongoose.model('Project',projectTemplate);