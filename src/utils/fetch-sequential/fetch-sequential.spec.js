import delay from 'delay';
import fetchSequential from './fetch-sequential';

const createListeners = () => ({
  onStepFullfillment: jest.fn(),
  onStepRejection: jest.fn(),
});

describe('given all iterables resolve', () => {
  let promise;
  let listeners;
  const iterables = [
    delay(10).then(() => Promise.resolve(1)),
    delay(5).then(() => Promise.resolve(2)),
    delay(15).then(() => Promise.resolve(3)),
  ];

  beforeEach(() => {
    listeners = createListeners();
    promise = fetchSequential(iterables, listeners);

    return promise;
  });

  it('should resolve all resolving iterables', () =>
    expect(promise).resolves.toEqual([1, 2, 3]));

  it('should resolve all iterables in sequential order', () =>
    expect(promise).resolves.toEqual([1, 2, 3]));

  it('invoke onStepFullfillment per iterable', () => {
    expect(listeners.onStepFullfillment).toHaveBeenCalledTimes(3);
  });
});

describe('given iterables reject', () => {
  let listeners;
  const rejection = delay(5).then(() => Promise.reject(new Error(2)));
  const iterables = [
    delay(10).then(() => Promise.resolve(1)),
    rejection,
    delay(15).then(() => Promise.resolve(3)),
  ];
  rejection.catch(() => {});

  describe('when it should `excludeRejections`', () => {
    let promise;

    beforeEach(() => {
      listeners = createListeners();

      promise = fetchSequential(iterables, listeners);

      return promise;
    });

    it('should resolve all resolving iterables', () =>
      expect(promise).resolves.toEqual([1, 3]));

    it('should resolve all resolving iterables in sequential order', () =>
      expect(promise).resolves.toEqual([1, 3]));

    it('invoke onStepFullfillment per resolving iterable', () => {
      expect(listeners.onStepFullfillment).toHaveBeenCalledTimes(2);
    });

    it('invoke onStepFullfillment per rejecting iterable', () => {
      expect(listeners.onStepRejection).toHaveBeenCalledTimes(1);
    });
  });

  describe('when it should not `excludeRejections`', () => {
    let promise;

    beforeEach(() => {
      promise = fetchSequential(iterables, listeners, {
        excludeRejections: false,
      });

      return promise;
    });

    it('should resolve all resolving iterables', () =>
      expect(promise).resolves.toEqual(expect.arrayContaining([1, 3])));

    it('should resolve all rejecting iterables', () =>
      expect(promise).resolves.toEqual(expect.arrayContaining([new Error(2)])));
  });
});
