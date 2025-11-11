/**
 * * debounce
 * @param {(args: any[]) => void} fn
 * @param {Number} delay
 * @returns {(args: any[]) => void}
 */
export function debounce(fn, delay) {
    /** @type {NodeJS.Timeout | string | number | undefined} */
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}
