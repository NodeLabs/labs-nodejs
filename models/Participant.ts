import * as Mongoose from "mongoose";

export interface IParticipant extends Mongoose.Document {
    name: string;
}

export const Schema: Mongoose.Schema = new Mongoose.Schema({
    name: {
        type: String,
        default: ''
    }
});

export const Model: Mongoose.Model<IParticipant> = Mongoose.model<IParticipant>('Participant', Schema);


/*

    Exemple de modèle un peu plus complexe

 {
    _skillCenter: {type: mongoose.Schema.Types.ObjectId, ref : 'SkillCenter'},
    login: {type: String, required: true, unique: true, index: true},
    password: {type: String},

    name:   {type:String},
    firstName:{type:String},
    mail: {type: String, lowercase: true, match: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/},
    role: {type:String, match:/^admin$|^rh$|^do$|^user$/, default:'user'},
    preferences: Object
 }


 */