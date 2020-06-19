/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 * @class Document
 */
export class Document {
    private readonly document: Record<string, any> = {};

    constructor(object: Record<string, any> = {}) {
        this.document = object;
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
