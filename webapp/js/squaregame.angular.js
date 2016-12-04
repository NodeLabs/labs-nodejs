(function() {

    const WS_EVENTS = [
        'player.new', 'update.players.ready',
        'player.win', 'player.loose',
        'update.square', 'deleted.square',
        'start.countdown', 'stop.game'
    ];

    const ANIMATIONS = [
        'bounce',
        'flash',
        'pulse',
        'rubberBand',
        'shake',
        'swing',
        'tada',
        'wobble',
        'jello'
    ];

    const random = (min, max) =>  Math.floor(Math.random() * (max - min + 1)) + min;

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

    /**
     *
     */
    class SquareGameCtrl {

        constructor($scope, $element, $timeout, squareGameService) {
            this.showForm = true;
            this.countdown = 3;
            this.showCountdown = false;
            this.players = [];
            this.squares = new Array(16);
            this.player =  {};
            this.squareGameService = squareGameService;
            this.$timeout = $timeout;
            this.$element = $element;
            this.currentSquare = {};

            $scope.$on('player.new', this.onUpdatePlayers.bind(this));
            $scope.$on('update.players.ready', this.onUpdatePlayers.bind(this));
            $scope.$on('update.square', this.onUpdateSquare.bind(this));
            $scope.$on('deleted.square', this.onDeletedSquare.bind(this));
            $scope.$on('player.win', this.onPlayerWin.bind(this));
            $scope.$on('player.loose', this.onPlayerLoose.bind(this));
            $scope.$on('start.countdown', this.onStartCountdown.bind(this));
            $scope.$on('stop.game', this.onStopGame.bind(this));
        }

        /**
         *
         */
        $onInit() {

        }

        /**
         *
         */
        $postLink() {
            this.widthViewport = this.$element.find('.square-game-area').width() + "px";
        }

        /**
         *
         * @param $event
         * @param players
         */
        onUpdatePlayers($event, players) {

            console.log('Players', players);
            this.players = players;
        }

        /**
         *
         * @param $event
         * @param square
         */
        onUpdateSquare($event, square) {
            this.currentSquare = square;
        }

        /**
         *
         * @param $event
         * @param users
         * @param user
         */
        onDeletedSquare($event, users, user){
            this.currentSquare = {};
            this.players = users;
            this.info = `${user.name} marque 1 point`;
        }
        /**
         *
         */
        onStartCountdown($event){

            console.log('Start countdown');

            this.showCountdown = true;
            this.countdown = 3;
            this.ready = true;

            this.tick();
        }

        /**
         *
         * @param $event
         * @param player
         * @param players
         */
        onStopGame($event, player, players) {
            this.ready = false;
            this.info = `${player.name} s'est déconnecté`;
            this.players = players;
            this.currentSquare = {};

        }

        /**
         *
         * @param $event
         */
        onPlayerWin($event, user){
            this.win = true;
        }

        /**
         *
         * @param $event
         */
        onPlayerLoose($event, user){
            this.loose = true;
            this.playerWinner = user;
        }

        /**
         *
         */
        tick(){
            console.log('Tick countdown');
            this.tickValue = this.$timeout(() => {

                if(!this.ready){
                    this.stopTick();
                    return;
                }

                if(this.countdown > 0){
                    this.countdown--;
                    this.tick();
                }else{
                    this.showCountdown = false;
                    this.squareGameService.startGame();
                }
            }, 1000);
        }

        /**
         *
         */
        stopTick(){
            this.$timeout.cancel(this.tickValue);
            this.countdown = 10;
            this.showCountdown = false;
        }

        /**
         *
         */
        submit(){
            this.squareGameService.addPlayer(this.player);
            this.showForm = false;
        }

        /**
         *
         * @param index
         */
        onClickSquare(index){
            if(this.currentSquare.index == index){
                this.squareGameService.squareClicked();
            }
        }

        /**
         *
         */
        onClickReady(){
            this.player.isReady = true;
            this.squareGameService.ready();
        }

        playersNotReady(){
            if(this.players.length < this.nbPlayers){
                return true;
            }

            return !!this.players.find((p) => !p.isReady);
        }
    }

    angular
        .module('squareGame', [])
        .service('SquareGameService', function($rootScope) {return new SquareGameService($rootScope)})
        .controller('SquareGameCtrl', ($scope, $element, $timeout, SquareGameService) =>
            new SquareGameCtrl($scope, $element, $timeout, SquareGameService)
        )
        .component('squareGame', {

            templateUrl: '/partials/square-game.html',

            bindings: {
                nbPlayers:'@',
                maxScore: '@'
            },

            controller: 'SquareGameCtrl'
        })
        .component('square', {
            bindings: {
                index: "<",
                currentSquare: "<"
            },

            controller: function($element) {

                let lastClass;

                this.$onChanges = () => {

                    $element.css('background-color', 'transparent');

                    if (this.currentSquare && this.index === this.currentSquare.index){
                        $element.removeClass(lastClass);

                        const rand = random(0, ANIMATIONS.length-1);

                        setTimeout(() => {
                            lastClass = ANIMATIONS[rand];
                            $element.addClass(ANIMATIONS[rand]);
                            $element.css('background-color', this.currentSquare.bgc);
                        });

                    }
                }
            }
        });

})();


