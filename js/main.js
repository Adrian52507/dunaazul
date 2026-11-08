/* =========================================================
   Duna Azul — main.js
   Edita solo CONFIG para completar enlaces, video, 360 y foto.
   ========================================================= */
const CONFIG = {
  airbnbUrl: "https://www.airbnb.com/h/dunaazul",
  tiktokUrl: "https://www.tiktok.com/@dunaazul.pe",  // si está vacío, se oculta el enlace
  houseTour: {              // type: "mp4" | "youtube" | "tiktok"; src: ruta o ID. Vacío = estado "próximamente"
    type: "mp4",
    src: "assets/video/house-tour.mp4",        // 1080p con audio (sección "Recorre la casa")
    mini: "assets/video/house-tour-mini.mp4",  // 640px sin audio (tarjeta del hero)
  },
  polycam: {                // URL de embed de Polycam por espacio. Vacío = estado "próximamente"
    sala: "", cocina: "",
    dormitorio1: "walk.html?m=assets/3d/principal.glb&s=2",
    dormitorio2: "walk.html?m=assets/3d/camarotes.glb&s=0",   // recorrido propio (antes: embed de Polycam 88C37879-…)
    dormitorio3: "walk.html?m=assets/3d/tercer.glb&s=2",
    terraza: ""
  },
  hostPhoto: "assets/img/manuel.webp",  // vacío = círculo con la inicial "M"
  priceFrom: "1,400",       // soles, aprox., por 2 noches
};

(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width: 861px)");

  /* ---------- Datos ---------- */

  // [ancho, alto] de la versión grande y de la -sm
  const IMG = {
    "piscina-noche": [1672, 941, 800, 533],
    "piscina-vista-mar": [1200, 900, 1000, 750],
    "piscina-dia": [1200, 800, 1000, 667],
    "terraza-parrilla": [720, 540, 720, 540],
    "vista-bahia": [1440, 1080, 1000, 750],
    "bano-01": [1536, 2048, 750, 1000],
    "bano-02": [1536, 2048, 750, 1000],
    "dormitorio-camarote": [1536, 2048, 750, 1000],
  };
  const dims = (n) => IMG[n] || [2048, 1536, 1000, 750];
  const srcset = (n) => {
    const [bw, , sw] = dims(n);
    return bw === sw ? `assets/img/${n}-sm.webp ${sw}w` : `assets/img/${n}-sm.webp ${sw}w, assets/img/${n}.webp ${bw}w`;
  };

  const GALLERY = [
    { n: "piscina-noche", c: "ext", es: "Piscina iluminada de noche frente a la casa", en: "Pool lit up at night in front of the house" },
    { n: "piscina-vista-mar", c: "ext", es: "Piscina con baranda de madera y vista a la bahía", en: "Pool with a wooden railing overlooking the bay" },
    { n: "sala-vista", c: "sala", es: "Sala con sofás y ventanales hacia el balcón y el mar", en: "Living room with sofas and windows facing the balcony and the sea" },
    { n: "piscina-dia", c: "ext", es: "Piscina de día con la casa y la pérgola de madera al fondo", en: "The pool by day, with the house and wooden pergola behind" },
    { n: "sala", c: "sala", es: "Sala con TV, repisas de madera y mesa de centro", en: "Living room with TV, wooden shelves and coffee table" },
    { n: "terraza-parrilla", c: "ext", es: "Terraza con parrilla, horno de ladrillo y pérgola junto a la piscina", en: "Terrace with grill, brick oven and pergola by the pool" },
    { n: "cocina", c: "sala", es: "Cocina con barra de madera, bancos y refrigeradora de acero", en: "Kitchen with wooden bar, stools and steel fridge" },
    { n: "comedor", c: "sala", es: "Comedor para seis con salida a la terraza", en: "Dining table for six opening onto the terrace" },
    { n: "sala-comedor-cocina", c: "sala", es: "Ambiente abierto de sala, comedor y cocina con vista al mar", en: "Open-plan living, dining and kitchen with a sea view" },
    { n: "dormitorio-principal", c: "dorm", es: "Dormitorio principal con cama matrimonial, sofá cama y ventana amplia", en: "Main bedroom with double bed, sofa bed and large window" },
    { n: "balcon-dunas", c: "ext", es: "Balcón con baranda de madera frente a las dunas", en: "Balcony with wooden railing facing the dunes" },
    { n: "fachada-atardecer", c: "ext", es: "Fachada blanca y escalera de ingreso al atardecer", en: "White façade and entrance stairs at sunset" },
    { n: "fachada-dunas", c: "ext", es: "La casa vista desde las dunas, entre plantas del desierto", en: "The house seen from the dunes, among desert plants" },
    { n: "vista-bahia", c: "ext", es: "Vista de la bahía de Punta Negra y el mar desde la casa", en: "View of Punta Negra bay and the sea from the house" },
    { n: "dormitorio-camarotes-02", c: "dorm", es: "Dormitorio con dos camarotes de madera", en: "Bedroom with two wooden bunk beds" },
    { n: "dormitorio-camarotes-01", c: "dorm", es: "Dormitorio de camarotes con amplio espacio", en: "Bunk room with plenty of space" },
    { n: "dormitorio-camarote", c: "dorm", big: true, es: "Dormitorio con un camarote de madera", en: "Bedroom with a wooden bunk bed" },
    { n: "bano-espejo-led", c: "bano", es: "Baño con espejo iluminado LED y lavatorio de cerámica", en: "Bathroom with LED-lit mirror and ceramic basin" },
    { n: "bano-01", c: "bano", tall: true, es: "Baño con ducha, lavatorio sobre encimera y ventana", en: "Bathroom with shower, countertop basin and window" },
    { n: "bano-02", c: "bano", tall: true, es: "Baño con ducha y lavatorio de cerámica blanca", en: "Bathroom with shower and white ceramic basin" },
  ];

  const SPACES = [
    { key: "sala", img: "sala-comedor-cocina",
      es: ["Sala y comedor", "Un solo ambiente abierto: sala, comedor para seis y ventanales hacia el mar."],
      en: ["Living & dining", "One open space: living room, dining table for six and windows facing the sea."] },
    { key: "cocina", img: "cocina",
      es: ["Cocina", "Equipada con barra, horno, microondas y todo lo necesario para cocinar en grupo."],
      en: ["Kitchen", "Fitted with a bar, oven, microwave and everything you need to cook for a group."] },
    { key: "dormitorio1", img: "dormitorio-principal",
      es: ["Dormitorio principal", "<strong>1 cama matrimonial + 1 sofá cama.</strong> Ventana amplia y ventilador."],
      en: ["Main bedroom", "<strong>1 double bed + 1 sofa bed.</strong> Large window and a fan."] },
    { key: "dormitorio2", img: "dormitorio-camarotes-02",
      es: ["Dormitorio de camarotes", "<strong>2 camarotes.</strong> Ideal para chicos o grupos de amigos."],
      en: ["Bunk room", "<strong>2 bunk beds.</strong> Great for kids or groups of friends."] },
    { key: "dormitorio3", img: "dormitorio-camarote", pos: "50% 45%",
      es: ["Tercer dormitorio", "<strong>1 camarote.</strong>"],
      en: ["Third bedroom", "<strong>1 bunk bed.</strong>"] },
    { key: "terraza", img: "piscina-dia",
      es: ["Terraza y piscina", "Piscina privada con catarata, terraza con parrilla y horno, y tumbonas para la tarde."],
      en: ["Terrace & pool", "Private pool with a waterfall, a terrace with grill and oven, and loungers for the afternoon."] },
  ];

  // Reseñas anónimas, siempre en su idioma original
  const REVIEWS = [
    { m: 7, y: 2026, trip: "pet", lang: "es", text: "La casa tiene todo lo que necesitas para cocinar, hacer tu parrilla y limpiar. La zona tiene vigilancia y se siente súper seguro, solo entran personas autorizadas. Es super silencioso, es perfecto si quieres descansar. El clima es agradable, no hace frío en las noches solo corre viento. En conclusión nos encantó quedarnos en esta casa, es súper espaciosa y tranquila." },
    { m: 5, y: 2026, trip: "pet", lang: "es", text: "Todo excelente, siempre estuvieron atentos desde la llegada y todo lo q pudiéramos necesitar o consultar, muy higiénica toda la casa, la pasamos muy bien con mi familia, lugar muy tranquilo." },
    { m: 4, y: 2026, trip: "pet", lang: "en", text: "This house is highly recommended if you want a relaxed getaway with the family. Well equipped, lots of beds, big rooms, pool area amazing! Highly recommended! Definitely returning." },
    { m: 4, y: 2026, trip: "pet", lang: "es", text: "Nos encantó a todos la casa, la pasamos súper bien. Disfrutamos las estancias de la casa ya que son muy cómodas. Las respuestas de los anfitriones fueron inmediatas. 😉 La casa contenía todo lo que se necesita para una estancia, cumplía con todo lo indicado en la reseña." },
    { m: 3, y: 2026, trip: "pet", lang: "es", text: "La casa está muy bien cuidada con todos los utensilios y artefactos necesarios para una buena estadía, las habitaciones y los colchones eran cómodas, además de contar con ventiladores. Pudimos llegar rápidamente por las instrucciones recibidas y siempre tuvimos comunicación fluida con el anfitrión." },
    { m: 3, y: 2026, trip: "pet", lang: "es", text: "Excelente lugar para relajarse y pasarla en familia. Todo muy organizado, ordenado y completo. Estoy seguro que volveré a alquilar la casa. Manuel siempre atento en todo momento." },
    { m: 2, y: 2026, trip: "group", lang: "es", text: "Nuestra estadía fue muy grata. La casa se encuentra bien equipada, en una ubicación conveniente y con un entorno tranquilo que permite disfrutar en grupo. La comunicación con el anfitrión fue cordial y oportuna, lo que facilitó la coordinación en todo momento. Recomendable." },
    { m: 2, y: 2026, trip: "pet", lang: "es", text: "Todo estuvo muy bien en la casa, mi familia y yo la pasamos a gusto, si volveríamos a reservar en el futuro." },
    { m: 2, y: 2026, trip: "group", lang: "es", text: "La casa muy impecable desde la entrega, el anfitrión siempre respondía a cualquier hora y fue muy amable. Quiero regresar pronto ☺️" },
    { m: 1, y: 2026, trip: "group", lang: "es", text: "La casa estaba muy bonita, tal cual se muestra en las fotos. Todo estaba ordenado, limpio y el espacio fue cómodo para la estadía. El anfitrión siempre estuvo atento y a disposición ante cualquier consulta." },
    { m: 1, y: 2026, trip: "group", lang: "es", text: "La casa es muy bonita, cómoda y tal como se muestra en las fotos. Los espacios son agradables, bien cuidados y permiten descansar realmente bien. El condominio es súper seguro, lo cual nos dio mucha tranquilidad durante toda la estadía. Todo estuvo en orden y la experiencia fue excelente. Sin duda volvería y lo recomiendo totalmente." },
  ];

  const MONTHS = {
    es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };

  /* ---------- Textos ----------
     El español vive en el HTML; aquí va el inglés (y los textos que arma el JS en ambos idiomas). */
  const I18N = {
    es: {
      "doc.title": "Duna Azul · Casa de playa con piscina y vista al mar en Punta Negra",
      "nav.open": "Abrir menú", "nav.close": "Cerrar menú",
      "tc.soon": "House tour<br>muy pronto", "tc.video": "Recorre<br>la casa",
      "player.soon": "Grabando · muy pronto", "player.follow": "Síguenos en TikTok", "player.play": "Reproducir el house tour",
      "t360.btn": "Ver en 360°", "t360.soon": "360° muy pronto", "t360.frame": "Recorrido 360°",
      "rev.verified": "Huésped verificado de Airbnb", "rev.more": "Leer más", "rev.less": "Leer menos", "rev.stars": "5 de 5 estrellas",
      "trip.pet": "Con mascota", "trip.group": "En grupo",
    },
    en: {
      "doc.title": "Duna Azul · Beach house with pool and ocean view in Punta Negra",
      "a11y.skip": "Skip to content", "a11y.nav": "Main", "a11y.menu": "Menu",
      "nav.home": "Home", "nav.house": "The house", "nav.tour360": "360 tour", "nav.reviews": "Reviews", "nav.info": "Info",
      "nav.open": "Open menu", "nav.close": "Close menu",
      "cta.reserve": "Book",
      "alt.heroImg": "The house and its pool lit up at night",
      "hero.eyebrow": "Punta Negra · Lima · Peru",
      "hero.tagline": "Your ocean-view oasis,<br>one hour from Lima.",
      "hero.trust": "5.0 · 11 reviews · Superhost · Guest favorite",
      "hero.see": "See the house",
      "tc.aria": "Go to the house tour", "tc.bars": "Tour parts",
      "tc.soon": "House tour<br>coming soon", "tc.video": "Take<br>the tour",
      "facts.aria": "The house in numbers",
      "facts.guests": "Guests", "facts.beds": "Bedrooms", "facts.baths": "Bathrooms", "facts.wifi": "Satellite Wi-Fi", "facts.lima": "From Lima · km 44.5 Panamericana Sur",
      "casa.t1": "AN", "casa.t2": "OASIS", "casa.t3": "up high",
      "casa.lead": "Drop your bags — the pool is already waiting. The beach is a 10-minute drive; the calm is right here.",
      "casa.c1t": "Pool overlooking the bay", "casa.c1d": "With a waterfall and night lighting.", "alt.c1": "Pool overlooking Punta Negra bay at sunset",
      "casa.c2t": "Living room open to the view", "casa.c2d": "Floor-to-ceiling windows.",
      "casa.c3t": "Grill and oven by the water", "casa.c3d": "End the day outdoors.",
      "tour.title": "Take the tour", "tour.sub": "A one-minute walk through every corner.",
      "player.soon": "Filming · coming soon", "player.follow": "Follow us on TikTok", "player.play": "Play the house tour",
      "t360.title": "Step into every room", "t360.sub": "Look around in 360°, as if you were already there.", "t360.tabs": "Spaces",
      "t360.btn": "View in 360°", "t360.soon": "360° coming soon", "t360.frame": "360° tour",
      "gal.title": "Gallery", "gal.filter": "Filter photos", "gal.all": "All", "gal.ext": "Outdoors", "gal.sala": "Living & kitchen", "gal.dorm": "Bedrooms", "gal.bano": "Bathrooms",
      "dorm.title": "Bedrooms & beds",
      "dorm.d1": "Main bedroom", "dorm.d1b": "1 double bed + 1 sofa bed",
      "dorm.d2": "Bunk room", "dorm.d2b": "2 bunk beds",
      "dorm.d3": "Third bedroom", "dorm.d3b": "1 bunk bed",
      "dorm.foot": "Up to 9 guests · 4 bathrooms",
      "inc.title": "What's included and what's not", "inc.yes": "Included",
      "inc.g1": "Outdoors",
      "inc.g1.1": "Private pool with waterfall and lighting", "inc.g1.2": "Terrace with grill and oven", "inc.g1.3": "Grill tools and fuel",
      "inc.g1.4": "Outdoor dining area", "inc.g1.5": "Sun loungers", "inc.g1.6": "Outdoor shower", "inc.g1.7": "Garage for about 3 cars + 1 extra spot next to the house",
      "inc.g2": "Kitchen",
      "inc.g2.1": "Fridge and freezer", "inc.g2.2": "Microwave and oven", "inc.g2.3": "Kettle, coffee maker and coffee", "inc.g2.4": "Blender and rice cooker",
      "inc.g2.5": "Pots and pans", "inc.g2.7": "Dishes and wine glasses", "inc.g2.8": "Baking sheet", "inc.g2.9": "Dining table",
      "inc.g3": "Rest",
      "inc.g3.1": "Bed linen", "inc.g3.2": "Extra pillows and blankets", "inc.g3.3": "Blackout curtains", "inc.g3.4": "Clothing storage", "inc.g3.5": "Portable fans",
      "inc.g4": "Bathroom",
      "inc.g4.1": "Hot water", "inc.g4.2": "Body soap", "inc.g4.3": "Hair dryer",
      "inc.g5": "Entertainment & connection",
      "inc.g5.1": "Starlink satellite Wi-Fi", "inc.g5.2": "TV", "inc.g5.3": "Sound system", "inc.g5.4": "Ping pong table (in the garage)", "inc.g5.5": "Board games",
      "inc.g5.6": "Beer pong kit", "inc.g5.6tip": "Red party cups and balls, <strong>under the main TV</strong>.", "inc.g5.6tipAria": "Where is the beer pong kit?",
      "inc.g6": "Safety",
      "inc.g6.1": "Gated community with 24/7 security", "inc.g6.2": "Cameras only at the outside entrance (none inside the house)", "inc.g6.3": "First aid kit",
      "inc.g7": "Water",
      "inc.g7.1": "A full water tank (9 m³), enough for a normal stay",
      "inc.g7.tip": "For reference, one person uses on average <strong>150 to 200 litres of water a day</strong>.", "inc.g7.tipAria": "More about water use",
      "inc.no": "Not included",
      "inc.no1": "Washer or dryer", "inc.no2": "Air conditioning (fans are provided)",
      "inc.no4": "Water use beyond the included tank (paid by the guest)", "inc.no5": "Pool heating (outside summer, the water is cold)",
      "rules.title": "House rules",
      "rules.r1": "Check-in from 3:00 p.m. · Check-out by 11:00 a.m. <strong>Need different times?</strong> Message us and we'll work it out, subject to availability.",
      "rules.r2": "<strong>2-night minimum.</strong>",
      "rules.r3": "Up to 9 guests.",
      "rules.r4": "1 small-sized pet, always supervised. What matters is size, not breed.",
      "rules.r5": "<strong>Guest list:</strong> the community only lets in people on the list sent to the host, so please send it complete before you arrive.",
      "rules.r6": "Community quiet hours: 12:30 a.m. to 8:30 a.m. on weekdays and 2:00 a.m. to 8:30 a.m. on weekends. <strong>It's not total silence:</strong> you can keep chatting and playing music, just at a moderate volume.",
      "rules.r7": "<strong>Get-togethers and celebrations are welcome.</strong> We just ask you to avoid large events or noise that leads neighbours to complain; any community fines are passed on to the guest.",
      "rules.r8": "Please don't touch the pool machine room. The waterfall runs on a set schedule; for other times, check with the host.",
      "rules.r9": "Photos and filming only within the house's lot, not in common areas or at neighboring houses.",
      "rules.r10": "Smoking is allowed, preferably in the outdoor areas.",
      "rev.srTitle": " out of 5 on Airbnb", "rev.meta": "11 reviews · Guest favorite",
      "rev.c1": "Cleanliness", "rev.c2": "Accuracy", "rev.c3": "Check-in", "rev.c4": "Communication", "rev.c5": "Location", "rev.c6": "Value",
      "rev.prev": "Previous review", "rev.next": "Next review", "rev.list": "Reviews",
      "rev.all": "See all reviews on Airbnb",
      "rev.verified": "Verified Airbnb guest", "rev.more": "Read more", "rev.less": "Read less", "rev.stars": "5 out of 5 stars",
      "trip.pet": "With a pet", "trip.group": "Group trip",
      "host.kicker": "Your host", "host.badge": "Superhost",
      "host.text": "I'm Manuel, an independent consultant who loves good energy. My beach house is designed for you to disconnect, rest and enjoy the sea in total comfort and calm — just the way I like to.",
      "host.s1": "100% response rate", "host.s2": "Responds within a few hours",
      "host.note": "The property manager lives nearby in case anything comes up.",
      "loc.title": "Location", "loc.mapTitle": "Map: Mar y Bosques community, Punta Negra",
      "loc.l1": "Mar y Bosques gated community, km 44.5 of the Panamericana Sur, Punta Negra.",
      "loc.l2": "About 1 hour from Lima (depending on traffic).",
      "loc.l3": "The beach is across the highway: about a 10-minute drive. Walking there isn't practical.",
      "loc.l4": "Punta Hermosa and San Bartolo are a few minutes away by car.",
      "loc.cap": "Punta Negra bay from the house",
      "price.big": "From approx. S/ <span class=\"js-price\"></span> for 2 nights",
      "price.small": "2-night minimum. The price varies between weekdays and weekends; the final rate and availability are confirmed on Airbnb.",
      "price.cta": "See dates and book on Airbnb",
      "price.trust": "Secure payment and AirCover protection through Airbnb.",
      "faq.title": "Frequently asked questions",
      "faq.q1": "How do I book?", "faq.a1": "Only through Airbnb, using the button on this page. There you'll see dates, the final price and the cancellation policy.",
      "faq.q2": "What's the minimum stay?", "faq.a2": "2 nights.",
      "faq.q3": "Can I bring my pet?", "faq.a3": "Yes, 1 small-sized pet (any breed).",
      "faq.q4": "Is the pool heated?", "faq.a4": "No. In summer the water is lovely; in winter, it's cold.",
      "faq.q5": "How far is the beach?", "faq.a5": "About a 10-minute drive, across the Panamericana.",
      "faq.q6": "Can I work from the house?", "faq.a6": "Yes: there's Starlink satellite Wi-Fi and a large dining table.",
      "faq.q7": "Do I need to say who's coming?", "faq.a7": "Yes. The community only lets in people on the list sent to the host.",
      "faq.q8": "Are parties allowed?", "faq.a8": "Yes! You can celebrate and get together with music. Large events and noise that bothers the neighbours aren't allowed, and during the community's quiet hours please turn the volume down.",
      "faq.q9": "Is there parking?", "faq.a9": "Yes. The house has a garage for about 3 cars, plus room to park 1 more next to the house, free of charge.",
      "mcta.from": "From S/ <span class=\"js-price\"></span> · 2 nights",
      "lb.aria": "Enlarged photo", "lb.close": "Close", "lb.prev": "Previous photo", "lb.next": "Next photo",
    },
  };
  // Los alt de la galería se reutilizan en otras secciones (alt.g1 … alt.g20)
  GALLERY.forEach((g, i) => { I18N.en["alt.g" + (i + 1)] = g.en; });

  /* ---------- Idioma ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
  };
  let lang = store.get("duna-lang") === "en" ? "en" : "es";
  const t = (key) => (I18N[lang][key] ?? I18N.es[key] ?? "");

  const ORIG = new WeakMap();
  const ATTRS = [["i18nAlt", "alt"], ["i18nAria", "aria-label"], ["i18nTitle", "title"]];
  function cacheOriginals() {
    $$("[data-i18n]").forEach((el) => ORIG.set(el, { html: el.innerHTML }));
    $$("[data-i18n-alt],[data-i18n-aria],[data-i18n-title]").forEach((el) => {
      const o = ORIG.get(el) || {};
      ATTRS.forEach(([ds, attr]) => { if (el.dataset[ds]) o[attr] = el.getAttribute(attr); });
      ORIG.set(el, o);
    });
  }

  // Envuelve cada palabra en <span class="w"> con su retraso
  function wrapWords(el, settled) {
    const start = parseFloat(el.dataset.start || 0);
    const step = parseFloat(el.dataset.step || 0.08);
    const dur = parseFloat(el.dataset.dur || 0.9);
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const s = document.createElement("span");
            s.className = settled ? "w st" : "w";
            s.textContent = part;
            s.style.setProperty("--delay", (start + i * step).toFixed(2) + "s");
            s.style.setProperty("--dur", dur + "s");
            i++;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains("w")) {
          walk(n);
        }
      });
    };
    walk(el);
  }

  function applyLang(initial) {
    document.documentElement.lang = lang;
    document.title = t("doc.title");

    $$("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const html = lang === "en" ? I18N.en[key] : (I18N.es[key] ?? (ORIG.get(el) || {}).html);
      if (html == null) return;
      el.innerHTML = html;
      if (el.hasAttribute("data-words") && !initial) wrapWords(el, true);
    });
    $$("[data-i18n-alt],[data-i18n-aria],[data-i18n-title]").forEach((el) => {
      ATTRS.forEach(([ds, attr]) => {
        const key = el.dataset[ds];
        if (!key) return;
        const v = lang === "en" ? I18N.en[key] : (I18N.es[key] ?? (ORIG.get(el) || {})[attr]);
        if (v != null) el.setAttribute(attr, v);
      });
    });
    $$("[data-num]").forEach((el) => {
      el.textContent = lang === "es" ? el.dataset.num.replace(".", ",") : el.dataset.num;
    });
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $$(".js-price").forEach((el) => { el.textContent = CONFIG.priceFrom; });

    const burger = $(".burger");
    if (burger) burger.setAttribute("aria-label", t(burger.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"));

    if (!initial) {
      renderPlayer(false);
      renderSpaces();
      updateGalleryText();
      renderReviews();
    }
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    store.set("duna-lang", lang);
    applyLang(false);
  }

  /* ---------- Enlaces y datos de CONFIG ---------- */
  function applyConfig() {
    $$("[data-airbnb]").forEach((a) => {
      a.href = CONFIG.airbnbUrl;
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-tiktok]").forEach((li) => {
      if (!CONFIG.tiktokUrl) return;
      li.hidden = false;
      const a = li.querySelector("a");
      a.href = CONFIG.tiktokUrl;
    });
    if (CONFIG.hostPhoto) {
      $("#hostPhoto").innerHTML = `<img src="${CONFIG.hostPhoto}" width="160" height="160" alt="Manuel" loading="lazy" decoding="async">`;
    }
    const tcCap = $("#tcCap");
    if (tcCap && CONFIG.houseTour.type && CONFIG.houseTour.src) tcCap.dataset.i18n = "tc.video";
  }

  /* ---------- Header ---------- */
  function initHeader() {
    const header = $("#siteHeader");
    const burger = $(".burger");
    const menu = $("#mnav");

    const setMenu = (open) => {
      menu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
    };
    burger.addEventListener("click", () => setMenu(menu.hidden));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (!menu.hidden && !header.contains(e.target)) setMenu(false);
    });
    isDesktop.addEventListener?.("change", () => setMenu(false));

    $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  }

  /* ---------- Scroll: header sólido, parallax, CTA móvil ---------- */
  function initScroll() {
    const header = $("#siteHeader");
    const hero = $(".hero");
    const media = $("#heroMedia");
    const price = $("#reservar");
    const mcta = $("#mcta");
    const mctaLink = $(".mcta-btn");
    let ticking = false;
    let ctaShown = false;

    // Scroll-spy: marca la pastilla de la sección en pantalla.
    // Las secciones intermedias (galería, dormitorios, reglas…) heredan la pastilla anterior en el orden de la página.
    const pills = [...document.querySelectorAll(".nav-pills .pill")]
      .map((a) => ({ a, sec: document.querySelector(a.getAttribute("href")) }))
      .filter((p) => p.sec);
    let activePill = null;
    const spy = () => {
      const line = window.innerHeight * 0.35;
      let cur = pills[0];
      let best = -Infinity;
      for (const p of pills) {
        const top = p.sec.getBoundingClientRect().top;
        if (top <= line && top > best) { best = top; cur = p; }
      }
      if (cur === activePill) return;
      activePill = cur;
      for (const p of pills) {
        const on = p === cur;
        p.a.classList.toggle("is-active", on);
        if (on) p.a.setAttribute("aria-current", "true"); else p.a.removeAttribute("aria-current");
      }
    };

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const h = hero.offsetHeight;
      spy();

      header.classList.toggle("is-solid", y > h - header.offsetHeight);

      if (!reduceMotion && y <= h) {
        media.style.transform = `translate3d(0, ${(y * 0.08).toFixed(1)}px, 0)`;
      }

      const show = y > h * 0.85 && price.getBoundingClientRect().top > window.innerHeight;
      if (show !== ctaShown) {
        ctaShown = show;
        mcta.classList.toggle("show", show);
        mcta.setAttribute("aria-hidden", String(!show));
        mctaLink.tabIndex = show ? 0 : -1;
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Revelado al entrar en pantalla ---------- */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("go"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        // threshold .15, o bastante visible en secciones más altas que la pantalla
        if (en.intersectionRatio >= 0.15 || en.intersectionRect.height > window.innerHeight * 0.3) {
          en.target.classList.add("go");
          io.unobserve(en.target);
        }
      });
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.3] });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Tarjeta del hero: video o slideshow ---------- */
  function initTourCard() {
    const box = $("#tcBox");
    const bars = $$("#tcBars button");
    const setBar = (i) => bars.forEach((b, j) => b.classList.toggle("on", i === j));
    $("#tourCard .tc-link").addEventListener("click", (e) => {
      e.preventDefault();
      $("#tour").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });

    if (CONFIG.houseTour.type === "mp4" && CONFIG.houseTour.src) {
      box.innerHTML = "";
      const v = document.createElement("video");
      v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
      v.preload = "auto";
      v.poster = "assets/img/piscina-dia-sm.webp";
      v.src = CONFIG.houseTour.mini || CONFIG.houseTour.src;
      box.appendChild(v);

      // Que no se detenga nunca
      const play = () => { if (!document.hidden) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } };
      ["pause", "ended", "stalled"].forEach((ev) => v.addEventListener(ev, () => setTimeout(play, 60)));
      setInterval(() => { if (v.paused) play(); }, 1000);
      document.addEventListener("visibilitychange", play);
      ["pointerdown", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, play, { once: true, passive: true }));
      play();

      v.addEventListener("timeupdate", () => {
        if (!v.duration) return;
        setBar(Math.min(3, Math.floor((v.currentTime / v.duration) * 4)));
      });
      bars.forEach((b, i) => b.addEventListener("click", () => {
        if (v.duration) v.currentTime = (v.duration * i) / 4 + 0.05;
        setBar(i);
      }));
      return;
    }

    // Slideshow de 4 fotos
    const names = ["piscina-dia", "sala-vista", "terraza-parrilla", "dormitorio-principal"];
    box.innerHTML = names.map((n, i) => {
      const [, , w, h] = dims(n);
      return `<img class="tc-slide${i === 0 ? " on zoom" : ""}" src="assets/img/${n}-sm.webp" width="${w}" height="${h}" alt="" decoding="async"${i ? ' loading="lazy"' : ""}>`;
    }).join("");
    const slides = $$(".tc-slide", box);
    let cur = 0;
    let timer = null;
    const go = (i) => {
      slides[cur].classList.remove("on");
      const prev = slides[cur];
      setTimeout(() => prev.classList.remove("zoom"), 1300);
      cur = (i + slides.length) % slides.length;
      const s = slides[cur];
      s.classList.remove("zoom"); void s.offsetWidth; // reinicia el zoom
      s.classList.add("on", "zoom");
      setBar(cur);
    };
    const start = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => go(cur + 1), 4000); };
    bars.forEach((b, i) => b.addEventListener("click", () => { go(i); start(); }));
    document.addEventListener("visibilitychange", () => { if (document.hidden) clearInterval(timer); else start(); });
    setTimeout(start, 2200);
  }

  /* ---------- House tour ---------- */
  let playerStarted = false;
  function renderPlayer(force) {
    const el = $("#player");
    if (playerStarted && !force) return;
    const { type, src } = CONFIG.houseTour;
    const poster = `<img src="assets/img/piscina-noche-sm.webp" srcset="${srcset("piscina-noche")}" sizes="(max-width: 1360px) 100vw, 1300px" width="1672" height="941" alt="" loading="lazy" decoding="async">`;
    el.classList.toggle("is-vertical", type === "tiktok");

    if (type === "mp4" && src) {
      el.innerHTML = `<video controls playsinline preload="metadata" poster="assets/img/piscina-noche.webp" src="${src}" title="House tour"></video>`;
      playerStarted = true;
      return;
    }
    if ((type === "youtube" || type === "tiktok") && src) {
      el.innerHTML = `<button type="button" class="poster" aria-label="${t("player.play")}">${poster}<span class="play"><svg class="ic" aria-hidden="true"><use href="#i-play"/></svg></span></button>`;
      $(".poster", el).addEventListener("click", () => {
        playerStarted = true;
        const url = type === "youtube"
          ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(src)}?autoplay=1&rel=0`
          : `https://www.tiktok.com/embed/v2/${encodeURIComponent(src)}`;
        el.innerHTML = `<iframe src="${url}" title="House tour" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
        $("iframe", el).focus();
      });
      return;
    }
    // Próximamente
    el.innerHTML = `${poster}<div class="soon-shade"></div><div class="soon">
      <span class="chip-soon"><span class="dot" aria-hidden="true"></span>${t("player.soon")}</span>
      ${CONFIG.tiktokUrl ? `<a class="btn-ghost" href="${CONFIG.tiktokUrl}" target="_blank" rel="noopener"><svg class="ic" width="18" height="18" aria-hidden="true"><use href="#i-music"/></svg>${t("player.follow")}</a>` : ""}
    </div>`;
  }

  /* ---------- Tour 360 ---------- */
  let spaceIdx = 0;
  function renderSpaces() {
    const tabs = $("#t360Tabs");
    tabs.innerHTML = SPACES.map((s, i) =>
      `<button type="button" class="tab" role="tab" id="tab-${s.key}" aria-controls="t360Viewer" aria-selected="${i === spaceIdx}" tabindex="${i === spaceIdx ? 0 : -1}">${s[lang][0]}</button>`
    ).join("");
    renderViewer();
  }
  function renderViewer() {
    const s = SPACES[spaceIdx];
    const v = $("#t360Viewer");
    const url = CONFIG.polycam[s.key];
    const [, , w, h] = dims(s.img);
    v.setAttribute("aria-labelledby", "tab-" + s.key);
    v.innerHTML = `<img src="assets/img/${s.img}-sm.webp" srcset="${srcset(s.img)}" sizes="(max-width: 1360px) 100vw, 1300px" width="${w}" height="${h}"${s.pos ? ` style="object-position: ${s.pos}"` : ""} alt="${GALLERY.find((g) => g.n === s.img)[lang]}" loading="lazy" decoding="async">
      <div class="shade"></div>
      <div class="v-center">${url
        ? `<button type="button" class="btn-360"><span class="ic-wrap"><svg class="ic" width="20" height="20" aria-hidden="true"><use href="#i-360"/></svg></span>${t("t360.btn")}</button>`
        : `<span class="chip-soon"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-360"/></svg>${t("t360.soon")}</span>`}</div>`;
    if (url) {
      $(".btn-360", v).addEventListener("click", () => {
        v.innerHTML = `<iframe src="${url}" title="${t("t360.frame")} — ${s[lang][0]}" allow="fullscreen; xr-spatial-tracking" allowfullscreen loading="lazy"></iframe>`;
      });
    }
    $("#t360Desc").innerHTML = s[lang][1];
  }
  function initSpaces() {
    renderSpaces();
    const tabs = $("#t360Tabs");
    const select = (i, focus) => {
      spaceIdx = (i + SPACES.length) % SPACES.length;
      $$(".tab", tabs).forEach((b, j) => {
        b.setAttribute("aria-selected", String(j === spaceIdx));
        b.tabIndex = j === spaceIdx ? 0 : -1;
      });
      const btn = $$(".tab", tabs)[spaceIdx];
      if (focus) btn.focus();
      btn.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      renderViewer();
    };
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (b) select($$(".tab", tabs).indexOf(b), false);
    });
    tabs.addEventListener("keydown", (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in map) { e.preventDefault(); select(spaceIdx + map[e.key], true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(SPACES.length - 1, true); }
    });
  }

  /* ---------- Galería + lightbox ---------- */
  let galFilter = "all";
  /* ---------- Botoncitos de información (i) ---------- */
  function initTips() {
    const btns = $$(".tip-btn");
    const close = (b) => { b.setAttribute("aria-expanded", "false"); document.getElementById(b.getAttribute("aria-controls")).hidden = true; };
    btns.forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const open = b.getAttribute("aria-expanded") !== "true";
      btns.forEach(close);
      if (open) { b.setAttribute("aria-expanded", "true"); document.getElementById(b.getAttribute("aria-controls")).hidden = false; }
    }));
    document.addEventListener("click", (e) => { if (!e.target.closest(".tip")) btns.forEach(close); });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const b = btns.find((x) => x.getAttribute("aria-expanded") === "true");
      if (b) { close(b); b.focus(); }
    });
  }

  function initGallery() {
    const grid = $("#galGrid");
    grid.innerHTML = GALLERY.map((g, i) => {
      const [, , w, h] = dims(g.n);
      const cls = i === 0 || g.big ? "big" : g.tall ? "tall" : "";
      const sizes = i === 0 || g.big ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw";
      return `<li class="${cls}" data-c="${g.c}"><button type="button" class="gal-item" data-i="${i}">
        <img src="assets/img/${g.n}-sm.webp" srcset="${srcset(g.n)}" sizes="${sizes}" width="${w}" height="${h}" alt="${g[lang]}" loading="lazy" decoding="async">
      </button></li>`;
    }).join("");

    $$("#galFilters .chip").forEach((chip) => chip.addEventListener("click", () => {
      galFilter = chip.dataset.f;
      $$("#galFilters .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      $$("li", grid).forEach((li) => { li.hidden = galFilter !== "all" && li.dataset.c !== galFilter; });
      grid.classList.toggle("is-filtered", galFilter !== "all"); // con filtro: fotos del mismo tamaño, sin huecos
    }));

    // Lightbox
    const lb = $("#lb");
    const img = $("#lbImg");
    const cap = $("#lbCap");
    const count = $("#lbCount");
    let list = [];
    let pos = 0;
    let lastFocus = null;

    const show = (p) => {
      pos = (p + list.length) % list.length;
      const g = GALLERY[list[pos]];
      const [bw, bh] = dims(g.n);
      img.src = `assets/img/${g.n}.webp`;
      img.width = bw; img.height = bh;
      img.alt = g[lang];
      cap.textContent = g[lang];
      count.textContent = `${pos + 1} / ${list.length}`;
      // precarga de la siguiente
      const nx = GALLERY[list[(pos + 1) % list.length]];
      new Image().src = `assets/img/${nx.n}.webp`;
    };
    const open = (i, from) => {
      list = GALLERY.map((_, j) => j).filter((j) => galFilter === "all" || GALLERY[j].c === galFilter);
      lastFocus = from || document.activeElement;
      lb.hidden = false;
      document.body.classList.add("no-scroll");
      show(list.indexOf(i));
      $(".lb-close", lb).focus();
    };
    const close = () => {
      lb.hidden = true;
      document.body.classList.remove("no-scroll");
      img.removeAttribute("src");
      if (lastFocus) lastFocus.focus();
    };

    grid.addEventListener("click", (e) => {
      const b = e.target.closest(".gal-item");
      if (b) open(+b.dataset.i, b);
    });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(pos - 1));
    $(".lb-next", lb).addEventListener("click", () => show(pos + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-fig")) close(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(pos - 1);
      else if (e.key === "ArrowRight") show(pos + 1);
      else if (e.key === "Tab") {
        const f = $$("button", lb);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let tx = 0, ty = 0;
    lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(pos + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
  function updateGalleryText() {
    $$("#galGrid .gal-item img").forEach((im, i) => { im.alt = GALLERY[i][lang]; });
  }

  /* ---------- Reseñas ---------- */
  function renderReviews() {
    const track = $("#revTrack");
    track.innerHTML = REVIEWS.map((r, i) => `
      <li class="rev-card">
        <p class="stars" role="img" aria-label="${t("rev.stars")}">★★★★★</p>
        <p class="rev-text" id="rev-${i}" lang="${r.lang}">${r.text}</p>
        <button type="button" class="rev-more" aria-expanded="false" aria-controls="rev-${i}" hidden>${t("rev.more")}</button>
        <p class="rev-foot"><b>${t("rev.verified")}</b>${MONTHS[lang][r.m - 1]} ${r.y} · ${t("trip." + r.trip)}</p>
      </li>`).join("");
    checkClamps();
    updateArrows();
  }
  function checkClamps() {
    $$("#revTrack .rev-card").forEach((card) => {
      if (card.classList.contains("open")) return;
      const p = $(".rev-text", card);
      $(".rev-more", card).hidden = p.scrollHeight <= p.clientHeight + 2;
    });
  }
  function updateArrows() {
    const tr = $("#revTrack");
    $(".car-prev").disabled = tr.scrollLeft <= 4;
    $(".car-next").disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
  }
  function initReviews() {
    renderReviews();
    const track = $("#revTrack");
    const stepBy = () => {
      const c = $(".rev-card", track);
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : 300;
    };
    $(".car-prev").addEventListener("click", () => track.scrollBy({ left: -stepBy(), behavior: reduceMotion ? "auto" : "smooth" }));
    $(".car-next").addEventListener("click", () => track.scrollBy({ left: stepBy(), behavior: reduceMotion ? "auto" : "smooth" }));
    track.addEventListener("scroll", () => requestAnimationFrame(updateArrows), { passive: true });
    track.addEventListener("click", (e) => {
      const b = e.target.closest(".rev-more");
      if (!b) return;
      const card = b.closest(".rev-card");
      const open = card.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
      b.textContent = t(open ? "rev.less" : "rev.more");
    });
    let rz;
    window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { checkClamps(); updateArrows(); }, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkClamps);
  }

  /* ---------- Qué incluye: abierto en desktop, acordeón en móvil ---------- */
  function initIncludes() {
    const groups = $$(".inc-group");
    const sync = () => {
      groups.forEach((d, i) => {
        d.open = isDesktop.matches || i === 0;
        $("summary", d).tabIndex = isDesktop.matches ? -1 : 0;
      });
    };
    groups.forEach((d) => $("summary", d).addEventListener("click", (e) => { if (isDesktop.matches) e.preventDefault(); }));
    sync();
    isDesktop.addEventListener?.("change", sync);
  }

  /* ---------- Arranque ---------- */
  cacheOriginals();
  applyConfig();
  applyLang(true);
  $$("[data-words]").forEach((el) => wrapWords(el, false));

  initHeader();
  initScroll();
  initReveal();
  initTourCard();
  initTips();
  renderPlayer(true);
  initSpaces();
  initGallery();
  initReviews();
  initIncludes();
})();
