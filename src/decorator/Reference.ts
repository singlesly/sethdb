/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @function Reference
 */
import { ReferenceOptions } from "./ReferenceOptions";
import "reflect-metadata";

export function Reference(args?: ReferenceOptions|Function): PropertyDecorator {
    return function (target: Object, propertyKey: string): void {

        const type = Reflect.getMetadata("design:type", target, propertyKey);

        const options = {} as ReferenceOptions;

        if(!args && type === Array) {
            throw new Error("Please specify type of Reference");
        }
        if(type === Array) {
            options.type = args as Function;
        } else {
            options.type = type;
        }

        options.property = propertyKey;

        Reflect.defineMetadata("entity:references", [
            ...(Reflect.getMetadata("entity:references", target.constructor.prototype) || []),
            options
        ], target.constructor.prototype);
        Reflect.defineMetadata("entity:reference", options, target.constructor.prototype, propertyKey);
    }
}
