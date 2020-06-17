/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @type PropertyDecorator
 */
import { ClassType } from "./ClassType";

export type PropertyDecorator = (target: ClassType, propertyName: string, descriptor: PropertyDescriptor) => any;
