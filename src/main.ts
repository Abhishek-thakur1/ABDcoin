import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as _ from 'lodash';
import {
    Block,
    generateNextBlock,
    // generatenextBlockWithTransaction,
    // generateRawNextBlock,
    // getAccountBalance,
    getBlockchain,
    // getMyUnspentTransactionOutputs,
    // getUnspentTxOuts,
    // sendTransaction
} from './blockchain';
import logger from './Logger';

const httpPort: number = parseInt(process.env.HTTP_PORT) || 3232;

const initHttpServer = (myHttpPort: number) => {
    const app = express();
    app.use(bodyParser.json());

    app.use((err, req, res, next) => {
        if (err) res.status(400).send(err.message);
    });
    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });
    app.post('/mintBlock', (req, res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    app.get('/peers', (req, res) => {
        res.send(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
