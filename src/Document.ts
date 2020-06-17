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

    public toObject() {
        return this.document;
    }
}