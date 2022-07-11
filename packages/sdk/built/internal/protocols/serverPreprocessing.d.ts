/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ExportedPromise, Message, Protocols } from '../../internal';
/**
 * @hidden
 */
export declare class ServerPreprocessing implements Protocols.Middleware {
    constructor();
    /** @private */
    beforeSend: (message: Message, promise?: ExportedPromise) => Message;
}
//# sourceMappingURL=serverPreprocessing.d.ts.map