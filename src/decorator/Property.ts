/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @function Property
 */
import { PropertyOptions } from "./PropertyOptions";

export function Property(options?: PropertyOptions): PropertyDecorator {
    return function (target: Object, property: string): void {
        if(!options) {
            options = {};
        }

        options.property = !options.property ? property : options.property;
        options.field = property;

        Reflect.defineMetadata("entity:properties", [
            ...(Reflect.getMetadata("entity:properties", target.constructor.prototype) || []),
            options
        ], target.constructor.prototype);
        Reflect.defineMetadata("entity:property", options, target.constructor.prototype, property);
    }
}
