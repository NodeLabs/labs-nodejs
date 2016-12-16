import PlayerSG from './PlayerSG';
const settings = require('./../../../resources/square-game.json');

export default class SquareGameWS {
    /**
     *
     */
    static MAX_PLAYERS: number = settings.MAX_PLAYERS;
    /***
     *
     * @type {number}
     */
    static SCORE_MAX: number = settings.SCORE_MAX;
    /**
     *
     * @type {Map<string, SocketIO.Socket>}
     */
    static players: Map<string, PlayerSG> = new Map<string, PlayerSG>();
    /**
     *
     */
    static tick;

    private player;

    constructor (
        private io: SocketIO.Server,
        private socket: SocketIO.Socket
    ) {

        console.log('New connection, ID =>', socket.id);

        //premier événement, ajout d'un utilisateur
        socket.on('client.player.add', this.onAddPlayer);

        //player say i'am ready
        socket.on('client.player.ready', this.onPlayerIsReady);

        //start interval
        socket.on('client.start.game', this.onStartGame);

        //delete square
        socket.on('client.delete.square', this.onDeleteSquare);

        //player disconnect
        socket.on('disconnect', this.onDisconnect);
    }

    /**
     * Ajoute une joueur à la liste des joueurs.
     * Emet l'événement 'newplayer' si le joueur vient d'être créé.
     * @param name
     */
    public onAddPlayer = (name: string): void => {};

    /**
     *
     * @param io
     */
    public onStartGame = (): void => {};

    /**
     *
     */
    public onPlayerIsReady = (): void => {};

    /**
     *
     */
    public onDeleteSquare = (): void => {};

    /**
     *
     */
    public onDisconnect = (): void => {};

    /**
     *
     */
    public updatePlayersReady(): void {}
    /**
     *
     */
    public sendSquarePosition = (): void => {};

    /**
     *
     * @returns {number}
     */
    static getNbPlayersReady(): number {

        return 0;
    }

    /**
     * Retourne la liste des joueurs.
     * @returns {Array}
     */
    static getPlayers(): PlayerSG[] {

        return null;
    }

    static stopGame(): void {}
}