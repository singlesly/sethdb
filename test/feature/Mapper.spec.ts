/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 */
import { Entity } from "../../src/decorator/Entity";
import { Id } from "../../src/decorator/Id";
import { Property } from "../../src/decorator/Property";
import { Mapper } from "../../src/mapping/Mapper";
import { ObjectID } from "mongodb";

describe("Mapper test", () => {

    const mapper = new Mapper();

    it("should be map class to document with specify fields and id", () => {
        @Entity()
        class SubjectClass {
            @Id() id?: string = new ObjectID("54759eb3c090d83494e2d804").toHexString();
            @Property() name: string;
            @Property() age: number;
            @Property({ property: "renamed" }) origin: string;
        }

        const subject = new SubjectClass();
        subject.name = "name";
        subject.age = 55;
        subject.origin = "origin";

        const document = mapper.toDocument(subject).toObject();

        expect(document._id).toBeInstanceOf(ObjectID);
        expect(document._id.toHexString()).toBe(subject.id);
        expect(document.name).toBe(subject.name);
        expect(document.age).toBe(subject.age);
        expect(document.renamed).toBe(subject.origin);
    });
});
