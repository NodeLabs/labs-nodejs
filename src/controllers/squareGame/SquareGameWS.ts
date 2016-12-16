
import PlayerSG from './PlayerSG';
import {$log} from 'ts-log-debug';
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

        $log.debug('New connection, ID =>', socket.id);
        this.player = new PlayerSG(socket.id);

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
    public onAddPlayer = (name: string) => {

        $log.debug('New player =>', name);

        this.player.name = name;

        if (SquareGameWS.players.size === SquareGameWS.MAX_PLAYERS) {
            $log.debug('stack overflow :p');
            return;
        }

        SquareGameWS.players.set(this.socket.id, this.player);
        this.io.emit('server.player.new', SquareGameWS.getPlayers());

    };

    /**
     *
     * @param io
     */
    public onStartGame = () => {
        if (!SquareGameWS.tick) {

            $log.debug('Start game');

            this.sendSquarePosition();
            SquareGameWS.tick = setInterval(this.sendSquarePosition, 1000);
        }
    };

    /**
     *
     */
    public onPlayerIsReady = () => {

        $log.debug(this.player.name + ' is ready');

        this.player.isReady = true;

        this.updatePlayersReady();
    };

    /**
     *
     */
    public onDeleteSquare = () => {
        $log.debug('Client delete square =>', this.player.name);
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

        $log.debug('Player disconnected =>', this.player.name, this.socket.id);

        SquareGameWS.players.delete(this.socket.id);
        SquareGameWS.stopGame();

        this.io.emit('server.stop.game', this.player, SquareGameWS.getPlayers());

    };

    /**
     *
     */
    public updatePlayersReady() {
        $log.debug('Waiting players', SquareGameWS.getNbPlayersReady(), '===', SquareGameWS.MAX_PLAYERS);
        this.io.emit('server.update.players.ready', SquareGameWS.getPlayers());

        if (+SquareGameWS.getNbPlayersReady() === +SquareGameWS.MAX_PLAYERS) {
            $log.debug('All players are ready');
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
    static getPlayers(): PlayerSG[] {

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
