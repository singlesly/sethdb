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
import { EmbeddedOptions } from "../decorator/EmbeddedOptions";
import { doc } from "prettier";

export class Mapper {

    public toDocument(entity: Object): Document {
        const document = new Document();

        const properties: PropertyOptions[] = Reflect.getMetadata("entity:properties", entity.constructor.prototype) || [];
        const id: IdOptions | null = Reflect.getMetadata("entity:id", entity.constructor.prototype);
        const references: ReferenceOptions[] = Reflect.getMetadata("entity:references", entity.constructor.prototype) || [];
        const embeddedParts: EmbeddedOptions[] = Reflect.getMetadata("entity:embedded.parts", entity.constructor.prototype) || [];

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

        for(const embedded of embeddedParts) {
            const value = Reflect.get(entity, embedded.property);
            if(Array.isArray(value)) {
                document.add(embedded.property, value.map(item => this.toDocument(item)));
            } else  {
                document.add(embedded.property, this.toDocument(value));
            }
        }

        return document;
    }

    public toClass<T = any>(document: Record<string, any>, cls: Function): T {
        const entity = {} as any;
        Reflect.setPrototypeOf(entity, cls.prototype);

        const properties: PropertyOptions[] = Reflect.getMetadata("entity:properties", cls.prototype) || [];
        const id: IdOptions | null = Reflect.getMetadata("entity:id", cls.prototype);
        const references: ReferenceOptions[] = Reflect.getMetadata("entity:references", cls.prototype) || [];
        const embeddedParts: EmbeddedOptions[] = Reflect.getMetadata("entity:embedded.parts", cls.prototype) || [];

        if(id) {
            const originIdValue = document["_id"];
            if(originIdValue) {
                const idValue = id.isObjectId ? originIdValue : String(originIdValue);

                Reflect.set(entity, id.localField, idValue);
            }
        }

        for(const property of properties) {
            const value = document[property.property];
            Reflect.set(entity, property.field, value);
        }

        for(const reference of references) {
            const value = document[reference.property];
            if(Array.isArray(value)) {
                Reflect.set(entity, reference.property, value.map(item => this.toClass(item, reference.type)));
            } else  {
                Reflect.set(entity, reference.property, this.toClass(value, reference.type));
            }
        }

        for(const embedded of embeddedParts) {
            const value = document[embedded.property];
            if(Array.isArray(value)) {
                Reflect.set(entity, embedded.property, value.map(item => this.toClass(item, embedded.type)));
            } else  {
                Reflect.set(entity, embedded.property, this.toClass(value, embedded.type));
            }
        }

        return entity as T;
    }
}
