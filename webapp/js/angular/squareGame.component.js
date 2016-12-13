/**
 *
 */
class SquareGameComponent {

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
    .module('squareGame')
    .component('squareGame', {

        templateUrl: '/partials/square-game.html',

        bindings: {
            nbPlayers:'@',
            maxScore: '@'
        },

        controller: ($scope, $element, $timeout, SquareGameService) =>
            new SquareGameComponent($scope, $element, $timeout, SquareGameService)

    });

