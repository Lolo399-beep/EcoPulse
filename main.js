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

// --- Lógica de EcoPlato ---
const recetas = [
    { ingredientes: ["tomate", "arroz"], nombre: "Arroz Salteado con Tomate", pasos: "Salteá el tomate, sumá el arroz frío y mezclá por 3 min." },
    { ingredientes: ["pan", "leche"], nombre: "Budín de Pan Express", pasos: "Remojá el pan en leche tibia, agregá azúcar y doralo a la sartén." },
    { ingredientes: ["papas", "huevo"], nombre: "Tortilla de Papas Cero Desperdicio", pasos: "Cortá las papas cocidas y unilas con huevo batido." }
];

function buscarReceta() {
    const ing1 = document.getElementById('ingrediente1').value.toLowerCase().trim();
    const ing2 = document.getElementById('ingrediente2').value.toLowerCase().trim();
    const contenedor = document.getElementById('resultado-receta');

    if (!ing1) {
        contenedor.innerHTML = '<p style="color: #c0392b;">Poné al menos un ingrediente.</p>';
        return;
    }

    const hallada = recetas.find(r => r.ingredientes.includes(ing1) || (ing2 && r.ingredientes.includes(ing2)));

    if (hallada) {
        contenedor.innerHTML = `
            <div style="background: #e8f5f2; padding: 15px; border-radius: 12px; border-left: 5px solid #238b6b; text-align: left;">
                <h4 style="color: #238b6b;">🍲 ${hallada.nombre}</h4>
                <p style="margin: 8px 0;">${hallada.pasos}</p>
                <button id="btn-salvar-comida" onclick="salvarAlimento()">¡Salvé esta comida! (+5 ❄️)</button>
            </div>
        `;
    } else {
        contenedor.innerHTML = '<p style="color: #397267;">💡 <strong>Idea rápida:</strong> Cortá los ingredientes y saltealos en sartén con un chorrito de aceite.</p>';
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

    // Generar estado resoluble mezclando desde la solución
    tableroActual = [...ordenGanador];
    let movimientosAleatorios = 30;
    while (movimientosAleatorios > 0) {
        const adyacentes = getAdyacentes(tableroActual.indexOf(0));
        const azar = adyacentes[Math.floor(Math.random() * adyacentes.length)];
        // Intercambiar
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

    if (fila > 0) adyacentes.push(indexZero - 3); // Arriba
    if (fila < 2) adyacentes.push(indexZero + 3); // Abajo
    if (col > 0) adyacentes.push(indexZero - 1);  // Izquierda
    if (col < 2) adyacentes.push(indexZero + 1);  // Derecha

    return adyacentes;
}

function intentarMover(indexPieza) {
    const indexZero = tableroActual.indexOf(0);
    const adyacentes = getAdyacentes(indexZero);

    // Solo se mueve si está adyacente al 0
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
document.addEventListener('DOMContentLoaded', iniciarPuzle)
