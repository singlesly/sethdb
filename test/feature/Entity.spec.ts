/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 */
import { Entity } from "../../src/decorator/Entity";
import 'reflect-metadata';
import { EntityOptions } from "../../src/decorator/EntityOptions";
import { Id } from "../../src/decorator/Id";
import { IdOptions } from "../../src/decorator/IdOptions";
import { Property } from "../../src/decorator/Property";
import { PropertyOptions } from "../../src/decorator/PropertyOptions";
import { Reference } from "../../src/decorator/Reference";
import { ReferenceOptions } from "../../src/decorator/ReferenceOptions";

describe("Entity test", () => {
    describe("Entity decorator", () => {


        it("should be define options", ()  => {
            @Entity() class SubjectClass {}

            const options: EntityOptions = Reflect.getMetadata("entity:class", SubjectClass.prototype);

            expect(options).toBeDefined();
            expect(options.name).toBe("SubjectClass");
        });

        it("should be defined entity name in options string specify style", () => {
            @Entity("subjects")
            class SubjectClass {}

            const options: EntityOptions = Reflect.getMetadata("entity:class", SubjectClass.prototype);

            expect(options).toBeDefined();
            expect(options.name).toBe("subjects");
        });

        it("should be defined entity name in options object style", () => {
            @Entity({
                name: "subjects"
            })
            class SubjectClass {}

            const options: EntityOptions = Reflect.getMetadata("entity:class", SubjectClass.prototype);

            expect(options).toBeDefined();
            expect(options.name).toBe("subjects");
        });

        it("should be defined id options in metadata", () => {
            class SubjectClass {
                @Id()
                id: string;
            }

            const options: IdOptions = Reflect.getMetadata("entity:id", SubjectClass.prototype);

            expect(options).toBeDefined();
            expect(options.localField).toBe("id");
            expect(options.isObjectId).toBe(false);

            const propOptions = Reflect.getMetadata("entity:id", SubjectClass.prototype, "id");
            expect(options).toEqual(propOptions);
        })

        it("should be defined property in metadata", () => {
            class SubjectClass {
                @Property()
                name: string;
            }

            const options: PropertyOptions[] = Reflect.getMetadata("entity:properties", SubjectClass.prototype);

            expect(options).toBeDefined();
            expect(options).toHaveLength(1);
            expect(options[0].property).toBe("name");

            const propOptions = Reflect.getMetadata("entity:property", SubjectClass.prototype, "name");

            expect(options[0]).toEqual(propOptions);
        })

        it("should be defined reference in metadata", () => {
            class RelatedClass {}
            class RelatedArrayClass {}

            class SubjectClass {
                @Property()
                name: string;

                @Reference()
                ref: RelatedClass;

                @Reference(RelatedArrayClass)
                refs: Array<RelatedArrayClass> = [];
            }

            const references: ReferenceOptions[] = Reflect.getMetadata("entity:references", SubjectClass.prototype);

            expect(references).toHaveLength(2);
            expect(references[0].property).toBe("ref");
            expect(references[0].type).toBe(RelatedClass);

            expect(references[1].property).toBe("refs");
            expect(references[1].type).toBe(RelatedArrayClass);

            const refOptions = Reflect.getMetadata("entity:reference", SubjectClass.prototype, "ref");
            const refsOptions = Reflect.getMetadata("entity:reference", SubjectClass.prototype, "refs");

            expect(references[0]).toEqual(refOptions);
            expect(references[1]).toEqual(refsOptions);
        })
    })
});
