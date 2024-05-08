# BibliotecaAPP-FrontEnd

**BibliotecaAPP** es una aplicación diseñada para gestionar de manera simple las principales funcionalidades de una biblioteca. Cubre los siguientes requerimientos:

- CRUD de libros.
- Gestión de inventario de libros.
- CRUD de usuarios.
- CRUD y gestión de préstamos de libros.

Además, incorpora una lógica de roles diferenciada que permite asignar distintos niveles de acceso y control según el tipo de usuario.

## Roles y Permisos

La aplicación define tres roles principales:

- **Superusuario:** Tiene control total sobre el sistema, incluyendo la capacidad de crear y gestionar usuarios.
- **Administrador:** Posee todas las capacidades del superusuario excepto la gestión de usuarios.
- **Cajero:** Sus funciones se limitan a:
  - Agregar libros al inventario.
  - Realizar préstamos y devoluciones de libros.
  - Declarar libros como perdidos.

## Capturas de Pantalla

1. **Pantalla de Inicio**
   ![Pantalla de Inicio](https://github.com/joseangelhernandez/BibliotecaAPP/assets/55303324/6a7f9605-314d-4726-ab73-6dc2578bca9d)
2. **Pantalla de Login**
   ![Pantalla de Login](https://github.com/joseangelhernandez/BibliotecaAPP/assets/55303324/8ec67b68-6cf2-4625-b9dd-b0868a74bb68)
3. **Pantalla de Inventario de Libros**
   ![Pantalla de Inventario de Libros](https://github.com/joseangelhernandez/BibliotecaAPP/assets/55303324/21421f3c-e37a-4b44-8c74-fc5d4aa7c8f7)
4. **Pantalla de Préstamos de Libros**
   ![Pantalla de Préstamos de Libros](https://github.com/joseangelhernandez/BibliotecaAPP/assets/55303324/5d4ef649-5656-49a5-91ea-d98fcd5aecb4)
5. **Pantalla de Usuarios**
   ![Pantalla de Usuarios](https://github.com/joseangelhernandez/BibliotecaAPP/assets/55303324/b23abda1-c1a5-4c21-bf2b-fcc11d9aaf5b)

## Tecnologías y Herramientas

### Estado Global y Hooks

Utilizamos Context API para el manejo global de estados, complementado con algunos hooks personalizados:

- `useBoolean` para manejar principalmente los estados de los modales.
- `useSnackbar` para mensajes de retroalimentación tras solicitudes HTTP.
- `useTable` para gestionar funciones y estados específicos pero globales de las tablas.

Empleamos `useCallback` en las funciones para evitar renderizaciones innecesarias.

### Principios SOLID

Nos esforzamos por mantener los principios SOLID, asignando a cada componente una responsabilidad única e inyectando dependencias a través de props cuando es necesario, como en el caso de los modales que dependen de un componente padre.

### Estructura de Directorios

- **Sections:** Muestra la responsabilidad única de cada componente.
- **Pages:** Contiene todos los componentes relacionados con las páginas específicas, facilitando la gestión del router.
- **Router:** Gestiona todas las rutas de la aplicación.
- **API:** Organiza las llamadas a servicios HTTP, separando cada entidad en archivos `.js` distintos.

## Mejoras Futuras

Reconocemos que hay áreas de mejora en la gestión de estados para evitar repetitividad, como la memoización de las consultas GET y otros enfoques para optimizar el rendimiento.

## Prueba la Aplicación

[Prueba la aplicación aquí](#) - Enlace a la versión de producción para probar la aplicación.
