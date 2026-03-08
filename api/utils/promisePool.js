async function promisePool(items, worker, concurrency = 5) {

  const executing = [];

  for (const item of items) {

    const p = Promise.resolve().then(() => worker(item));

    executing.push(p);

    if (executing.length >= concurrency) {

      await Promise.race(executing);

      executing.splice(
        executing.findIndex(e => e === p),
        1
      );

    }

  }

  return Promise.all(executing);

}

module.exports = promisePool;