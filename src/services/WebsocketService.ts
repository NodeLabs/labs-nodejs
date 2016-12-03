import * as SocketIO from "socket.io";
import {PlayersSocket} from '../controllers/websocket/PlayersSocket';

export default class WebsocketService {
    /**
     *
     */
    private io: SocketIO.Server;

    constructor(expressApp) {

        this.io = SocketIO(expressApp);
        this.io.on('connection', this.onConnection);

    }

    /**
     *
     * @param socket
     */
    private onConnection = (socket: SocketIO.Socket) => {

        PlayersSocket.incommingConnection(this.io, socket);

    }
}