### SethDB ODM

### Mapper

* mapping class entity to Document

```typescript
    @Entity("users")
    class User {
        @Id() id?: string;
        @Property() name: string;
    }
    
    const user = new User();
    user.name = "test";


    const mapper = new Mapper();
    const plainUser = mapper.toDocument(user).toObject();
    /* { name: "test" } */
```

### Roadmap

Annotations

* `@Entity`  - done
* `@Property`  - done
* `@Relation`  - done
* `@Embedded`  - done
* `@Indexes`  
* `@Validation`  
* `@Id` - done

