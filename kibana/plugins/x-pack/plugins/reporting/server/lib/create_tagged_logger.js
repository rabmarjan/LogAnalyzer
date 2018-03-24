/**
 * @function taggedLogger
 * @param {string} message
 * @param {string[]} [additionalTags]
 */


/**
 * Creates a taggedLogger function with tags, allows the consumer to optionally provide additional tags
 *
 * @param {Server} server
 * @param {string[]} tags - tags to always be passed into the `logger` function
 * @returns taggedLogger
 */
export function createTaggedLogger(server, tags) {
  return (msg, additionalTags = []) => {
    server.log([...tags, ...additionalTags], msg);
  };
}
