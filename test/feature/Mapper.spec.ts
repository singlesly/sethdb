/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 */
import { Entity } from "../../src/decorator/Entity";
import { Id } from "../../src/decorator/Id";
import { Property } from "../../src/decorator/Property";
import { Mapper } from "../../src/mapping/Mapper";
import { ObjectID } from "mongodb";
import { Reference } from "../../src/decorator/Reference";
import { Document } from "../../src/Document";
import { Embedded } from "../../src/decorator/Embedded";

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

    it("should be map single reference object", () => {
        const oid = new ObjectID();
        @Entity()
        class ParentClass {
            @Id() id: string = oid.toHexString();
        }

        @Entity()
        class SubjectClass {
            @Id() id?: string;
            @Reference() parent: ParentClass;
        }

        const parent = new ParentClass();
        const subject = new SubjectClass();
        subject.parent = parent;

        const document = mapper.toDocument(subject).toObject();

        expect(document.parent).toBeInstanceOf(ObjectID);
        expect(document.parent.toHexString()).toBe(oid.toHexString());
    })

    it("should be map multiple reference objects", () => {
        @Entity()
        class ChildClass {
            @Id() id?: string;
        }

        @Entity()
        class SubjectClass {
            @Id() id?: string;
            @Reference(ChildClass) child: ChildClass[] = [];
        }
        const subject = new SubjectClass();
        subject.child = [
            new ChildClass(),
            new ChildClass(),
            new ChildClass()
        ];

        const document = mapper.toDocument(subject).toObject();

        expect(document.child).toHaveLength(3);
        expect(document.child.every(child => child instanceof ObjectID)).toBeTruthy();

    });

    it("should be map single embedded", () => {
        const oid = new ObjectID();

        class ChildClass {
            @Id() id: string = oid.toHexString();
        }

        @Entity()
        class SubjectClass {
            @Id() id?: string;
            @Embedded() child: ChildClass;
        }
        const subject = new SubjectClass();
        subject.child = new ChildClass();

        const document = mapper.toDocument(subject).toObject();

        expect(document.child._id).toBeInstanceOf(ObjectID);
        expect(document.child._id.toHexString()).toBe(oid.toHexString());
    });

    it("should be map multi embedded", () => {
        const oid = new ObjectID();

        class ChildClass {
            @Id() id: string = oid.toHexString();
        }

        @Entity()
        class SubjectClass {
            @Id() id?: string;
            @Embedded(ChildClass) child: ChildClass[] = [];
        }
        const subject = new SubjectClass();
        subject.child = [
            new ChildClass(),
            new ChildClass(),
            new ChildClass()
        ];

        const document = mapper.toDocument(subject).toObject();

        expect(document.child).toHaveLength(3);
        expect(document.child.every(child => child._id.toHexString() === oid.toHexString())).toBeTruthy();
    });

    it("to document test", () => {

        class E {
            @Property() name: string;
        }

        @Entity()
        class R {
            @Id() id?: string;
            @Property() name: string;
        }

        @Entity()
        class ResultTest {
            @Id() id?: string;
            @Property() test: string;
            @Embedded() eSingle: E;
            @Embedded({type: E}) eArr: E[] = [];
            @Reference() rSingle: R;
            @Reference({type: R}) rArr: R;
        }

        const mongoDoc = {
            _id: new ObjectID(),
            test: "hello world from mongo",
            eSingle: {
                name: "hi"
            },
            eArr: [
                { name: "e 1" },
                { name: "e 2" }
            ],
            rSingle: {
                _id: new ObjectID(),
                name: "r single"
            },
            rArr: [
                { _id: new ObjectID(), name: "rarr 1" },
                { _id: new ObjectID(), name: "rarr 2" },
                { _id: new ObjectID(), name: "rarr 3" },
            ]
        };

        const cls = mapper.toClass(mongoDoc, ResultTest);

        expect(cls).toBeDefined();
    })
});
