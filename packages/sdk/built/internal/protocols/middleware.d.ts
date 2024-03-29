/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ExportedPromise, Message } from '../../internal';
/**
 * @hidden
 * Interface describing Protocol middleware.
 * NOTE: This could be made more complex if needed, with leading edge/trailing edge support by passing a `next`
 * function (restify style)
 */
export interface Middleware {
    /** @optional */
    beforeSend?(message: Message, promise?: ExportedPromise): Message;
    /** @optional */
    beforeRecv?(message: Message): Message;
}
//# sourceMappingURL=middleware.d.ts.map