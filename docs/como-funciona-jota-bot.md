# Cómo funciona Jota Bot

> Informe explicativo de la estrategia de grid trading que ejecuta Jota Bot.
> Pensado para entender el producto y poder explicarlo a clientes.

---

## 1. Resumen en una frase

Jota Bot automatiza una estrategia de **grid trading** (rejilla): coloca una red de
órdenes de compra y de venta a distintos precios y **gana con la volatilidad** —
compra barato y vende caro de forma repetida, sin intentar adivinar hacia dónde va
el mercado.

---

## 2. La idea central

El precio de una cripto no sube ni baja en línea recta: **oscila** constantemente
arriba y abajo. El grid trading convierte esas oscilaciones en beneficio.

En lugar de "comprar y esperar", el bot:

1. Define un **rango de precio** (un mínimo y un máximo) donde cree que el precio se
   va a mover.
2. Divide ese rango en muchos niveles equiespaciados (la **rejilla** o *grid*).
3. En cada nivel coloca una orden:
   - **Compra** cuando el precio **baja** y cruza un nivel.
   - **Vende** cuando el precio **sube** y cruza el siguiente nivel.
4. Cada par compra-venta completado deja un **pequeño beneficio**. Repetido cientos
   de veces, suma.

Es una estrategia **neutral**: no necesita que el mercado suba para ganar, solo que
**se mueva** dentro del rango.

---

## 3. La estrategia paso a paso

Parámetros que define el usuario al crear un bot:

| Parámetro | Qué es |
|---|---|
| **Par** | El activo a operar (BTC, ETH, SOL…) |
| **Rango (inferior–superior)** | Los precios entre los que opera la rejilla |
| **Grids** | Cuántos niveles tiene la rejilla (ej. 20) |
| **Inversión** | Capital asignado al bot (USDT) |
| **Apalancamiento** | Multiplicador del capital (1x–20x) |

Con eso, el bot calcula automáticamente:

- **Separación entre niveles** = (precio superior − inferior) ÷ nº de grids
- **Tamaño de cada orden** = (inversión × apalancamiento) ÷ nº de grids ÷ precio medio

Y entonces opera solo, 24/7:

```
Precio sube y cruza un nivel  →  VENDE una porción (toma beneficio)
Precio baja y cruza un nivel  →  COMPRA una porción (acumula barato)
```

---

## 4. Ejemplo numérico real

Bot sobre **BTC**, rango **55.000 – 67.000 USDT**, **20 grids**, **100 USDT** de
inversión, **2x** de apalancamiento:

- Capital efectivo: 100 × 2 = **200 USDT**
- Separación entre niveles: (67.000 − 55.000) ÷ 20 = **600 USDT**
- Tamaño por orden: 200 ÷ 20 ÷ 61.000 ≈ **0,000164 BTC**
- Beneficio por ciclo completo (1 compra + 1 venta): 600 × 0,000164 ≈ **0,10 USDT**

Parece poco… pero si el precio oscila y completa **300 ciclos** en dos semanas, son
~30 USDT sobre 100 invertidos. La clave está en la **repetición**: cuanta más
volatilidad lateral, más ciclos, más beneficio.

---

## 5. Por qué (y cuándo) es rentable

El grid trading es rentable porque **monetiza la volatilidad**, no la dirección.
Sus ventajas:

1. **No hay que predecir el mercado.** Gana mientras el precio oscile, sin acertar
   tendencias.
2. **Compra y venta sistemáticas.** Compra automáticamente en las caídas (cuando el
   miedo paraliza al trader humano) y vende en las subidas (cuando la codicia hace
   aguantar de más). Elimina la emoción.
3. **Funciona 24/7.** El cripto no cierra; el bot aprovecha movimientos de madrugada
   que una persona se perdería.
4. **El beneficio se acumula.** Cada micro-operación es pequeña, pero el volumen las
   convierte en un retorno significativo en mercados laterales y volátiles.
5. **Escala.** Misma estrategia con más capital, más pares o más apalancamiento.

**Dónde rinde mejor:** mercados **laterales con mucha oscilación** (rango definido y
mucho "ruido"). Es el escenario ideal del grid.

---

## 6. Cuándo NO rinde (honestidad = confianza del cliente)

Para vender el producto con credibilidad conviene explicar también los límites:

- **Tendencia fuerte y sostenida:** si el precio se va **muy por encima** del rango,
  el bot ya vendió todo y deja de ganar (coste de oportunidad). Si se va **muy por
  debajo**, acumula posición con pérdida no realizada hasta que el precio vuelva.
- **Salida del rango:** fuera de los límites configurados, el bot deja de operar.
- **El apalancamiento amplifica.** Multiplica las ganancias **y** las pérdidas. Más
  apalancamiento = más riesgo de liquidación.
- **Comisiones del exchange:** cada operación paga *fee*; si la separación entre
  grids es muy pequeña, las comisiones se comen el beneficio. Hay que dimensionar
  bien la rejilla.

> Mensaje honesto para el cliente: *"Jota Bot no adivina el futuro ni garantiza
> beneficios. Es una herramienta que ejecuta una estrategia probada de forma
> disciplinada y sin emociones, optimizada para mercados volátiles."*

---

## 7. Gestión del riesgo integrada

- **El bot nunca retira fondos.** Las claves del exchange se piden con permisos de
  **solo lectura + futuros**, nunca de retiro.
- **Credenciales cifradas** con AES-256-GCM; el secreto nunca se guarda ni se
  muestra en texto plano.
- **Rango acotado:** el usuario controla exactamente entre qué precios opera.
- **Backtest antes de arriesgar:** se puede simular la estrategia sobre datos
  históricos reales (retorno, APR estimado, máximo drawdown, nº de operaciones)
  antes de poner un peso.

---

## 8. Modos de operación

| Modo | Qué hace | Riesgo |
|---|---|---|
| **Paper** | Simulación con precios reales, sin dinero | Cero |
| **Testnet** | Conexión al entorno de pruebas del exchange | Cero |
| **Live** | Operativa real con tu cuenta de Binance | Real |

El usuario empieza en **paper**, valida la estrategia, y solo pasa a **live** cuando
está convencido.

---

## 9. Cómo lo presenta el producto

- **Dashboard** en vivo: equity total, beneficio realizado y no realizado, exposición
  por par y curva de evolución de la cartera.
- **Mercado** con precios reales de Binance al segundo.
- **Backtest** para validar estrategias.
- **Arbitraje**: escáner de diferencias de precio entre exchanges.

---

## 10. Argumentario de venta (resumen)

> **Jota Bot es trading con disciplina, no con suerte.** Automatiza una estrategia
> de grid que gana con la volatilidad del cripto —comprando en las bajadas y
> vendiendo en las subidas— de forma sistemática, 24/7 y sin emociones. El usuario
> define el rango y el riesgo; el bot ejecuta. Con backtest para validar, modo
> simulación sin riesgo para empezar, y seguridad de nivel bancario en las
> credenciales.

*Aviso: operar con criptomonedas conlleva riesgo de pérdida. Jota Bot es una
herramienta de automatización y no constituye asesoramiento financiero ni garantiza
beneficios.*
