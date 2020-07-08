import { ObjectId } from "mongodb";

/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @class Document
 */
export class Document {
    private document: Record<string, any> = {};

    constructor(object: Record<string, any> = {}) {
        this.fromObject(object);
    }

    private fromObject(object: Record<string, any>) {
        this.document = object;

        Object.entries(this.document).forEach(([key,  value]) => {
            if(value instanceof ObjectId) {
                this.document[key] = value;
                return;
            }
            if(value instanceof Document) {
                this.document[key] = value;
                return;
            }
            if(typeof value === 'object' && value !== null) {
                this.document[key] = new Document(value);
            }
            if(Array.isArray(value) && value !== null) {
                value.map(item => typeof item === 'object' && item !== null ? new Document(object) : item);
            }
        });
    }

    public add(key: string, value: any): this {
        this.document[key] = value;
        return this;
    }

    public get<T = any>(key: string): T|null {
        return this.document[key];
    }

    public toObject() {
        Object.entries(this.document).forEach(([key, value]) => {
            if(value instanceof Document) {
                this.document[key] = value.toObject();
            }
            if(Array.isArray(value)) {
                this.document[key] = value.map(item => item instanceof Document ? item.toObject() : item);
            }
        });
        return this.document;
    }
}
