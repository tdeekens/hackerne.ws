import delay from 'delay';

/**
 * This function resolves passed promises in the iterable stepwise. It is useful when the order
 * of promises resolving matters. For instance for performance or ordering reasons.
 *
 * In contrast `Promise.all` triggers all promises at the same time. They will resolve in random
 * order and the overall promise will reject given a single promise rejects.
 *
 * Moreover, this helper allows excluding rejections which is useful when single promises are
 * allowed to fail which should not affect the consumer.
 *
 * @param iterable Array a
 * @param listeners { onStepFullfillment: () =>, onStepRejection: () => } invoked when a fetching step resolves or rejects
 * @param options { excludeRejections: boolean, minimumDelay: number } configuration options
 *
 * @returns {String}
 */
export default (
  iterable,
  { onStepFullfillment, onStepRejection },
  { excludeRejections = true, minimumDelay = 10 } = {}
) =>
  iterable.reduce(
    (resolvedPromises, pendingPromise) =>
      resolvedPromises.then(previousResults =>
        Promise.all([pendingPromise, delay(minimumDelay)]).then(
          ([nextResult]) => {
            onStepFullfillment && onStepFullfillment(nextResult);
            return Promise.resolve([...previousResults, nextResult]);
          },
          nextError => {
            onStepRejection && onStepRejection(nextError);
            return excludeRejections
              ? Promise.resolve([...previousResults])
              : Promise.resolve([...previousResults, nextError]);
          }
        )
      ),
    Promise.resolve([])
  );
