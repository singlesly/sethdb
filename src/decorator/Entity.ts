/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @function Entity
 */
import { EntityOptions } from "./EntityOptions";
import { ClassType } from "../types/ClassType";
import { ClassDecorator } from "../types/ClassDecorator";
import "reflect-metadata";

export function Entity(options?: EntityOptions|string): ClassDecorator {
    return function (target?: ClassType): void {
        if(!options) {
            options = {} as EntityOptions;
        }
        if(typeof options === "string") {
            options = {
                name: options
            };
        }

        options.name = options.name || target.name;

        Reflect.defineMetadata("entity:class", options, target.prototype);
    }
}
