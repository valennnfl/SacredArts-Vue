# Sacred Arts – Encantamientos de Elden Ring

## Alumna
- Valentina Flores

## Tema elegido
El proyecto consiste en una aplicación web sobre **Elden Ring**, centrada en los encantamientos del videojuego. Permite consultar los distintos encantamientos disponibles, buscar por nombre, filtrarlos por categoría y acceder a una página de detalle con información de cada uno. Viene con una IA implementada, llamada Melina, la cual brinda imformación sobre estos encantamientos en cualquier contexto.

## API elegida
Se utilizó la API **Elden Ring Fan API** para obtener información sobre los encantamientos.

- API: [Elden Ring Fan API](https://eldenring.fanapis.com/)
- Endpoint utilizado: `https://eldenring.fanapis.com/api/incantations`

## Tecnologías utilizadas
- Vue
- JavaScript
- HTML5
- CSS3
- Bootstrap 5
- Firebase
- IA (openrouter)

## Instalación y ejecución

### Requisitos previos
- Node.js (versión LTS)
- pnpm

### Pasos para instalar el proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/valennnfl/SacredArts-Vue.git
   ```

2. Ingresar a la carpeta del proyecto:

   ```bash
   cd sacredarts-vue
   ```

3. Instalar las dependencias:

   ```bash
   pnpm install
   ```

4. Configurar las variables de entorno (ver sección siguiente).

5. Ejecutar el proyecto en modo desarrollo:

   ```bash
   pnpm run dev
   ```

6. Abrir en el navegador la dirección local que proporciona Vite, generalmente:

   `http://localhost:5173/`

## Variables de entorno

Para configurar las variables de entorno, crear un archivo .env en la raíz del proyecto.

Completar las variables necesarias según la configuración de Firebase:

```
VITE_FIREBASE_API_KEY=AIzaSyDiYxeupYViNc9HYMpE8avH0pWoPJ8U6Ec
VITE_FIREBASE_AUTH_DOMAIN=sacredartsvue.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sacredartsvue
VITE_FIREBASE_STORAGE_BUCKET=sacredartsvue.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=423533641562
VITE_FIREBASE_APP_ID=1:423533641562:web:e40f981cdb1d82c5027d63
```

## URL pública de Firebase

`https://sacredartsvue.web.app/`

## Inteligencia Artificial

Opción de IA elegida: `https://openrouter.ai/es/nvidia/nemotron-3-ultra-550b-a55b:free`

## Capturas de pantalla

### Versión de escritorio

![Captura del inicio](img/capturas/ss-inicio.png)
![Captura de la IA](img/capturas/ss-ia.png)
![Captura del detalle](img/capturas/ss-detalle.png)
![Captura de guardados](img/capturas/ss-guardados.png)
![Captura del 404](img/capturas/ss-404.png)

### Versión móvil

![Captura del inicio](img/capturas/ss-m-inicio.png)
![Captura de la IA](img/capturas/ss-m-ia.png)
![Captura del detalle](img/capturas/ss-m-detalle.png)
![Captura de guardados](img/capturas/ss-m-guardados.png)
![Captura del 404](img/capturas/ss-m-404.png)