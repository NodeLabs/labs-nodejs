export default class PlayerSG {

    /**
     *
     */
    name: string;
    /**
     *
     */
    isReady: boolean;
    /**
     *
     */
    private score: number = 0;

    constructor(private userId: string) {

    }

    /**
     *
     */
    public scoreUp(){
        this.score++;
    }

    /**
     *
     * @returns {number}
     */
    public getScore(){
        return this.score;
    }

    /**
     *
     */
    public toJSON = () => ({
        userId: this.userId,
        name: this.name,
        score: this.score,
        isReady: this.isReady
    });
}