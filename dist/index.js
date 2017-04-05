'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KinesisBridgeEnvelopeParser = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _bufferUtils = require('./buffer-utils');

var _envelopeStructure = require('./envelope-structure');

var _nodeUuid = require('node-uuid');

var uuid = _interopRequireWildcard(_nodeUuid);

var _kinesisBridgeEnvelope = require('./kinesis-bridge-envelope');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// <reference path="../typings/index.d.ts"/>
var KinesisBridgeEnvelopeParser = exports.KinesisBridgeEnvelopeParser = function () {
    function KinesisBridgeEnvelopeParser() {
        (0, _classCallCheck3.default)(this, KinesisBridgeEnvelopeParser);
    }

    (0, _createClass3.default)(KinesisBridgeEnvelopeParser, [{
        key: 'parseData',

        /**
         * Parses a base64 encoded Kinesis Bridge envelope string payload
         * @param base64Data
         * @returns {*}
         */
        value: function parseData(base64Data) {
            var reader = new _bufferUtils.BufferReader(new Buffer(base64Data, 'base64'));
            // Empty object with public properties
            var envelope = new _kinesisBridgeEnvelope.KinesisBridgeEnvelope();
            envelope.headerVersion = reader.readIntLE(_envelopeStructure.FIREHOSE_ENVELOPE.HEADER_VERSION);
            envelope.timeUUID = uuid.unparse(reader.readBuffer(_envelopeStructure.FIREHOSE_ENVELOPE.TIME_UUID));
            envelope.sourceNameLength = reader.readMultibyteNumLE(_envelopeStructure.FIREHOSE_ENVELOPE.SOURCE_NAME_LENGTH);
            envelope.sourceName = reader.readString(envelope.sourceNameLength);
            envelope.sourcePropertiesLength = reader.readMultibyteNumLE(_envelopeStructure.FIREHOSE_ENVELOPE.SOURCE_PROPERTIES_LENGTH);
            var serializedSourceProperties = reader.readString(envelope.sourcePropertiesLength);
            if (serializedSourceProperties.length > 0) {
                envelope.sourceProperties = JSON.parse(serializedSourceProperties);
            } else {
                envelope.sourceProperties = {};
            }
            envelope.targetNameLength = reader.readMultibyteNumLE(_envelopeStructure.FIREHOSE_ENVELOPE.TARGET_NAME_LENGTH);
            envelope.targetName = reader.readString(envelope.targetNameLength);
            envelope.targetPropertiesLength = reader.readMultibyteNumLE(_envelopeStructure.FIREHOSE_ENVELOPE.TARGET_PROPERTIES_LENGTH);
            envelope.targetProperties = JSON.parse(reader.readString(envelope.targetPropertiesLength));
            envelope.contentLength = reader.readMultibyteNumLE(_envelopeStructure.FIREHOSE_ENVELOPE.CONTENT_LENGTH);
            envelope.contentBody = reader.readBuffer(envelope.contentLength);
            return envelope;
        }
    }, {
        key: 'encodeData',
        value: function encodeData(envelope) {
            var data = {
                sourceName: envelope.sourceName,
                sourceProperties: (0, _stringify2.default)(envelope.sourceProperties),
                targetName: envelope.targetName,
                targetProperties: (0, _stringify2.default)(envelope.targetProperties),
                contentBody: envelope.contentBody
            };
            // Loops through object and returns int of all values summed
            var lengthSize = (0, _keys2.default)(_envelopeStructure.FIREHOSE_ENVELOPE).reduce(function (acc, current) {
                return acc + _envelopeStructure.FIREHOSE_ENVELOPE[current];
            }, 0);
            // Loops through object and returns int of all value string lengths summed
            var dataValuesSize = (0, _keys2.default)(data).reduce(function (acc, current) {
                return acc + (data[current] === '{}' ? 0 : data[current].length);
            }, 0);
            // Creates buffer of the correct length
            var nodeBuffer = Buffer.alloc(lengthSize + dataValuesSize);
            var buffer = new _bufferUtils.BufferWriter(nodeBuffer);
            // Wrapper function to write strings to buffer
            var writeString = function writeString(str) {
                buffer.writeMultibyteNumLE(str.length, 2);
                buffer.writeString(str, str.length);
            };
            var writeJson = function writeJson(str) {
                if (str === '{}') {
                    buffer.writeMultibyteNumLE(0, 2);
                } else {
                    buffer.writeMultibyteNumLE(str.length, 2);
                    buffer.writeString(str, str.length);
                }
            };
            buffer.writeIntLE(envelope.headerVersion, _envelopeStructure.FIREHOSE_ENVELOPE.HEADER_VERSION);
            var timeUUID = Buffer.alloc(_envelopeStructure.FIREHOSE_ENVELOPE.TIME_UUID);
            uuid.parse(envelope.timeUUID, timeUUID);
            buffer.copyFrom(timeUUID, _envelopeStructure.FIREHOSE_ENVELOPE.TIME_UUID);
            writeString(data.sourceName);
            writeJson(data.sourceProperties);
            writeString(data.targetName);
            writeJson(data.targetProperties);
            buffer.writeIntLE(envelope.contentBody.length, _envelopeStructure.FIREHOSE_ENVELOPE.CONTENT_LENGTH);
            buffer.copyFrom(envelope.contentBody, envelope.contentBody.length);
            return buffer.getBuffer().toString('base64');
        }
    }]);
    return KinesisBridgeEnvelopeParser;
}();
//# sourceMappingURL=index.js.map
