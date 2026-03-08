// ==========================================
// BASE DE DATOS DE PREGUNTAS
// ==========================================
const questions = [
    { question: "¿Qué concepto se refiere a la facilidad con la que los usuarios pueden navegar?", options: ["Usabilidad", "Legibilidad", "Saturación"], answer: "Usabilidad" },
    { question: "¿Cómo se llama el diseño que ajusta automáticamente el contenido?", options: ["Diseño Plano", "Diseño Responsivo", "Diseño Estático"], answer: "Diseño Responsivo" },
    { question: "¿Qué principio de UI utiliza el tamaño y el color para guiar el ojo?", options: ["Jerarquía Visual", "Simetría", "Repetición"], answer: "Jerarquía Visual" },
    { question: "¿Qué término describe las características que sugieren cómo usar un objeto?", options: ["Feedback", "Affordance", "Wireframe"], answer: "Affordance" },
    { question: "¿Cuál es el objetivo principal del 'Espacio en Blanco'?", options: ["Rellenar espacio", "Reducir la carga cognitiva", "Hacer que cargue rápido"], answer: "Reducir la carga cognitiva" },
    { question: "¿Qué elemento de UI permite a los usuarios introducir texto?", options: ["Botón", "Campo de texto", "Icono"], answer: "Campo de texto" },
    { question: "¿Qué componente se usa normalmente para enviar una acción?", options: ["Botón", "Slider", "Etiqueta"], answer: "Botón" },
    { question: "¿Qué elemento visual ayuda a representar acciones o funciones rápidamente?", options: ["Icono", "Footer", "Grid"], answer: "Icono" },
    { question: "¿Qué parte de una página web suele contener el menú de navegación?", options: ["Header", "Sidebar", "Footer"], answer: "Header" },
    { question: "¿Qué tipo de diseño organiza elementos en filas y columnas?", options: ["Layout Grid", "Layout Libre", "Layout Caótico"], answer: "Layout Grid" }
];

// VARIABLES DE ESTADO Y AUDIO
let current = 0;
let score = 0;

// Carga de sonidos 
const soundCorrect = new Audio('sonidos/nom.mp3'); 
const soundOof = new Audio('sonidos/uh.mp3');
const soundBye = new Audio('sonidos/bye.mp3');
const soundWelcome = new Audio('sonidos/hi.mp3');
const soundtrack = new Audio('sonidos/soundtrack.mp3');

// Configurar el soundtrack
soundtrack.loop = true;
soundtrack.volume = 0.5;
// FUNCIONES DE SESIÓN
function login() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();
    if (username === "") {
        triggerErrorVisual();
        usernameInput.placeholder = "¡Escribe algo, genio!";
        return;
    }
    localStorage.setItem("user", username);
    soundWelcome.currentTime = 0;
    soundWelcome.play();
    showHome();
}

function showHome() {
    ensureMusic();
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.add("hidden");
    document.getElementById("homeScreen").classList.remove("hidden");
    const user = localStorage.getItem("user");
    document.getElementById("welcome").innerText = `CBTICITO DETECTADO: [${user}]`;
}

function logout() {
    localStorage.removeItem("user");
    soundBye.currentTime = 0;
    soundBye.play();
    setTimeout(() => {
        location.reload();
    }, 800); 
}

// FUNCIONES DEL JUEGO
function startLesson() {
    ensureMusic();
    current = 0;
    score = 0;
    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("quizScreen").classList.remove("hidden");
    showQuestion();
}

function showQuestion() {
    const q = questions[current];
    document.getElementById("question").innerText = q.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.classList.add("option");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(btn);
    });
    updateProgress();
}

function checkAnswer(option) {
    if (option === questions[current].answer) {
        score++;
        soundCorrect.currentTime = 0;
        soundCorrect.play();
        avanzarPregunta();
    } else {
        soundOof.currentTime = 0;
        soundOof.play();
        triggerErrorVisual();
        // Le damos un pequeño delay para que sufra la animación antes de avanzar
        setTimeout(avanzarPregunta, 500); 
    }
}

function avanzarPregunta() {
    current++;
    if (current < questions.length) {
        showQuestion();
    } else {
        updateProgress(); // Llenar la barra al final
        setTimeout(showResult, 400);
    }
}

function triggerErrorVisual() {
    const container = document.getElementById("mainContainer");
    container.classList.remove("shake-animation");
    void container.offsetWidth; // Trigger reflow para reiniciar animación
    container.classList.add("shake-animation");
}

function updateProgress() {
    const percent = (current / questions.length) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

function showResult() {
    ensureMusic();
    document.getElementById("quizScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");
    
    const finalScore = (score / questions.length) * 100;
    let mensaje = "";
    
    if (finalScore === 100) {
        mensaje = "¡Felicidades! Xochitl estaría orgullosa de ti.";
    } else if (finalScore >= 60) {
        mensaje = "Pasable. Xochitl no se daría cuenta de que usaste IA.";
    } else {
        mensaje = "Mediocre. Xochitl estaría decepcionada de ti.";
    }
    
    document.getElementById("scoreText").innerHTML = `
        <p><strong>${mensaje}</strong></p>
        <h2 style="font-size: 48px; margin: 10px 0; color: #ffffff;">${score} / ${questions.length}</h2>
        <p>Aciertos totales</p>
    `;
}

function goHome() {
    showHome();
}

window.onload = () => {
    // Iniciar soundtrack
    soundtrack.currentTime = 0;
    soundtrack.play().catch(err => console.log('Autoplay bloqueado:', err));
    
    if (localStorage.getItem("user")) {
        showHome();
    }
}

// Asegurar que el soundtrack no se detiene al cambiar de pantalla
function ensureMusic() {
    if (soundtrack.paused) {
        soundtrack.play().catch(err => console.log('Autoplay bloqueado:', err));
    }
}