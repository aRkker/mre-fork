import { Test } from '../test';
export default class LibraryFailTest extends Test {
    expectedResultDescription: string;
    run(): Promise<boolean>;
}
