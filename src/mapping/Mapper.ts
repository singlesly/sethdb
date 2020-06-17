/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @class Mapper
 */
import { Document } from "../Document";
import { PropertyOptions } from "../decorator/PropertyOptions";
import { IdOptions } from "../decorator/IdOptions";
import { ObjectID } from "mongodb";
import { ReferenceOptions } from "../decorator/ReferenceOptions";

export class Mapper {

    public toDocument(entity: Object): Document {
        const document = new Document();

        const properties: PropertyOptions[] = Reflect.getMetadata("entity:properties", entity.constructor.prototype) || [];
        const id: IdOptions | null = Reflect.getMetadata("entity:id", entity.constructor.prototype);
        const references: ReferenceOptions[] = Reflect.getMetadata("entity:references", entity.constructor.prototype) || [];

        if(id) {
            const idValue = Reflect.get(entity, id.localField);
            if(idValue) {
                const idObjectId = id.isObjectId ? idValue : new ObjectID(idValue);

                document.add("_id", idObjectId);
            } else {
                document.add("_id", new ObjectID());
            }
        }

        for(const property of properties) {
            const value = Reflect.get(entity, property.field);
            document.add(property.property, value);
        }

        for(const reference of references) {
            const value = Reflect.get(entity, reference.property);
            if(Array.isArray(value)) {
                document.add(reference.property, value.map(item => this.toDocument(item).get<ObjectID>("_id")));
            } else  {
                document.add(reference.property, this.toDocument(value).get<ObjectID>("_id"));
            }
        }

        return document;
    }
}
