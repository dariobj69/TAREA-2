const root = document.documentElement;
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const themeButton = $('.theme-toggle');
const savedTheme = localStorage.getItem('forensica-theme');
if (savedTheme === 'dark') root.dataset.theme = 'dark';
function updateThemeIcon() { themeButton.textContent = root.dataset.theme === 'dark' ? '☀' : '☾'; }
updateThemeIcon();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('forensica-theme', root.dataset.theme);
  updateThemeIcon();
});

const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? '×' : '☰';
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .12 });
$$('.reveal').forEach(element => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }
}), { rootMargin: '-35% 0px -55% 0px' });
$$('main section[id]').forEach(section => sectionObserver.observe(section));
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('#progressFill').style.width = `${max ? window.scrollY / max * 100 : 0}%`;
}, { passive: true });

const components = {
  alu: { symbol: '∑', label: 'UNIDAD ARITMÉTICO-LÓGICA', title: 'El lugar donde las instrucciones se vuelven acción.', text: 'La ALU realiza operaciones matemáticas y lógicas: sumar, comparar, desplazar bits o evaluar condiciones. Es una pieza esencial para entender qué cálculo estaba ejecutando un proceso.', tags: ['SUMA', 'COMPARACIÓN', 'DECISIÓN'] },
  control: { symbol: '◎', label: 'UNIDAD DE CONTROL', title: 'La directora de orquesta del computador.', text: 'La UC interpreta cada instrucción y coordina el movimiento entre memoria, ALU y registros. Su secuencia ayuda a ubicar qué componente actuó y en qué orden.', tags: ['INTERPRETACIÓN', 'SECUENCIA', 'COORDINACIÓN'] },
  register: { symbol: '▦', label: 'REGISTROS', title: 'La memoria más próxima a la acción.', text: 'Los registros guardan temporalmente datos, direcciones e instrucciones que la CPU necesita de inmediato. Son extremadamente rápidos porque están dentro del procesador.', tags: ['DATOS', 'DIRECCIONES', 'ESTADO'] }
};
$$('.component-card').forEach(card => card.addEventListener('click', () => {
  const data = components[card.dataset.component];
  $$('.component-card').forEach(item => item.classList.remove('is-selected'));
  card.classList.add('is-selected');
  $('#componentDetail').innerHTML = `<div class="detail-symbol">${data.symbol}</div><div><span class="eyebrow accent">${data.label}</span><h3>${data.title}</h3><p>${data.text}</p><div class="tag-list">${data.tags.map(tag => `<span>${tag}</span>`).join('')}</div></div>`;
}));

const cycles = { fetch: ['01 / BÚSQUEDA', 'La CPU obtiene la siguiente instrucción desde la memoria.'], decode: ['02 / DECODIFICACIÓN', 'La Unidad de Control interpreta qué debe hacer la instrucción.'], execute: ['03 / EJECUCIÓN', 'La CPU realiza la operación correspondiente y actualiza el estado.'] };
let cycleIndex = 0;
const cycleKeys = Object.keys(cycles);
function setCycle(key) {
  const [label, text] = cycles[key];
  $('#cycleLabel').textContent = label; $('#cycleText').textContent = text;
  $$('.cycle-step').forEach(step => step.classList.toggle('active', step.dataset.step === key));
}
$$('.cycle-step').forEach(step => step.addEventListener('click', () => { cycleIndex = cycleKeys.indexOf(step.dataset.step); setCycle(step.dataset.step); }));
$('#nextCycle').addEventListener('click', () => { cycleIndex = (cycleIndex + 1) % cycleKeys.length; setCycle(cycleKeys[cycleIndex]); });

const memory = {
  register: ['Registros', 'Datos e instrucciones que la CPU está usando en este preciso instante.', '95%', '15%'], cache: ['Cache', 'Copia veloz de datos frecuentes para evitar viajes largos a la memoria principal.', '82%', '28%'], ram: ['RAM', 'Espacio de trabajo activo para procesos, aplicaciones y conexiones en curso.', '57%', '58%'], disk: ['SSD / HDD', 'Almacenamiento persistente: conserva información aun cuando el equipo se apaga.', '18%', '95%']
};
$$('.memory-level').forEach(level => level.addEventListener('click', () => {
  const [title, text, speed, capacity] = memory[level.dataset.memory];
  $$('.memory-level').forEach(item => item.classList.remove('active')); level.classList.add('active');
  $('#memoryTitle').textContent = title; $('#memoryText').textContent = text; $('#speedMeter').style.width = speed; $('#capacityMeter').style.width = capacity;
}));

const addresses = { ip: ['Dirección IP', 'Es una dirección lógica que identifica a un dispositivo dentro de una red. Puede cambiar según la configuración.', '192.168.1.24'], mac: ['Dirección MAC', 'Es una dirección física asociada a la interfaz de red. Identifica esa interfaz durante la comunicación.', 'A4:5E:60:9B:2C:11'] };
$$('.switch-button').forEach(button => button.addEventListener('click', () => {
  const [title, text, example] = addresses[button.dataset.address]; $$('.switch-button').forEach(item => item.classList.remove('active')); button.classList.add('active');
  $('#addressTitle').textContent = title; $('#addressText').textContent = text; $('#addressExample').textContent = example;
}));

const topologies = { star: ['Estrella', 'Todos los dispositivos se conectan a un nodo central. Es sencilla de administrar, pero una falla en el centro puede interrumpir toda la red.', 'ALTO EN EL NODO CENTRAL'], ring: ['Anillo', 'Cada dispositivo se conecta con dos vecinos formando un circuito. Una interrupción puede afectar el recorrido completo.', 'MEDIO / SEGÚN REDUNDANCIA'], bus: ['Bus', 'Todos comparten un mismo canal principal. Es económica, aunque una falla en el cable troncal puede dejarla fuera de servicio.', 'ALTO EN EL CANAL PRINCIPAL'] };
$$('.topology-button').forEach(button => button.addEventListener('click', () => {
  const [title, text, impact] = topologies[button.dataset.topology]; $$('.topology-button').forEach(item => item.classList.remove('active')); button.classList.add('active');
  $('#topologyTitle').textContent = title; $('#topologyText').textContent = text; $('#topologyImpact').textContent = impact; $('#topologyDrawing').dataset.topology = button.dataset.topology;
}));

$$('.quiz-option').forEach(option => option.addEventListener('click', () => {
  $$('.quiz-option').forEach(item => item.classList.remove('is-correct', 'is-wrong'));
  const correct = option.dataset.answer === 'correct'; option.classList.add(correct ? 'is-correct' : 'is-wrong');
  $('#quizFeedback').textContent = correct ? 'Correcto. La evidencia gana fuerza cuando se correlacionan sus distintas fuentes.' : 'Aún falta una pieza: la investigación combina RAM, registros y tráfico de red.';
}));

$('#currentYear').textContent = new Date().getFullYear();
$('#pdfButton').addEventListener('click', () => {
  if (typeof html2pdf === 'undefined') { window.print(); return; }
  html2pdf().set({ margin: 9, filename: 'arquitectura-redes-ciberdelitos.pdf', image: { type: 'jpeg', quality: .95 }, html2canvas: { scale: 1.5, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css', 'legacy'] } }).from($('#printArea')).save();
});