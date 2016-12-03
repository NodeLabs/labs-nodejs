


import PlayerSG from './PlayerSG';
export class SquareGameWS {
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

        this.player = new PlayerSG(socket.id);

        //premier événement, ajout d'un utilisateur
        socket.on('client.player.add', this.onAddPlayer);

        //player say i'am ready
        socket.on('client.player.isready', this.onPlayerIsReady);

        //start interval
        socket.on('client.startgame', this.onStartGame);

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
    public onAddPlayer = (name: string) => {

        this.player.name = name;

        if (SquareGameWS.players.size === SquareGameWS.MAX_PLAYERS) {
            console.log('Trop de joueur !');
            return;
        }

        SquareGameWS.players.set(this.socket.id, this.player);
        this.io.emit('server.player.new', this.player);

    };

    /**
     *
     * @param io
     */
    public onStartGame = () => {
        if (!SquareGameWS.tick) {
            this.sendSquarePosition();
            SquareGameWS.tick = setInterval(this.sendSquarePosition, 1000);
        }
    };

    /**
     *
     */
    public onPlayerIsReady = () => {

        console.log(this.player.name + ' is ready');
        this.player.isReady = true;

        this.updatePlayersReady();
    };

    /**
     *
     */
    public onDeleteSquare = () => {
        console.log('Delete Square');

        this.player.scoreUp();

        this.io.emit('server.deleted.square', SquareGameWS.getPlayers(), this.player);

        if(this.player.getScore() >= SquareGameWS.SCORE_MAX) {

            SquareGameWS.stopGame();

            this.socket.broadcast.emit('server.player.loose', this.player);
            this.socket.emit('server.player.win', this.player);
        }
    };

    /**
     *
     */
    public onDisconnect = () => {
        console.log('DISCONNECT');
        console.log(this.socket.id);

        if(this.socket.id) {
            SquareGameWS.players.delete(this.socket.id);
            SquareGameWS.stopGame();

            this.socket.broadcast.emit('server.stopgame', this, SquareGameWS.getPlayers());
        }
    };

    /**
     *
     */
    public updatePlayersReady() {

        this.io.emit('server.update.players.ready', SquareGameWS.getPlayers());

        if (SquareGameWS.getNbPlayersReady() === SquareGameWS.MAX_PLAYERS) {
            this.io.emit('server.start.countdown');
        }

    }
    /**
     *
     */
    public sendSquarePosition = () => {
        const index = Math.floor(Math.random() * 12),
            bgc = "#" + ((1<<24) * Math.random() | 0).toString(16);

        this.io.emit('server.update.square', {index, bgc});
    };

    /**
     *
     * @returns {number}
     */
    static getNbPlayersReady() {
        let counter = 0;

        SquareGameWS
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
    static getPlayers(): SquareGameWS[] {

        const players = [];

        this.players.forEach(e => players.push(e));

        return players;

    }

    /**
     *
     */
    static stopGame(){
        clearInterval(SquareGameWS.tick);
        delete SquareGameWS.tick;
    }

}
