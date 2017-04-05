'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BufferWriter = exports.BufferReader = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bufferProto = Buffer.prototype;
/* tslint:disable:no-invalid-this */
function writeIntLE(data, offset, size) {
    if (size === 1) {
        return this.writeInt8(data, offset);
    }
    if (size === 2) {
        return this.writeInt16LE(data, offset);
    }
    throw new Error('Size not supported in this polyfill. Buffer.writeIntLE:' + size);
}
function readIntLE(offset, size) {
    if (size === 1) {
        return this.readInt8(offset);
    }
    if (size === 2) {
        return this.readInt16LE(offset);
    }
    throw new Error('Size not supported in this polyfill, Buffer.readIntLE:' + size);
}
/* tslint:enable:no-invalid-this */
bufferProto.writeIntLE = bufferProto.writeIntLE || writeIntLE;
bufferProto.readIntLE = bufferProto.readIntLE || readIntLE;
/**
 * Read buffer with auto incremented offset
 * @param buffer
 * @constructor
 */

var BufferReader = exports.BufferReader = function () {
    function BufferReader(buffer) {
        (0, _classCallCheck3.default)(this, BufferReader);

        this.offset = 0;
        this.buffer = buffer;
    }
    /**
     * Read int in Big-endian order from internal buffer
     * @param size
     * @returns {*}
     */


    (0, _createClass3.default)(BufferReader, [{
        key: 'readIntLE',
        value: function readIntLE(size) {
            var data = this.buffer.readIntLE(this.offset, size);
            this.offset += size;
            return data;
        }
    }, {
        key: 'readMultibyteNumLE',
        value: function readMultibyteNumLE(size) {
            var num = void 0;
            switch (size) {
                case 2:
                    num = this.buffer.readUInt16LE(this.offset);
                    break;
                case 4:
                    num = this.buffer.readUInt32LE(this.offset);
                    break;
                default:
                    throw new Error(size + ' is not supported as multibyte number');
            }
            this.offset += size;
            return num;
        }
    }, {
        key: 'readBuffer',

        /**
         * Read size of data to a buffer from internal buffer
         * @param size
         * @returns {*}
         */
        value: function readBuffer(size) {
            var data = this.buffer.slice(this.offset, this.offset + size);
            this.offset += size;
            return data;
        }
    }, {
        key: 'readString',

        /**
         * Read size of string from buffer
         * @param size
         * @returns {*|string}
         */
        value: function readString(size) {
            return this.readBuffer(size).toString('utf8');
        }
    }]);
    return BufferReader;
}();
/**
 * Write buffer with auto incremented offset
 * @param buffer
 * @constructor
 */


var BufferWriter = exports.BufferWriter = function () {
    function BufferWriter(buffer) {
        (0, _classCallCheck3.default)(this, BufferWriter);

        this.offset = 0;
        this.buffer = buffer;
    }

    (0, _createClass3.default)(BufferWriter, [{
        key: 'writeIntLE',

        /**
         * Write  int to buffer in Big-endian order
         * @param data
         * @param size
         */
        value: function writeIntLE(data, size) {
            this.buffer.writeIntLE(data, this.offset, size);
            this.offset += size;
        }
    }, {
        key: 'writeMultibyteNumLE',
        value: function writeMultibyteNumLE(data, size) {
            switch (size) {
                case 2:
                    this.buffer.writeUInt16LE(data, this.offset);
                    break;
                case 4:
                    this.buffer.writeUInt32LE(data, this.offset);
                    break;
                default:
                    throw new Error(size + ' is not supported as multibyte number');
            }
            this.offset += size;
        }
    }, {
        key: 'writeString',

        /**
         * Write string in utf8 format to the buffer
         * @param data
         * @param size
         */
        value: function writeString(data, size) {
            this.buffer.write(data, this.offset, size, 'utf8');
            this.offset += size;
        }
    }, {
        key: 'copyFrom',

        /**
         * Copy size of data from srcBuffer to the internal buffer
         * @param srcBuffer
         * @param size
         */
        value: function copyFrom(srcBuffer, size) {
            srcBuffer.copy(this.buffer, this.offset);
            this.offset += size;
        }
    }, {
        key: 'getBuffer',

        /**
         * Get back internal buffer
         * @returns {*}
         */
        value: function getBuffer() {
            return this.buffer;
        }
    }]);
    return BufferWriter;
}();
//# sourceMappingURL=buffer-utils.js.map
