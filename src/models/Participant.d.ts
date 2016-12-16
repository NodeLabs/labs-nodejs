declare interface IParticipant {
    _id: string;
    firstName: string;
    lastName: string;
    course: string | ICourse;
    email: string;
}