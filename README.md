### TechRetail Solutions - Backend B2B 🛒
Este repositorio contiene el código fuente del backend (Producto Mínimo Viable - MVP) para la plataforma de e-commerce autogestionada enfocada en el entorno B2B  **TechRetail Solutions** . El sistema permite a los comercios crear sus propias tiendas online, integrando el registro de transacciones, logística, reportes estadísticos y un panel de alertas.

#### 👥 Equipo de Desarrollo: DeveloPET Friendly (Grupo 9)
*   **Guillermo Sciulli:** Reestructuración de la arquitectura general a ES Modules, ejecución del despliegue del servidor en la plataforma en la nube (Render), e implementación de la suite de pruebas unitarias (Testing automatizado) nativo (node:test).
*   **Mailén Juárez:** Migración definitiva a MongoDB Atlas de los módulos de Comercios y Tiendas, implementando esquemas estrictos de Mongoose y refactorizando controladores para un manejo asincrónico eficiente.
*   **Verónica Greco:** Desarrollo e implementación del Chat Interno en tiempo real utilizando WebSockets (socket.io). Además, consolidación de la lógica relacional entre los módulos de Transacciones y Logística.
*   **Braian Perea:** Encargado de la implementación de la seguridad stateless con middlewares JWT y Control de Acceso Basado en Roles (RBAC). Además, adaptó el motor de plantillas Pug para el renderizado de vistas dinámicas y dashboards.

---

#### 🚀 Estado Actual (3° Entrega - Versión Final)
El proyecto cuenta con un backend 100% funcional estructurado bajo el  **Patrón de Diseño MVC**  (Modelos, Vistas y Controladores). El código está modernizado utilizando ES Modules (import/export) y maneja la concurrencia mediante promesas y async/await.

##### ✨ Nuevas Funcionalidades Implementadas (Tercera Entrega)
*  🔐  **Seguridad y Autenticación (JWT & RBAC):**  Se implementó un sistema de inicio de sesión seguro utilizando JSON Web Tokens (JWT) almacenados en  *cookies* . Se desarrollaron middlewares de protección de rutas (auth.middleware.js) y un  **Control de Acceso Basado en Roles**  (role.middleware.js) que restringe operaciones críticas según la jerarquía del empleado (Administrador, Supervisor u Operador).
*  ☁️  **Despliegue en la Nube (Deployment):**  La base de datos fue migrada exitosamente a  **MongoDB Atlas** . Además, el servidor fue configurado y publicado en la plataforma  **Render** , haciendo que la API REST esté accesible de forma pública en internet.
*  🚨  **Panel de Alertas (Interoperabilidad):**  Nuevo dashboard visual interactivo desarrollado en Pug que notifica discrepancias financieras y problemas operativos. Utiliza el método .populate() de Mongoose para cruzar y mostrar los montos exactos de las transacciones afectadas.
*  🧪  **Testing Automatizado:**  Se incorporaron pruebas unitarias automatizadas utilizando el motor nativo de Node.js (node:test y node:assert) para validar la robustez de los middlewares de seguridad y roles (RBAC) aislando componentes (Mocking).
*  💬  **Chat Interno en Tiempo Real (Socket.io):**  Se integró un sistema de mensajería instantánea para la comunicación interna del equipo operativo utilizando WebSockets (socket.io). Cuenta con un middleware de autenticación por socket que valida el token JWT, persistencia del historial en MongoDB (esquema con autogeneración de marcas de tiempo), carga optimizada de los últimos 30 mensajes, visualización de fecha/hora formateada y scroll automático inteligente al abrir o recibir mensajes.

##### 📦 Módulos y Funcionalidades (CRUD completo)
*   **Comercios y Tiendas:**  Gestión de empresas B2B y sus sucursales virtuales, con validación de dependencias.
*   **Transacciones (Ventas):**  Procesamiento de ventas y registro del estado de conciliación financiera (Monto Real vs Pasarela).
*   **Logística:**  Generación de envíos vinculados de manera relacional al identificador de la transacción que le dio origen.
*   **Usuarios:**  Módulo de gestión de personal con contraseñas encriptadas.
*   **Estadísticas:**  Generación de Reporte "Hot Sale" de alto rendimiento que calcula en tiempo real el volumen de ventas y el "Split de pagos".
*   **Alertas:**  Monitoreo visual de la salud financiera del sistema mediante tickets de resolución por prioridades.
*   **Chat Interno:**  Canal de comunicación en tiempo real seguro y exclusivo para personal autenticado, accesible mediante un widget y botón flotante interactivo en todo el panel.

---

### 🛠️ Instalación de Dependencias

Una vez clonado el repositorio, abre la terminal posicionado en la carpeta raíz del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias para producción:

npm install express mongoose jsonwebtoken bcrypt pug socket.io dotenv

**Detalle de los paquetes principales:**
*   **express:** Framework principal para levantar el servidor y manejar el enrutamiento de la API.
*   **mongoose:** ODM utilizado para modelar de forma estricta los datos y establecer la conexión con MongoDB Atlas.
*   **jsonwebtoken:** Herramienta para la generación y validación de tokens de seguridad (Autenticación *stateless*).
*   **bcrypt:** Librería utilizada para la encriptación unidireccional y segura de las contraseñas de los usuarios.
*   **pug:** Motor de plantillas integrado para renderizar las vistas dinámicas generadas desde el servidor (como el Panel de Alertas).
*   **socket.io:** Librería que habilita los WebSockets para la comunicación bidireccional en tiempo real de nuestro Chat Interno.
*   **dotenv:** Módulo para cargar y proteger las variables de entorno locales (como la URI de la base de datos y la clave secreta de JWT).

#### Dependencias de Desarrollo (Opcional)
Para trabajar en el entorno local con recarga automática ante cada cambio en el código, instala `nodemon` como dependencia de desarrollo ejecutando:

npm install nodemon --save-dev

*(Nota sobre Testing: El proyecto utiliza el motor nativo de Node.js (`node:test`) para las pruebas automatizadas, demostrando una arquitectura sólida que previene el overengineering. Por lo tanto, **no es necesario** instalar librerías externas de testing como Jest)*.

El servidor estará corriendo en http://localhost:8000. Puedes visualizar la interfaz gráfica en tu navegador o probar los endpoints de la API utilizando Thunder Client o Postman.
 
🧪 Ejecución de Pruebas (Testing)
Para correr la suite de pruebas unitarias sobre los módulos de seguridad de la API, ejecuta en la terminal:
npm test
El motor nativo de Node.js evaluará los casos de prueba simulados y devolverá el reporte de cobertura en la consola.
