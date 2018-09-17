const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    sdt: { type: String },
    hashpass: { type: String, required: true },
    gymJoin: {type: Schema.Types.ObjectId, ref: "Gym" }
    ,
    chosenPT: { type: Schema.Types.ObjectId, refPath: "gymJoin.PT" }
        
}, {
        timestamps: true
    });

// UserSchema.pre("save", function (next) {
//     if (this.isModified('password')) {
//         return next();
//     }

//     bcrypt
//         .genSalt(12)
//         .then(salt => bcrypt.hash(this.password, salt))
//         .then(hash => {
//             this.password = hash;
//             next()
//         })
//         .catch(err => next(err));
// })

module.exports = mongoose.model("User", UserSchema);