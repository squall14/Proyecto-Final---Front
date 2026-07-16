# Leon Sports 🦁

E-commerce dinámico e interactivo de indumentaria y equipamiento deportivo, desarrollado como proyecto integrador combinando HTML semántico, CSS (Bootstrap + Flexbox + Grid) y JavaScript vanilla con consumo de una API REST.

Desarrollarás una página web completa, que combine todos los conocimientos adquiridos a lo largo del curso. El proyecto consistirá en la creación de un sitio web de e-commerce dinámico e interactivo, que consuma datos de una API REST para mostrar productos, y permita a los usuarios añadir productos a un carrito de compras.

Pasos a seguir:

HTML: Uso de etiquetas semánticas para organizar la página.

CSS: Implementación de un diseño responsivo y atractivo usando Bootstrap y Flexbox.

JavaScript: Integración de una API REST para obtener datos y renderizar productos en el DOM, además de la funcionalidad de un carrito de compras usando localStorage.

Accesibilidad y SEO: Implementar prácticas que mejoren la experiencia del usuario y optimicen la página para los motores de búsqueda.«<

1. Estructura básica de HTML.

Estructura semántica: El HTML debe estar dividido en las etiquetas semánticas principales: header, nav, main, section, footer.

README.md: Incluir un archivo que explique brevemente el propósito de la página.

2. Formulario de contacto.

Formulario funcional: Crear un formulario de contacto con campos para nombre, correo electrónico y mensaje, utilizando Formspree para manejar el envío de datos.
3. Estilos básicos aplicados con CSS

Archivo styles.css: El proyecto debe contar con un archivo CSS externo que incluya:

Estilos básicos aplicados a las secciones de header, footer y lista de navegación.

Fuentes de Google Fonts correctamente implementadas.

Propiedades de background aplicadas en alguna sección de la página (color, imagen, degradado, etc.).

4. Diseño responsivo con Flexbox y Grid

Sección "Productos": Organizada en cards de forma responsiva utilizando Flexbox.

Sección "Reseñas": Organizada utilizando Grid, con una distribución lógica y estética.

Sección "Contacto": Debe ser responsiva mediante el uso de Media Queries para adaptarse a diferentes tamaños de pantalla.
5. Contenido multimedia y navegación

Multimedia: deberá incluir archivos multimedia (imagenes, video o iframe) correctamente integrado en la página.

Lista de navegación: Implementar una lista desordenada con enlaces que simulen una navegación interna (Inicio, Productos, Contacto, etc.).
7. JavaScript

Script.js: deberá incluir un archivo Debes crear un archivo script.js para manejar toda la interactividad de la página.

Asegúrate de enlazarlo correctamente en tu archivo HTML.

DOM: Implementa funciones para validar formularios (ej., campos requeridos y formato de correo).

Usa JavaScript para manipular elementos del DOM, por ejemplo, actualizar el carrito y mostrar mensajes al usuario

Fetch Api

Consume datos desde una API REST usando fetch.

Muestra los productos obtenidos de la API en la página en forma de tarjetas (cards).

Visualización de Productos:

Cada producto debe tener su imagen, título y precio, mostrando una lista atractiva para el usuario.

8. Carrito de compras dinámico

Agregar Productos al Carrito: Implementa un carrito de compras donde los usuarios puedan añadir productos desde las tarjetas.

Uso de localStorage o sessionStorage: Guarda el estado del carrito en localStorage o sessionStorage para que no se pierda al actualizar o cerrar la página.

Contador Dinámico: Muestra el número total de productos en el carrito y asegúrate de actualizarlo en tiempo real.

9. Edición y visualización del carrito

Visualización de Productos en el Carrito: Muestra una lista de productos añadidos al carrito, incluyendo cantidad, precio y total.

Edición de Cantidades y Eliminación de Productos: Implementa funciones para que el usuario pueda editar la cantidad de cada producto o eliminarlo del carrito.

Total Dinámico:Actualiza el total de la compra cada vez que se modifiquen los productos en el carrito.

10. SEO & accesibilidad

Buenas prácticas de accesibilidad:

Usa alt en las imágenes para mejorar la accesibilidad.

Asegúrate de que se pueda navegar fácilmente con el teclado.

SEO básico:

Usa metaetiquetas en el head del HTML para optimizar el SEO.


Funcionalidad esperada:

Interactividad completa:

La página debe permitir al usuario ver productos, añadirlos al carrito, editar el carrito, y simular la compra.

Formulario de contacto:

Implementa un formulario funcional que envíe datos a través de Formspree.

Diseño responsivo:

Asegúrate de que el diseño sea adaptable a diferentes tamaños de pantalla.

Persistencia del carrito:

El carrito debe mantenerse activo incluso si el usuario cierra o actualiza la página, usando localStorage o sessionStorage.