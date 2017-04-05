/// <reference path="../typings/index.d.ts" />
import { KinesisBridgeEnvelope } from './kinesis-bridge-envelope';
export declare class KinesisBridgeEnvelopeParser {
    /**
     * Parses a base64 encoded Kinesis Bridge envelope string payload
     * @param base64Data
     * @returns {*}
     */
    parseData(base64Data: string): KinesisBridgeEnvelope;
    encodeData(envelope: KinesisBridgeEnvelope): string;
}
