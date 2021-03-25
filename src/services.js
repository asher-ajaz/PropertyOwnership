import { Subject } from 'rxjs';

const subject = new Subject();

export const accountService = {
    setData: account => subject.next({ account: account }),
    clearData: () => subject.next(),
    getData: () => subject.asObservable()
};