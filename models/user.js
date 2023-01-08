const mongoose = require('mongoose');

const userTemplate = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
    },
    country:{
        type:String,
        required:true
    },
    profession:[
        {
            company:{
                type: String,
                required: true
            },
            occupation:{
                type: String,
                required: true,
            },
            experience:{
                type: String,
                required: true,
            },
        }
    ],
    password:{
        type: String,
        required: true,
    },
    projects:[
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Project',
            },
        }
    ]
},{
   timestamps:{
       createdAt: 'createdAt',
       updatedAt: 'updatedAt',
   } 
});

module.exports=mongoose.model('User',userTemplate);