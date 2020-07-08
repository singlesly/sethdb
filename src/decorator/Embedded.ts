/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @function Embedded
 */
import { EmbeddedOptions } from "./EmbeddedOptions";
import { ReferenceOptions } from "./ReferenceOptions";

export function Embedded (args?: EmbeddedOptions|Function): PropertyDecorator {
    return function (target: Object, propertyKey:  string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        const options = {} as ReferenceOptions;

        if(!args && type === Array) {
            throw new Error("Please specify type of Embedded");
        }
        if(type === Array) {
            if(typeof args === 'object') {
                options.type = args.type;
            } else {
                options.type = args as Function;
            }
        } else {
            options.type = type;
        }

        options.property = propertyKey;

        Reflect.defineMetadata("entity:embedded.parts", [
            ...(Reflect.getMetadata("entity:embedded.parts", target.constructor.prototype) || []),
            options
        ], target.constructor.prototype);
        Reflect.defineMetadata("entity:embedded", options, target.constructor.prototype, propertyKey);
    }
}
