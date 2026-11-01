# Duna Azul — landing page

Landing bilingüe (ES/EN) de la casa de playa **Duna Azul** en Punta Negra. Es un sitio estático (HTML, CSS y JS sin dependencias ni build), listo para GitHub Pages.

```
index.html
css/styles.css
js/main.js          ← aquí está CONFIG
assets/img/         ← fotos WebP (grande + -sm de 800 px) y og-duna-azul.jpg
assets/favicon.svg
.nojekyll
```

## Publicar en GitHub Pages (5 pasos)

1. Crea un repositorio nuevo en GitHub (por ejemplo `duna-azul`).
2. Sube el contenido de esta carpeta a la rama `main`: `index.html`, `css/`, `js/`, `assets/`, `.nojekyll` y este README. (El `.gitignore` deja fuera las fotos originales sin optimizar de la raíz.)
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, elige **Source: Deploy from a branch**, luego **Branch: `main`** y carpeta **`/ (root)`**, y pulsa **Save**.
5. Espera uno o dos minutos y abre `https://TU-USUARIO.github.io/duna-azul/`. Después, en `index.html`, cambia `og:url`, `og:image` y `twitter:image` por URLs absolutas con esa dirección, para que la vista previa funcione al compartir en WhatsApp o redes.

## Llenar `CONFIG` (arriba de `js/main.js`)

| Campo | Qué poner | Si está vacío |
|---|---|---|
| `airbnbUrl` | Link del anuncio de Airbnb. Lo usan todos los botones de reserva. | — |
| `tiktokUrl` | `"https://www.tiktok.com/@dunaazul.pe"` | Se oculta el enlace a TikTok |
| `houseTour` | `{ type: "mp4", src: "assets/video/tour.mp4" }`, `{ type: "youtube", src: "ID_DEL_VIDEO" }` o `{ type: "tiktok", src: "ID_DEL_VIDEO" }` | Estado "Grabando · muy pronto" y slideshow de fotos en el hero |
| `polycam.sala`, `cocina`, `dormitorio1`, `dormitorio2`, `dormitorio3`, `terraza` | URL de *embed* de Polycam de cada espacio | Chip "360° muy pronto" |
| `hostPhoto` | `"assets/img/manuel.webp"` (cuadrada, mín. 320 px) | Círculo con la "M" |
| `priceFrom` | `"1,400"` (soles, aprox., por 2 noches) | — |

Con `type: "mp4"`, el mismo video también se reproduce en silencio y en bucle en la tarjeta pequeña del hero.

## Pendientes por confirmar

Busca `[CONFIRMAR]` en `index.html`:

- Si se incluyen o no **toallas** y artículos básicos de baño (aparece en "No incluye" y en la FAQ).
- Política de **fumar** (Airbnb dice "apto para fumadores"; ¿solo en exteriores?). Hoy no se muestra.
- **Velocidad del Starlink** en Mbps para la FAQ de trabajo remoto.

## Textos

El español está escrito en `index.html`; el inglés está en el objeto `I18N.en` de `js/main.js`, con la misma clave que el atributo `data-i18n` del elemento.
