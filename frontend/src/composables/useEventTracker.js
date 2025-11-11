import { ref } from 'vue';

/**
 * @module useEventTracker
 * @description Composable for tracking and managing DOM event listeners
 */

/**
 * @typedef {Object} EventListenerInfo
 * @property {Function} listener
 * @property {boolean|AddEventListenerOptions} [options]
 */

/**
 * @typedef {Map<string, EventListenerInfo[]>} ElementListenersMap
 * @description Map of event types to arrays of listener information
 */

/**
 * Event tracker composable for monitoring and managing DOM event listeners
 * @returns {Object} Event tracker methods and state
 */

/**
 * @typedef {Object} EventTrackerReturn
 * @property {import('vue').Ref<WeakMap<EventTarget, ElementListenersMap>>} eventListeners
 * @property {function(): void} startTracking
 * @property {function(): void} stopTracking
 * @property {function(EventTarget): ElementListenersMap} getListeners
 * @property {function(): void} clearAllListeners
 * @property {function(EventTarget, string): boolean} hasListeners
 * @property {function(EventTarget, string): number} getListenerCount
 */
export function useEventTracker() {
    /** @type {import('vue').Ref<WeakMap<EventTarget, ElementListenersMap>>} */
    const eventListeners = ref(new WeakMap());

    /** @type {Function} */
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    /** @type {Function} */
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

    /**
     * @function startTracking
     * @returns {void}
     */
    function startTracking() {
        /**
         * @param {string} type
         * @param {Function} listener
         * @param {boolean|AddEventListenerOptions} [options]
         */
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (!eventListeners.value.has(this)) {
                eventListeners.value.set(this, new Map());
            }

            const elementListeners = eventListeners.value.get(this);
            if (!elementListeners.has(type)) {
                elementListeners.set(type, []);
            }
            elementListeners.get(type).push({ listener, options });

            return originalAddEventListener.call(this, type, listener, options);
        };

        /**
         * @param {string} type
         * @param {Function} listener
         * @param {boolean|AddEventListenerOptions} [options]
         */
        EventTarget.prototype.removeEventListener = function (type, listener, options) {
            if (eventListeners.value.has(this)) {
                const elementListeners = eventListeners.value.get(this);

                if (elementListeners.has(type)) {
                    const listeners = elementListeners.get(type);
                    const index = listeners.findIndex((item) => item.listener === listener);

                    if (index !== -1) {
                        listeners.splice(index, 1);
                    }

                    if (listeners.length === 0) {
                        elementListeners.delete(type);
                    }
                }

                if (elementListeners.size === 0) {
                    eventListeners.value.delete(this);
                }
            }
            return originalRemoveEventListener.call(this, type, listener, options);
        };
    }

    /**
     * @function stopTracking
     * @returns {void}
     */
    function stopTracking() {
        EventTarget.prototype.addEventListener = originalAddEventListener;
        EventTarget.prototype.removeEventListener = originalRemoveEventListener;
    }

    /**
     * @function getListeners
     * @param {EventTarget} element
     * @returns {ElementListenersMap}
     */
    function getListeners(element) {
        return eventListeners.value.get(element) || new Map();
    }

    /**
     * @function clearAllListeners
     * @returns {void}
     */
    function clearAllListeners() {
        eventListeners.value = new WeakMap();
    }

    /**
     * @function hasListeners
     * @param {EventTarget} element
     * @param {string} type
     * @returns {boolean}
     */
    function hasListeners(element, type) {
        const elementListeners = getListeners(element);
        return elementListeners.has(type) && elementListeners.get(type).length > 0;
    }

    /**
     * @function getListenerCount
     * @param {EventTarget} element
     * @param {string} type
     * @returns {number}
     */
    function getListenerCount(element, type) {
        const elementListeners = getListeners(element);
        return elementListeners.has(type) ? elementListeners.get(type).length : 0;
    }

    /**
     * @type {EventTrackerReturn}
     */
    return {
        eventListeners,
        startTracking,
        stopTracking,
        getListeners,
        clearAllListeners,
        hasListeners,
        getListenerCount,
    };
}
