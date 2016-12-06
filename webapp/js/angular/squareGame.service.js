
const WS_EVENTS = [
    'player.new', 'update.players.ready',
    'player.win', 'player.loose',
    'update.square', 'deleted.square',
    'start.countdown', 'stop.game'
];

class SquareGameService {

    constructor($rootScope) {

        console.log('WS try connection');

        this.socket = io.connect(document.location.host);

        this.socket.on('connect', () => {
            console.log('WS connected, id =>', this.socket.io.engine.id);
            this.socketId = this.socket.io.engine.id;
        });

        WS_EVENTS.forEach((eventName) => {
            console.log('Event binded =>', `server.${eventName}`);
            this.socket.on(`server.${eventName}`, (...args) => {
                console.log('Event=>', eventName, ...args);
                $rootScope.$apply(() => $rootScope.$broadcast(eventName, ...args));
            });
        });
    }

    /**
     *
     * @returns {*}
     */
    getSocketId(){
        return this.socketId;
    }

    /**
     *
     * @param player
     */
    addPlayer(player) {
        console.log('AddPlayer', player);
        this.socket.emit('client.player.add', player.name);
    }

    /**
     *
     */
    ready(){
        this.socket.emit('client.player.ready');
    }

    /**
     *
     */
    startGame() {
        this.socket.emit('client.start.game');
    }

    /**
     *
     */
    squareClicked() {
        this.socket.emit('client.delete.square')
    }
}

angular
    .module('squareGame')
    .service('SquareGameService', function($rootScope) {return new SquareGameService($rootScope)})