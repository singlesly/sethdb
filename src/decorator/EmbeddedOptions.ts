/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @interface EmbeddedOptions
 */
import { ClassType } from "../types/ClassType";

export interface EmbeddedOptions {
    type?: ClassType;
    property?: string;
}
