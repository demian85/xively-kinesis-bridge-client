/**
 * Read buffer with auto incremented offset
 * @param buffer
 * @constructor
 */
export declare class BufferReader {
    private buffer;
    private offset;
    constructor(buffer: Buffer);
    /**
     * Read int in Big-endian order from internal buffer
     * @param size
     * @returns {*}
     */
    readIntLE(size: number): number;
    readMultibyteNumLE(size: number): number;
    /**
     * Read size of data to a buffer from internal buffer
     * @param size
     * @returns {*}
     */
    readBuffer(size: number): Buffer;
    /**
     * Read size of string from buffer
     * @param size
     * @returns {*|string}
     */
    readString(size: number): string;
}
/**
 * Write buffer with auto incremented offset
 * @param buffer
 * @constructor
 */
export declare class BufferWriter {
    private buffer;
    private offset;
    constructor(buffer: Buffer);
    /**
     * Write  int to buffer in Big-endian order
     * @param data
     * @param size
     */
    writeIntLE(data: number, size: number): void;
    writeMultibyteNumLE(data: number, size: number): void;
    /**
     * Write string in utf8 format to the buffer
     * @param data
     * @param size
     */
    writeString(data: string, size: number): void;
    /**
     * Copy size of data from srcBuffer to the internal buffer
     * @param srcBuffer
     * @param size
     */
    copyFrom(srcBuffer: Buffer, size: number): void;
    /**
     * Get back internal buffer
     * @returns {*}
     */
    getBuffer(): Buffer;
}
