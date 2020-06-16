/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @function Id
 */
import { IdOptions } from "./IdOptions";

export function Id(options?: IdOptions): PropertyDecorator {
    return function (target: Object, propertyKey: string): void {
        if(!options) {
            options = {};
        }

        const type = Reflect.getMetadata("design:type", target.constructor.prototype, propertyKey);

        options.isObjectId = type !== String;
        options.localField = propertyKey;

        Reflect.defineMetadata("entity:id", options, target.constructor.prototype);
        Reflect.defineMetadata("entity:id", options, target.constructor.prototype, propertyKey);
    }
}
