import * as Mongoose from "mongoose";

interface IBaseParticipant {
    firstName: string;
    lastName: string;
    course: string | ICourse;
    email: string;
}

export interface IParticipant extends IBaseParticipant {
    _id: string;
}

export interface IDocParticipant extends IBaseParticipant, Mongoose.Document {}

export const Schema: Mongoose.Schema = new Mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
    },
    course: {
        type: String,
        required: true
    }
});

export const Model: Mongoose.Model<IDocParticipant> = Mongoose.model<IDocParticipant>('Participant', Schema);