# Identity and Access Management (IAM) - Documentación

Este directorio contiene la documentación técnica y funcional del módulo IAM del proyecto Semilla. El módulo IAM es el responsable de gestionar los usuarios, la autenticación y la autorización (basada en Roles y Permisos) utilizando principios de Clean Architecture y Event-Driven Design.

## 🗂 Índice de Documentos

1. **[Especificaciones (Specs)](./specs.md):** Requerimientos funcionales y reglas de negocio del módulo.
2. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Diagrama Entidad-Relación de las tablas creadas por TypeORM.
3. **[Diccionario de Datos](./data-dictionary.md):** Estructura detallada y tipos de datos de cada tabla de la base de datos.
4. **[Diagrama de Flujo](./flow-diagram.md):** Diagramas de secuencia de las operaciones principales (Login, Registro, etc.).

## 🛠 Tecnologías Core
- **JWT (Asimétrico):** Firmado con clave RSA (Privada/Pública).
- **Bcrypt:** Para el hashing de contraseñas de forma segura.
- **CQRS:** Patrón implementado para separar operaciones de escritura (Commands) y lectura (Queries).
