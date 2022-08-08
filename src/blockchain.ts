import * as CryptoJS from 'crypto-js';
import logger from './logger'

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timeStamp: number;
    public data: string;

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        timeStamp: number,
        data: string
    ) { 
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timeStamp = timeStamp;
        this.data = data;
    }
}



// Genesis block
const genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'this is the first block of the chain!'
)

let blockchain: Block[] = [genesisBlock];

const getLatestBlock = (): Block => blockchain[blockchain.length - 1]

// calculating hash
const calculateHash = (index: number, previousHash: string, timeStamp: number, data: string): string => CryptoJS.SHA256(index + previousHash + timeStamp+ data).toString();


// generate next  block
const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimeStamp: number = new Date().getTime();
    const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimeStamp, blockData);
    return newBlock;
}


// validating the structure of the block
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timeStamp === 'number'
        && typeof block.data === 'string';
};



// Validating the integrity of blocks
const isValidNewBlock = (newBlock: Block, previousBlock: Block) => { 
    if (previousBlock.index + 1 !== newBlock.index) {
        logger.info('Invalid index')
        return false;
    } else if (previousBlock.hash !== newBlock.hash) {
        logger.info('Invalid previousHash')
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        logger.info(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock))
        logger.info('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash)
        return false;
    }
    return true;
} 


// checks if the given blockchain is valid
const isChainValid = (blockchain_to_validate: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock)
    }
    if (!isValidGenesis(blockchain_to_validate[0])) return false;

    // validate each block
    for (let i = 0; i < blockchain_to_validate.length; i++) {
        if (!isValidNewBlock(blockchain_to_validate[i], blockchain_to_validate[i - 1])) return false;
    }
    return true;
}