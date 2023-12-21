Estructura del Proyecto de E-Commerce:

Carpeta src:

Config: Contiene config.js (gestiona dotenv y el entorno), archivos env para producción, predeterminado y desarrollo, y logger.js.
Controllers: Almacena controladores para servicios como autenticación, carrito, productos, usuario, mensajes, restablecimiento de contraseña, SMS y tickets.
Dao: Organización esencial:
dtos: Archivos dto.factory, user.dto.js, y user.response.js.
fs: Archivos del sistema de archivos.
models: Modelos para usuarios, mensajes, carritos, productos y tickets.
Managers: Trabaja con los modelos mencionados y dbConfig.js para la conexión a MongoDB.
Docs: Contiene products.yaml para trabajar con Swagger tanto para productos como para carritos.
Memory: Incluye contactMemo.js.
MidsIngreso: Alberga bcrypt.js (protección de información), github.js (acceso con GitHub), passAuth.js (autorización para el ingreso), y passport.js (trabaja con Passport).
Mocking: Agrupa archivos necesarios para realizar el mock de productos (mock.controller.js, mock.router.js y utils.mocking.js).
Mongo: Contiene el archivo de contacto de MongoDB.
Public: Gran carpeta que incluye:
css: Estilos del proyecto.
images: Logotipo del cliente.
js: Contiene login.js y restore.js, así como archivos importantes como cart.js, chat.js, realTimeProducts.js, register.js, y user.js.
Repository: Agrupa contacts.repository.js e index.js.
Routes: Todas las rutas para vincular la aplicación con las vistas en diferentes secciones de la página.
Services: Alberga servicios que trabajan con los controladores.
Carpeta view:

Contiene vistas de la página, con layouts (donde se encuentra main.handlebars) y vistas individuales para carrito, productos, detalles de productos, inicio de sesión, registro, restablecimiento, perfil, chat y productos en tiempo real.
Env.: Reserva variables para dotenv.

App.js:

Confluyen todos los elementos para dar vida a la página. Trabaja con Express, Handlebars, Socket.IO, Mongoose, Morgan, Cookie-Parser, Swagger y enrutadores.
Errors.log:

Registro de errores del logger.
_Utils.js:

Contiene la referencia _dirname.
