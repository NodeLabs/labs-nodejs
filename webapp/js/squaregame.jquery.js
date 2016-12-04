/**
 * SQUARE GAME
 * need jQuery
 */
(function($){
    /**
     * Constructor
     *
     * @param e
     * @param o
     */
    $.$squaregame = function(e) {

        var self = this;
        var socket = this.socket = io.connect(document.location.host);
        this.target = $(e);

        this.target.find(".form-addplayer").on('submit', function (e) {
            return self.onSubmitForm(e);
        });

        //player connect
        socket.on('connect', function () {
            self.socketid = socket.io.engine.id;
        });

        //socket events
        socket.on('server.player.new', function (data) {
            self.target.find('.game-info').html('');
            self.target.find('.game-area > div').removeClass('square').removeAttr('style');
            self.renderPlayerArea(data);
        });

        socket.on('server.update.players.ready', function (data) {
            self.target.find('.game-info').html('');
            self.target.find('.game-area > div').removeClass('square').removeAttr('style');
            self.renderPlayerArea(data);
        });

        socket.on('server.player.win', function (data) {
            self.playerWinGame(data);
        });

        socket.on('server.player.loose', function (data) {
            self.playerLooseGame(data);
        });

        socket.on('server.start.countdown', function (data) {
            self.startCountDown(data);
        });

        socket.on('server.update.square', function (data) {
            self.placeSquare(data);
        });

        socket.on('server.deleted.square', function (data, user) {
            self.deletedSquare(data, user);
        });

        socket.on('server.stopgame', function (data, users) {
            self.stopGame(data, users);
        });

    };

    $.$squaregame.load = function(className){
        $(document).ready(function(){
            $(className).squaregame();
        });
    };

    // Create shortcut for internal use
    var $squaregame = $.$squaregame;

    $squaregame.fn = $squaregame.prototype = {};
    $squaregame.fn.extend = $squaregame.extend = $.extend;

    $squaregame.fn.extend({
        /**
         * Lance le jeu
         */
        startGame: function(){
            var self = this;

            this.target.find('.game-info').html('');

            this.target.on('click', '.square', function(e){
                return self.onSquareClick(e);
            });
        },
        /**
         * Créée une nouvelle carte info d'un joueur connecté
         * @param user
         * @returns {*|HTMLElement}
         */
        createPlayerCard: function(user){

            var self = this;

            var node = $('<div></div>');
            node.addClass('player playerready-'+user.isReady);
            node.append($('<h2>' + user.name + ' <span>' + (user.isReady ? '' : 'En attente')  +'</span></h2>'));
            node.append($('<p>' + user.score + '<small>pt(s)</small></p>'));

            if(!user.isReady && user.userId === this.socketid ) {

                var button = $('<a class="bt-ready" href="#">Êtes-vous prêt ?</a>');

                button.click(function(e){
                    return self.onUserReady(e);
                });

                node.append(button);
            }

            return node;
        },
        /**
         * Affiche la liste des joueurs.
         * @param data
         */
        renderPlayerArea: function(data){

            var self = this;
            var container = $(this.target.find('.player-area')[0]);

            container.html('');

            for(var key in data) {
                container.append(self.createPlayerCard(data[key]));
            }
        },
        /**
         * Affiche le décompte
         */
        startCountDown: function(){
            var self = this;
            var $counter = this.target.find('.count-down p');

            $counter.addClass('anim');
            self.ready = true;

            var countdown = 10;
            var int = setInterval(function(){

                if(!self.ready){
                    clearInterval(int);
                    $counter.html(10);
                    $counter.removeClass('anim');
                    return;
                }

                if(countdown>0){
                    countdown--;
                    $counter.html(countdown);
                }else{
                    self.target.find('.count-down').hide();
                    clearInterval(int);
                    self.startGame();
                    self.socket.emit('startgame');
                    $counter.remove();
                }
            }, 1000);
        },
        /**
         * Stop le jeu
         * @param user
         * @param users
         */
        stopGame:function(user, users){
            console.log("STOP");

            this.target.find('.game-info').html('');
            this.target.find('.game-area > div').removeClass('square').removeAttr('style');

            this.renderPlayerArea(users);

            this.ready = false;
            this.target.find('.game-info').html('Votre adeversaire c\'est déconnecté - ' + user["name"])
        },
        /**
         * Indique que le joueur connecté à gagner la partie
         * @param user
         */
        playerWinGame:function(user){
            this.target.find('.game-info').html(user["name"]+' vous avez gagné');
        },
        /**
         * Indique que le joueur connecté à perdu. Affiche le nom du joueur ayant gagné la partie.
         * @param user
         */
        playerLooseGame:function(user){
            this.target.find('.game-info').html('Vous avez perdu, ' +user["name"]+' a gagné');
        },
        /**
         * Affiche le carré coloré sur la grille de jeu.
         * @param data
         */
        placeSquare:function(data){

            this.target.find('.game-area > div')
                .eq(data.index).addClass('square').css({'backgroundColor' : data.bgc})
                .siblings('div').removeClass('square').removeAttr('style');
        },
        /**
         * Envoi l'info vers le serveur au clic d'un carré.
         * @param e
         */
        onSquareClick:function(e){
            e.preventDefault();

            this.socket.emit('deletesquare');
        },
        /**
         * Supprime le carré affiche sur la grille et actualise les informations.
         * @param users
         * @param user
         */
        deletedSquare:function(users, user){

            this.target.find('.game-area > div').removeClass('square').removeAttr('style');

            this.renderPlayerArea(users);

            //this.target.find('.game-info').html(user['name']);
        },
        /**
         * Ajoute un joueur.
         * @param e
         */
        onSubmitForm:function(e){
            e.preventDefault();

            this.target.find('.game-info').html('');
            this.target.find('.game-area > div').removeClass('square').removeAttr('style');

            var name = $(this.target.find('.name')[0]).val();

            this.socket.emit('addplayer', name);

            this.target.find(".page-header").hide();
        },
        /**
         * Indique que le joueur connecté est pret.
         * @param e
         */
        onUserReady:function (e){
            e.preventDefault();
            this.socket.emit('playerisready');
        }
    });

    $.fn.squaregame = function(o) {
        if (typeof o == 'string') {
            var instance = $(this).data('squaregame'), args = Array.prototype.slice.call(arguments, 1);
            return instance[o].apply(instance, args);
        } else {
            return this.each(function() {
                var instance = $(this).data('squaregame');
                if (instance) {
                    if (o) {
                        $.extend(instance.options, o);
                    }
                    //instance.reload();
                } else {
                    $(this).data('squaregame', new $squaregame(this, o));
                }
            });
        }
    };

})(jQuery);

$.$squaregame.load('.squaregame');