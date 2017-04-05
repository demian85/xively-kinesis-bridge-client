export declare class KinesisBridgeEnvelope {
    headerVersion: number;
    timeUUID: string;
    sourceNameLength: number;
    sourceName: string;
    sourcePropertiesLength: number;
    sourceProperties: any;
    targetNameLength: number;
    targetName: string;
    targetPropertiesLength: number;
    targetProperties: any;
    contentLength: number;
    contentBody: Buffer;
}
