/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @class Mapper
 */
import { Document } from "../Document";
import { PropertyOptions } from "../decorator/PropertyOptions";
import { IdOptions } from "../decorator/IdOptions";
import { ObjectID } from "mongodb";

export class Mapper {

    public toDocument(entity: Object): Document {
        const document = new Document();

        const properties: PropertyOptions[] = Reflect.getMetadata("entity:properties", entity.constructor.prototype);
        const id: IdOptions | null = Reflect.getMetadata("entity:id", entity.constructor.prototype);

        if(id) {
            const idValue = Reflect.get(entity, id.localField);
            if(idValue) {
                const idObjectId = id.isObjectId ? idValue : new ObjectID(idValue);

                document.add("_id", idObjectId);
            }
        }

        for(const property of properties) {
            const value = Reflect.get(entity, property.field);
            document.add(property.property, value);
        }

        return document;
    }
}
