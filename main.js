// --- Datos Iniciales y Guardado Local ---
let racha = localStorage.getItem('ecoRacha') ? parseInt(localStorage.getItem('ecoRacha')) : 0;
let copos = localStorage.getItem('ecoCopos') ? parseInt(localStorage.getItem('ecoCopos')) : 10;
let tareas = localStorage.getItem('ecoTareas') ? parseInt(localStorage.getItem('ecoTareas')) : 0;

document.getElementById('racha-count').innerText = racha;
document.getElementById('copos-count').innerText = copos;
document.getElementById('tareas-count').innerText = tareas;

function sumarRecompensa(cantidadCopos) {
    copos += cantidadCopos;
    localStorage.setItem('ecoCopos', copos);
    document.getElementById('copos-count').innerText = copos;
}

function registrarTareaCompletada() {
    tareas += 1;
    localStorage.setItem('ecoTareas', tareas);
    document.getElementById('tareas-count').innerText = tareas;
}

// --- Base de Datos Misión Plásticos ---
const infoPlasticos = {
    1: { nombre: "PET (Polietileno Tereftalato)", uso: "Botellas de agua y gaseosas.", tacho: "🟢 Tacho Verde (Limpio y seco)", trivia: "¿El plástico PET 1 es reciclable?", opciones: ["Sí, 100%", "No, nunca"], correcta: 0 },
    2: { nombre: "PEAD (Alta Densidad)", uso: "Envases de detergente y shampoo.", tacho: "🟢 Tacho Verde (Bien enjuagado)", trivia: "¿En qué producto encontrás PEAD 2?", opciones: ["Sachet/Botella Lavandina", "En una manzana"], correcta: 0 },
    3: { nombre: "PVC", uso: "Tuberías y cables.", tacho: "⬛ Tacho Negro (Reutilizar si es posible)", trivia: "¿Es común reciclar PVC en casas?", opciones: ["No, es difícil", "Sí, facilísimo"], correcta: 0 },
    4: { nombre: "PEBD (Baja Densidad)", uso: "Bolsas de supermercado.", tacho: "🟢 Tacho Verde (Juntá varias juntas)", trivia: "¿Qué producto suele ser PEBD 4?", opciones: ["Bolsas plásticas", "Cubos de hielo"], correcta: 0 },
    5: { nombre: "PP (Polipropileno)", uso: "Potes de yogur y tapas.", tacho: "🟢 Tacho Verde (Excelente para reciclar)", trivia: "¿Las tapas de botellas suelen ser PP 5?", opciones: ["Sí", "No"], correcta: 0 },
    6: { nombre: "PS (Poliestireno)", uso: "Bandejas de telgopor.", tacho: "⬛ Tacho Negro (Muy difícil de reciclar)", trivia: "¿El telgopor (PS 6) es fácil de reciclar?", opciones: ["No, es muy difícil", "Sí, súper fácil"], correcta: 0 },
    7: { nombre: "OTROS", uso: "Mezclas especiales.", tacho: "⬛ Tacho Negro / Punto Verde especial", trivia: "¿El número 7 representa plásticos mezclados?", opciones: ["Sí", "No"], correcta: 0 }
};

let numPlasticoSeleccionado = null;

function iniciarTrivia() {
    const inputVal = parseInt(document.getElementById('recycle-code').value);
    const feedback = document.getElementById('feedback-mision');
    const bloqueTrivia = document.getElementById('bloque-trivia');

    if (inputVal >= 1 && inputVal <= 7) {
        numPlasticoSeleccionado = inputVal;
        const info = infoPlasticos[inputVal];

        feedback.innerText = "";
        bloqueTrivia.style.display = "block";
        document.getElementById('pregunta-trivia').innerText = info.trivia;

        const contenedorOpciones = document.getElementById('opciones-trivia');
        contenedorOpciones.innerHTML = "";

        info.opciones.forEach((opcion, index) => {
            const btn = document.createElement('button');
            btn.innerText = opcion;
            btn.onclick = () => responderTrivia(index);
            contenedorOpciones.appendChild(btn);
        });
    } else {
        feedback.style.color = '#c0392b';
        feedback.innerText = 'Ingresá un número válido del 1 al 7.';
    }
}

function responderTrivia(opcionElegida) {
    const info = infoPlasticos[numPlasticoSeleccionado];
    const feedback = document.getElementById('feedback-mision');
    const bloqueTrivia = document.getElementById('bloque-trivia');

    bloqueTrivia.style.display = "none";

    if (opcionElegida === info.correcta) {
        racha += 1;
        sumarRecompensa(3);
        registrarTareaCompletada();

        localStorage.setItem('ecoRacha', racha);
        document.getElementById('racha-count').innerText = racha;

        feedback.innerHTML = `
            <div style="background: #e8f5f2; border-left: 4px solid #238b6b; padding: 12px; margin-top: 10px; text-align: left; border-radius: 8px;">
                <p style="color: #238b6b; font-weight: bold;">🎯 ¡Trivia Correcta! +3 ❄️ y +1 🔥 a tu racha.</p>
                <hr style="margin: 8px 0; border: 0; border-top: 1px solid #b2dfdb;">
                <p style="color: #238b6b; font-weight: bold;">♻️ Plástico Tipo ${numPlasticoSeleccionado}: ${info.nombre}</p>
                <p style="font-size: 0.9rem; margin: 4px 0;"><strong>Uso común:</strong> ${info.uso}</p>
                <p style="font-size: 0.9rem; margin: 4px 0;"><strong>Destino:</strong> ${info.tacho}</p>
            </div>
        `;

        document.getElementById('btn-mision').disabled = true;
        document.getElementById('btn-mision').style.opacity = '0.6';
        document.getElementById('btn-mision').innerText = 'Completado';
    } else {
        feedback.innerHTML = '<p style="color: #c0392b;">❌ Incorrecto. Intentá de nuevo.</p>';
    }
}

// --- Lógica de EcoPlato (Múltiples Ingredientes) ---
const recetas = [
    { ingredientes: ["tomate", "arroz"], nombre: "Arroz Salteado con Tomate", pasos: "Salteá el tomate, sumá el arroz frío y mezclá por 3 min." },
    { ingredientes: ["pan", "leche"], nombre: "Budín de Pan Express", pasos: "Remojá el pan en leche tibia, agregá azúcar y doralo a la sartén." },
    { ingredientes: ["papas", "huevo"], nombre: "Tortilla de Papas Cero Desperdicio", pasos: "Cortá las papas cocidas y unilas con huevo batido." },
    { ingredientes: ["zanahoria", "huevo"], nombre: "Buñuelos Rápidos de Zanahoria", pasos: "Rallá la zanahoria, mezclala con huevo batido y un poco de harina, y cociná a la sartén." },
    { ingredientes: ["fideos", "queso"], nombre: "Fideos Salteados con Queso", pasos: "Mezclá los fideos que sobraron con queso rallado o en hebras y calentalos a fuego lento." },
    { ingredientes: ["atún", "arroz", "choclo"], nombre: "Ensalada Completa de Atún", pasos: "Mezclá el arroz cocido con atún, choclo y un hilo de aceite de oliva." }
];

function agregarCampoIngrediente() {
    const contenedor = document.getElementById('contenedor-ingredientes');
    const nuevaFila = document.createElement('div');
    nuevaFila.className = 'input-row';
    
    nuevaFila.innerHTML = `
        <input type="text" class="input-ingrediente" list="lista-ingredientes" placeholder="Otro ingrediente" autocomplete="off">
        <button type="button" class="btn-eliminar" onclick="this.parentElement.remove()">✕</button>
    `;
    
    contenedor.appendChild(nuevaFila);
}

function buscarReceta() {
    const inputs = document.querySelectorAll('.input-ingrediente');
    const ingredientesIngresados = Array.from(inputs)
        .map(input => input.value.toLowerCase().trim())
        .filter(val => val !== "");

    const contenedor = document.getElementById('resultado-receta');

    if (ingredientesIngresados.length === 0) {
        contenedor.innerHTML = '<p style="color: #c0392b;">Ingresá al menos un ingrediente.</p>';
        return;
    }

    // Buscar receta que contenga al menos uno de los ingredientes ingresados
    const hallada = recetas.find(r => 
        r.ingredientes.some(ing => ingredientesIngresados.includes(ing))
    );

    if (hallada) {
        contenedor.innerHTML = `
            <div style="background: #e8f5f2; padding: 15px; border-radius: 12px; border-left: 5px solid #238b6b; text-align: left;">
                <h4 style="color: #238b6b;">🍲 ${hallada.nombre}</h4>
                <p style="margin: 8px 0;">${hallada.pasos}</p>
                <button id="btn-salvar-comida" onclick="salvarAlimento()">¡Salvé esta comida! (+5 ❄️)</button>
            </div>
        `;
    } else {
        contenedor.innerHTML = '<p style="color: #397267;">💡 <strong>Idea rápida:</strong> Mezclá tus ingredientes en una sartén con un chorrito de aceite o saltealos al horno.</p>';
    }
}

function salvarAlimento() {
    sumarRecompensa(5);
    registrarTareaCompletada();
    const btn = document.getElementById('btn-salvar-comida');
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.innerText = '¡Comida Salvada!';
    }
}

// --- Lógica del Sliding Puzzle (3x3 con 0 como hueco) ---
const ordenGanador = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let tableroActual = [];
let puzleCompletadoHoy = localStorage.getItem('ecoSlidingCompletado') === new Date().toLocaleDateString();

const iconosSliding = {
    1: "🐻", 2: "🧊", 3: "❄️",
    4: "🌱", 5: "♻️", 6: "🌊",
    7: "🐧", 8: "🌍", 0: ""
};

function iniciarPuzle() {
    const feedback = document.getElementById('puzle-status');
    const btn = document.getElementById('btn-resolver-puzle');

    if (puzleCompletadoHoy) {
        feedback.innerHTML = '<p style="color: #238b6b; font-weight: bold; margin-top: 10px;">✅ ¡Ya completaste el rompecabezas de hoy! Volvé mañana.</p>';
        btn.disabled = true;
        tableroActual = [...ordenGanador];
        renderSlidingPuzzle(false);
        return;
    }

    tableroActual = [...ordenGanador];
    let movimientosAleatorios = 30;
    while (movimientosAleatorios > 0) {
        const adyacentes = getAdyacentes(tableroActual.indexOf(0));
        const azar = adyacentes[Math.floor(Math.random() * adyacentes.length)];
        tableroActual[tableroActual.indexOf(0)] = tableroActual[azar];
        tableroActual[azar] = 0;
        movimientosAleatorios--;
    }

    feedback.innerText = "Toca las fichas al lado del espacio vacío para moverlas.";
    renderSlidingPuzzle(true);
}

function renderSlidingPuzzle(interactivo) {
    const grid = document.getElementById('puzle-grid');
    grid.innerHTML = '';

    tableroActual.forEach((val, idx) => {
        const piece = document.createElement('div');
        piece.className = 'puzle-piece';

        if (val === 0) {
            piece.classList.add('empty');
        } else {
            piece.innerHTML = `<span style="font-size: 1.1rem;">${val}</span><span style="font-size: 0.9rem;">${iconosSliding[val]}</span>`;
            if (interactivo) {
                piece.onclick = () => intentarMover(idx);
            }
        }
        grid.appendChild(piece);
    });
}

function getAdyacentes(indexZero) {
    const adyacentes = [];
    const fila = Math.floor(indexZero / 3);
    const col = indexZero % 3;

    if (fila > 0) adyacentes.push(indexZero - 3);
    if (fila < 2) adyacentes.push(indexZero + 3);
    if (col > 0) adyacentes.push(indexZero - 1);
    if (col < 2) adyacentes.push(indexZero + 1);

    return adyacentes;
}

function intentarMover(indexPieza) {
    const indexZero = tableroActual.indexOf(0);
    const adyacentes = getAdyacentes(indexZero);

    if (adyacentes.includes(indexPieza)) {
        tableroActual[indexZero] = tableroActual[indexPieza];
        tableroActual[indexPieza] = 0;

        renderSlidingPuzzle(true);
        verificarVictoriaSliding();
    }
}

function verificarVictoriaSliding() {
    const esGanador = tableroActual.every((val, idx) => val === ordenGanador[idx]);

    if (esGanador) {
        sumarRecompensa(10);
        registrarTareaCompletada();

        puzleCompletadoHoy = true;
        localStorage.setItem('ecoSlidingCompletado', new Date().toLocaleDateString());

        document.getElementById('puzle-status').innerHTML = `
            <div style="background: #e8f5f2; border: 2px solid #238b6b; padding: 12px; margin-top: 10px; border-radius: 8px;">
                <p style="color: #238b6b; font-weight: bold; font-size: 1.1rem;">🎉 ¡Sliding Puzzle Armado!</p>
                <p>Ganaste <strong>+10 Copos ❄️</strong> y +1 Tarea Completada.</p>
            </div>
        `;

        document.getElementById('btn-resolver-puzle').disabled = true;
        renderSlidingPuzzle(false);
    }
}

// Cargar puzle al iniciar la página
document.addEventListener('DOMContentLoaded', iniciarPuzle);

// --- Minijuego 4: ¿Es Reciclable o No? ---
const baseDatosReciclaje = [
    // Reciclables
    { emoji: "🍾", palabra: "Botella descorchándose (Vidrio)", esReciclable: true },
    { emoji: "🍷", palabra: "Copa de vino limpia", esReciclable: true },
    { emoji: "📦", palabra: "Paquete (Cartón)", esReciclable: true },
    { emoji: "📰", palabra: "Periódico", esReciclable: true },
    { emoji: "📝", palabra: "Cuaderno de notas (sin espiral)", esReciclable: true },
    { emoji: "🛍️", palabra: "Bolsa de papel", esReciclable: true },
    { emoji: "🥫", palabra: "Comida enlatada (limpia)", esReciclable: true },
    { emoji: "🥤", palabra: "Vaso plástico duro / PET", esReciclable: true },
    // No Reciclables
    { emoji: "🧻", palabra: "Rollo de papel / Servilletas sucias", esReciclable: false },
    { emoji: "🍼", palabra: "Pañales", esReciclable: false },
    { emoji: "🍕", palabra: "Caja de pizza manchada con aceite", esReciclable: false },
    { emoji: "☕", palabra: "Taza de café descartable (con plástico interior)", esReciclable: false },
    //{ emoji: "🪥", palabra: "Cepillo de dientes", esReciclable: false },
    { emoji: "🛍️", palabra: "Bolsa de plástico fina (tipo supermercado)", esReciclable: false },
    { emoji: "🍽️", palabra: "Plato de cerámica roto", esReciclable: false },
    { emoji: "🪞", palabra: "Espejo roto", esReciclable: false },
    { emoji: "💡", palabra: "Bombilla vieja", esReciclable: false },
    { emoji: "🧸", palabra: "Oso de peluche", esReciclable: false },
    { emoji: "💻", palabra: "Notebook vieja (Requiere punto especial, no tacho verde)", esReciclable: false }
];

let erroresCometidos = 0;
let objetoActual = null;
const MAX_ERRORES = 5;

// Verificamos si el jugador fue bloqueado previamente hoy
function verificarBloqueoReciclaje() {
    const fechaBloqueo = localStorage.getItem('ecoBloqueoReciclaje');
    const hoy = new Date().toLocaleDateString();
    
    if (fechaBloqueo === hoy) {
        document.getElementById('btn-iniciar-reciclaje').style.display = 'none';
        document.getElementById('estado-reciclaje').innerHTML = '<span style="color: #c0392b;">Has fallado 5 veces. ¡Polo necesita descansar! Volvé a intentarlo mañana. 🐻‍❄️💤</span>';
        return true;
    }
    return false;
}

function iniciarJuegoReciclaje() {
    if (verificarBloqueoReciclaje()) return;

    erroresCometidos = 0;
    document.getElementById('vidas-reciclaje').innerText = MAX_ERRORES - erroresCometidos;
    document.getElementById('btn-iniciar-reciclaje').style.display = 'none';
    document.getElementById('zona-juego-reciclaje').style.display = 'block';
    document.getElementById('estado-reciclaje').innerText = '';
    
    cargarNuevoObjeto();
}

function cargarNuevoObjeto() {
    const indiceAleatorio = Math.floor(Math.random() * baseDatosReciclaje.length);
    objetoActual = baseDatosReciclaje[indiceAleatorio];
    
    document.getElementById('emoji-reciclaje').innerText = objetoActual.emoji;
    document.getElementById('palabra-reciclaje').innerText = objetoActual.palabra;
}

function verificarReciclaje(respuestaJugador) {
    const estado = document.getElementById('estado-reciclaje');
    
    if (respuestaJugador === objetoActual.esReciclable) {
        sumarRecompensa(1); // Gana 1 copo por acierto
        estado.innerHTML = `<span style="color: #238b6b;">¡Correcto! +1 ❄️</span>`;
        cargarNuevoObjeto();
    } else {
        erroresCometidos++;
        const vidasRestantes = MAX_ERRORES - erroresCometidos;
        document.getElementById('vidas-reciclaje').innerText = vidasRestantes;
        
        if (vidasRestantes <= 0) {
            localStorage.setItem('ecoBloqueoReciclaje', new Date().toLocaleDateString());
            document.getElementById('zona-juego-reciclaje').style.display = 'none';
            estado.innerHTML = '<span style="color: #c0392b;">¡Te quedaste sin intentos! Polo está triste. Volvé mañana para repasar. 🧊</span>';
        } else {
            estado.innerHTML = `<span style="color: #c0392b;">¡Ups! Eso no iba ahí. Te quedan ${vidasRestantes} intentos.</span>`;
            cargarNuevoObjeto();
        }
    }
}

// --- Lógica Minijuego 5: Memotest Ecológico ---
// Usamos emojis de objetos reciclables: Diario, Botella de vidrio, Caja, Lata, Bolsa de papel, Vaso de plástico
const parejasReciclables = [
    { id: 1, texto: "📰" }, { id: 1, texto: "📰" },
    { id: 2, texto: "🍾" }, { id: 2, texto: "🍾" },
    { id: 3, texto: "📦" }, { id: 3, texto: "📦" },
    { id: 4, texto: "🥫" }, { id: 4, texto: "🥫" },
    { id: 5, texto: "🛍️" }, { id: 5, texto: "🛍️" },
    { id: 6, texto: "🥤" }, { id: 6, texto: "🥤" }
];

let cartasMemotest = [];
let primeraCarta = null;
let segundaCarta = null;
let bloqueoTablero = false;
let parejasEncontradas = 0;
let memotestCompletadoHoy = localStorage.getItem('ecoMemotestCompletado') === new Date().toLocaleDateString();

function iniciarMemotest() {
    const contenedor = document.getElementById('memotest-container');
    const status = document.getElementById('memotest-status');
    const btnReiniciar = document.getElementById('btn-reiniciar-memotest');

    if (memotestCompletadoHoy) {
        status.innerHTML = '<span style="color: #238b6b;"> ¡Ya completaste el Memotest de hoy! Volvé mañana.</span>';
        btnReiniciar.disabled = true;
        btnReiniciar.style.opacity = '0.5';
        contenedor.innerHTML = '';
        return;
    }

    status.innerText = "¡Encontrá los pares de reciclables!";
    contenedor.innerHTML = '';
    primeraCarta = null;
    segundaCarta = null;
    bloqueoTablero = false;
    parejasEncontradas = 0;

    // Duplicar y mezclar cartas aleatoriamente
    cartasMemotest = [...parejasReciclables].sort(() => Math.random() - 0.5);

    cartasMemotest.forEach((item, index) => {
        const carta = document.createElement('div');
        carta.className = 'memocard';
        carta.dataset.id = item.id;
        carta.innerText = ""; // Inicialmente vacías (boca abajo)
        carta.onclick = () => voltearCarta(carta, item);
        contenedor.appendChild(carta);
    });
}

function voltearCarta(carta, item) {
    // Evitar que se volteen más de 2 cartas a la vez, o que se haga clic en una ya volteada/encontrada
    if (bloqueoTablero) return;
    if (carta.classList.contains('volteada') || carta.classList.contains('encontrada')) return;

    // Voltear la carta
    carta.classList.add('volteada');
    carta.innerText = item.texto; // Mostrar el emoji

    if (!primeraCarta) {
        primeraCarta = { carta, item };
        return;
    }

    segundaCarta = { carta, item };
    verificarCoincidencia();
}

function verificarCoincidencia() {
    // Comprobar si los IDs de las dos cartas son iguales
    const esCoincidencia = primeraCarta.item.id === segundaCarta.item.id;

    if (esCoincidencia) {
        // Son un par correcto
        primeraCarta.carta.classList.add('encontrada');
        segundaCarta.carta.classList.add('encontrada');
        
        parejasEncontradas++;
        resetearTurno();

        // Verificar si ganó (si encontró la mitad del total de cartas)
        if (parejasEncontradas === parejasReciclables.length / 2) {
            // Nota: Asegúrate de tener estas dos funciones (sumarRecompensa y registrarTareaCompletada) declaradas en tu código principal
            if(typeof sumarRecompensa === "function") sumarRecompensa(15); 
            if(typeof registrarTareaCompletada === "function") registrarTareaCompletada(); 
            
            memotestCompletadoHoy = true;
            localStorage.setItem('ecoMemotestCompletado', new Date().toLocaleDateString());

            document.getElementById('memotest-status').innerHTML = `
                <div style="background: #e8f5f2; border: 2px solid #238b6b; padding: 10px; border-radius: 8px;">
                     <strong>¡Memotest Superado!</strong> Ganaste <strong>+15 Copos ❄️</strong> y completaste la tarea.
                </div>
            `;
            document.getElementById('btn-reiniciar-memotest').disabled = true;
        }
    } else {
        // No son iguales, bloquear tablero un segundo y volver a esconder
        bloqueoTablero = true;
        setTimeout(() => {
            primeraCarta.carta.classList.remove('volteada');
            primeraCarta.carta.innerText = "";
            segundaCarta.carta.classList.remove('volteada');
            segundaCarta.carta.innerText = "";
            resetearTurno();
        }, 1000);
    }
}

function resetearTurno() {
    primeraCarta = null;
    segundaCarta = null;
    bloqueoTablero = false;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    iniciarMemotest();
});

// Comprobar bloqueo al cargar la página
document.addEventListener('DOMContentLoaded', verificarBloqueoReciclaje);