/** @typedef {import('./types').MediaQueryInfo} MediaQueryInfo */
/** @typedef {import('./types').MediaQueryResult} MediaQueryResult */
/** @typedef {import('./types').MediaQueryItem} MediaQueryItem */

const info = /** @type MediaQueryInfo[] */ ([
  { query: '(min-width: 2200px)', value: 8 },
  { query: '(min-width: 2000px)', value: 7 },
  { query: '(min-width: 1900px)', value: 6 },
  { query: '(min-width: 1700px)', value: 5 },
  { query: '(min-width: 1400px)', value: 4 },
  { query: '(min-width: 756px)', value: 3 },
  { query: '(min-width: 450px)', value: 2 },
]);
const queries = /** @type MediaQueryItem[] */ ([]);
const results = /** @type MediaQueryResult[] */ ([]);

/**
 * 
 * @param {(results: MediaQueryResult[]) => any} callback 
 */
export function register(callback) {
  info.forEach((def) => {
    const mq = window.matchMedia(def.query);
    results.push({
      ...def,
      matches: mq.matches,
    });
    
    const boundCallback = 
    /**
     * @param {MediaQueryListEvent} e 
     */
    (e) => {
      const item = results.find((i) => i.value === def.value);
      item.matches = e.matches;
      callback(results);
    };
    mq.addEventListener('change', boundCallback);
    queries.push({
      mq,
      listener: boundCallback,
    });
  });
  callback(results);
}

export function unregister() {
  queries.forEach((item) => {
    item.mq.removeEventListener('change', item.listener);
  });
  queries.splice(0);
  results.splice(0);
}

/**
 * @returns {MediaQueryResult[]}
 */
export function mediaResult() {
  return results;
}
