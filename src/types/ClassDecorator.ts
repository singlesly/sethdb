/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @type ClassDecorator
 */
import { ClassType } from "./ClassType";

export type ClassDecorator = (target?: ClassType) => void;
