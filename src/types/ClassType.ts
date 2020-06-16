/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @type ClassType
 */
export type ClassType<E = object> = (new (...args) => E)
