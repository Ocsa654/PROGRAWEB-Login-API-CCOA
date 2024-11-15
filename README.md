# LOGIN AND API OACC 

Este proyecto es una demostración básica de cómo implementar un sistema de inicio de sesión en Angular que interactúa con una API para validar usuarios. Una vez autenticado, el usuario puede acceder a un Dashboard donde se muestra una lista paginada de usuarios obtenida desde la API. Además, el Dashboard incluye otras funcionalidades como Privacidad, Preferencias de anuncios, etc.

# Características

Formulario de inicio de sesión: Permite a los usuarios ingresar sus credenciales (usuario y contraseña).

Validación con API: Verifica las credenciales enviadas al servidor para autenticar al usuario.

Dashboard interactivo: Muestra una lista de usuarios, preferencias de anuncios y opciones de privacidad.

Tabla de usuarios con paginación: Muestra una tabla paginada con información de usuarios obtenida desde la API.

Manejo de errores: Muestra mensajes de error si el inicio de sesión falla, ya sea por credenciales incorrectas o problemas de conexión con la API.

# Tecnologías utilizadas

Angular: Framework para la construcción del frontend.
RxJS: Usado para el manejo de observables y peticiones asíncronas a la API.
CSS: Para los estilos básicos de la aplicación.
Angular Material: Para el diseño de la tabla, la funcionalidad de paginación y otros componentes interactivos.
API Mock: Simulación de una API que devuelve información de usuarios para pruebas.


# Cómo funciona
Inicio de sesión
El usuario ingresa su nombre y contraseña en un formulario.
El componente valida las credenciales llamando al servicio que interactúa con la API.
Si las credenciales son correctas, el usuario es redirigido al Dashboard.
Si las credenciales son incorrectas, se muestra un mensaje de error.

# Dashboard
El Dashboard tiene varias secciones, entre ellas:
Lista de usuarios: Muestra una tabla paginada con información de los usuarios.

Preferencias de privacidad: Permite al usuario gestionar su privacidad en la plataforma.

Preferencias de anuncios (Ads): Permite gestionar las preferencias para los anuncios que se muestran.

Estadísticas de cuenta: Muestra estadísticas básicas relacionadas con la cuenta del usuario.

Preferencias de privacidad:
En esta sección, el usuario puede gestionar configuraciones relacionadas con la privacidad de su cuenta. Por ejemplo, habilitar o deshabilitar la visibilidad de su perfil.

Preferencias de anuncios:
En esta sección, el usuario puede configurar sus preferencias sobre qué tipos de anuncios desea recibir, lo cual puede incluir opciones como "Anuncios personalizados" o "Anuncios genéricos".

# Estructura del proyecto
app/login: Contiene el componente de inicio de sesión, incluyendo la lógica del formulario.

app/services/user.service.ts: Servicio encargado de interactuar con la API para obtener los datos de los usuarios.

app/models/user.model.ts: Modelo de usuario que define la estructura de los datos manejados en la aplicación.

app/dashboard: Componente que muestra varias secciones del Dashboard, como la lista de usuarios, privacidad y preferencias de anuncios.

    1. Lista de Usuarios
    El Dashboard muestra una tabla con los usuarios obtenidos de la API. La tabla incluye la paginación, lo que facilita la navegación  entre una gran cantidad de datos.

    2. Preferencias de Privacidad
    En esta sección, los usuarios pueden gestionar su privacidad en la plataforma, como ocultar o mostrar su perfil a otros usuarios.   Puedes crear un formulario o un conjunto de opciones donde el usuario pueda ajustar estas preferencias.

    3. Preferencias de Anuncios (Ads)
    Los usuarios pueden decidir qué tipo de anuncios prefieren recibir en la plataforma.


# PRUEBAS DE EJECUCION




[Application Screenshot](src/assets/images/LOGIN%20CORRECTO.png)




