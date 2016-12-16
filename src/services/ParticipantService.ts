
const COURSES = require('../../resources/courses.json');


export default class ParticipantService {

    private coursesMap: Map<string, ICourse> = new Map<string, ICourse>();
    private participants: IParticipant[] = [];

    constructor() {

        COURSES.each((course: ICourse) =>
             this.coursesMap.set(course.value, course)
        );
    }

    /**
     * 
     * @param id
     * @returns {Promise<Object>}
     */
    public get(id: string): Promise<IParticipant> {

        return Promise.resolve(this.participants[id]);
        
    }

    /**
     *
     * @param query
     * @returns {Promise<IParticipant[]>}
     */
    public find(query?: Object): Promise<IParticipant[]>  {

        return Promise.resolve(this.populateCourse(this.participants));

    }

    /**
     *
     * @param participants
     * @returns {(IParticipant&{course: ICourse})|any[]}
     */
    private populateCourse(participants: IParticipant[]) {

        return participants.map((participant) =>

            Object.assign(participant, {
                course:  this.coursesMap.get(<string> participant.course || 'angular1')
            })

        );
    }

    /**
     *
     * @param id
     * @param participant
     * @returns {Promise<T>|Promise}
     */
    public update(id: string, participant: IParticipant): Promise<IParticipant> {

        this.participants[id] = participant;

        return Promise.resolve(participant);

    }

    /**
     *
     * @param participant
     * @returns {any}
     */
    public create(participant: IParticipant): Promise<IParticipant> {

        participant._id = ""+this.participants.length;

        this.participants.push(participant);

        return Promise.resolve(participant);
    }




}