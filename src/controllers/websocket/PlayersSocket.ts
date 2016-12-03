
export class PlayersSocket {
    /**
     *
     */
    static MAX_PLAYERS: number = 2;
    /***
     *
     * @type {number}
     */
    static SCORE_MAX: number = 10;
    /**
     *
     * @type {Map<string, SocketIO.Socket>}
     */
    static players: Map<string, PlayersSocket> = new Map<string, PlayersSocket>();
    /**
     *
     */
    static tick;
    /**
     *
     */
    static io: SocketIO.Server;
    /**
     *
     */
    userId: string;
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
    score: number = 0;


    constructor (
        private socket: SocketIO.Socket
    ) {

        //premier événement, ajout d'un utilisateur
        socket.on('client.player.add', this.onAddPlayer);

        //player say i'am ready
        socket.on('client.player.isready', this.onPlayerIsReady);

        //start interval
        socket.on('client.startgame', () => PlayersSocket.startGame());

        //delete square
        socket.on('client.delete.square', this.onDeleteSquare);

        //player disconnect
        socket.on('client.disconnect', this.onDisconnect);
    }

    /**
     * Ajoute une joueur à la liste des joueurs.
     * Emet l'événement 'newplayer' si le joueur vient d'être créé.
     * @param name
     */
    public onAddPlayer(name: string) {

        this.name = name;

        if (PlayersSocket.players.size === PlayersSocket.MAX_PLAYERS) {
            console.log('Trop de joueur !');
            return;
        }

        PlayersSocket.players.set(this.socket.id, this);
        PlayersSocket.io.emit('server.player.new', this);

    }

    /**
     *
     */
    public onPlayerIsReady() {

        console.log(this.name + ' is ready');
        this.isReady = true;

        PlayersSocket.updatePlayersReady();
    }

    /**
     *
     */
    public onDeleteSquare(){
        console.log('Delete Square');

        this.score += 1;

        PlayersSocket.io.emit('server.deleted.square', PlayersSocket.getPlayers(), this);

        if(this.score >= PlayersSocket.SCORE_MAX) {

            PlayersSocket.stopGame();

            this.socket.broadcast.emit('server.player.loose', this);
            this.socket.emit('server.player.win', this);
        }
    }

    /**
     *
     */
    public onDisconnect() {
        console.log('DISCONNECT');
        console.log(this.socket.id);

        if(this.socket.id) {
            PlayersSocket.players.delete(this.socket.id);

            PlayersSocket.stopGame();

            this.socket.broadcast.emit('server.stopgame', this, PlayersSocket.getPlayers());
        }
    }

    /**
     *
     * @param io
     */
    static startGame() {
        if (!PlayersSocket.tick) {
            PlayersSocket.sendSquarePosition();
            PlayersSocket.tick = setInterval(() => PlayersSocket.sendSquarePosition(), 1000);
        }
    }

    /**
     *
     */
    static updatePlayersReady() {

        this.io.emit('server.update.players.ready', this.getPlayers());

        if(this.getNbPlayersReady() === this.MAX_PLAYERS){
            this.io.emit('startcountdown');
        }

    }
    /**
     *
     */
    static sendSquarePosition = () => {
        const index = Math.floor(Math.random() * 12),
            bgc = "#" + ((1<<24) * Math.random() | 0).toString(16);

        PlayersSocket.io.emit('server.update.square', {index, bgc});
    };

    /**
     *
     * @returns {number}
     */
    static getNbPlayersReady() {
        let counter = 0;

        PlayersSocket
            .players
            .forEach(player => {
                if (player.isReady){
                    counter++;
                }
            });


        return counter;
    }

    /**
     * Retourne la liste des joueurs.
     * @returns {Array}
     */
    static getPlayers(): PlayersSocket[] {

        const players = [];

        this.players.forEach(e => players.push(e));

        return players;

    }

    /**
     *
     */
    static stopGame(){
        clearInterval(PlayersSocket.tick);
        delete PlayersSocket.tick;
    }

    /**
     *
     * @param io
     * @param socket
     */
    static incommingConnection(io, socket){
        PlayersSocket.io = io;
        new PlayersSocket(socket);
    }

    /**
     *
     */
    public toJSON = () => ({
        userId: this.socket.id,
        name: this.name,
        score: this.score,
        isReady: this.isReady
    });
}
