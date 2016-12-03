import * as SocketIO from "socket.io";
import {SquareGameWS} from '../controllers/websocket/SquareGameWS';

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

        // add your different socket controller here
        new SquareGameWS(this.io, socket);

    }
}