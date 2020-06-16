/**
 * @package
 * @author Artem Ilinykh devsinglesly@gmail.com
 */
import { Entity } from "../../src/decorator/Entity";
import 'reflect-metadata';
import { EntityOptions } from "../../src/decorator/EntityOptions";
import { Id } from "../../src/decorator/Id";
import { IdOptions } from "../../src/decorator/IdOptions";

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
        })
    })
});
