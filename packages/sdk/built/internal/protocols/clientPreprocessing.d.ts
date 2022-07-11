/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Message, Protocols } from '../../internal';
/**
 * @hidden
 */
export declare class ClientPreprocessing implements Protocols.Middleware {
    private protocol;
    constructor(protocol: Protocols.Protocol);
    /** @private */
    beforeRecv: (message: Message) => Message;
}
//# sourceMappingURL=clientPreprocessing.d.ts.map