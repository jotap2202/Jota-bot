# Reunión con John — material de mañana

Todo lo que está en esta carpeta es **independiente de Jota Agency y Jota 24/7**. Es material armado específicamente para esta reunión y no toca el código de la app.

## Qué hay acá

- `presentation/index.html` — la presentación (9 slides, en inglés). Se abre directo en el navegador (doble clic o `open presentation/index.html` en Mac). Funciona 100% offline, sin depender de wifi. Navegación: flechas ← → del teclado, o click (izquierda = anterior, derecha = siguiente).
- `demo/` — el demo en vivo (concept demo del "AI Meeting & Event Concierge"). Esto sí llama a la API de Claude en vivo, no está scripteado.
- `speaking-notes.md` — lo que decís en cada slide, en inglés, para tenerlo abierto en el celular o impreso.
- `cheat-sheet.md` — las 10 preguntas para John, las respuestas a preguntas probables sobre vos/Jota Agency, y los 3 recordatorios de comportamiento. En inglés.

## Cómo correr el demo antes de mañana (probalo esta noche)

Desde la carpeta `demo/`:

```bash
cd john-meeting/demo
npm install
export ANTHROPIC_API_KEY=tu_api_key    # o `ant auth login` si ya tenés perfil configurado
npm start
```

Abrí `http://localhost:4173` en el navegador. Probá con el ejemplo que ya está precargado en el textarea, y con algún otro ejemplo tuyo, para asegurarte que responde bien y que no depende de wifi del lugar (solo depende de tu conexión a internet para llamar a la API — probá también con el hotspot del celular por las dudas).

**Importante:** probalo esta noche, no mañana en el momento. Si por algún motivo no hay internet en la reunión, tené en mente que podés mostrar la presentación igual (esa sí es 100% offline) y describir el demo verbalmente, o mostrar una captura de pantalla de cuando lo probaste.

## Checklist para mañana

- [ ] Laptop cargada
- [ ] Demo probado la noche anterior, con la misma conexión que vas a usar (o hotspot del celular como backup)
- [ ] `speaking-notes.md` y `cheat-sheet.md` abiertos o impresos
- [ ] Resume impreso
- [ ] NDA — firmarlo si te lo pide antes de que te muestre la plataforma
- [ ] Recordar: escuchar → entender → preguntar → identificar oportunidad → recién ahí proponer un prototipo
