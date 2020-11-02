/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { MenuItem } from '../menu';
import { FactoryMap } from '../tests';
/**
 * The page tree is optimized for:
 * 1. Minimizing the number of clicks to run the hardest-to-reach test
 * 2. Minimizing the number of pages
 * 3. Spreading tests evenly across pages
 *
 * The general pagination algorithm is as follows:
 * 1. Determine the minimum depth of the balanced decision tree (n).
 * 2. Compute the max capacity of a full tree at said depth.
 * 3. Redistribute overflow (tests minus capacity) so that no bucket contains more than b^(n+1) tests
 */
export declare function paginate(tests: FactoryMap, pageSize: number, names?: string[]): MenuItem[];
