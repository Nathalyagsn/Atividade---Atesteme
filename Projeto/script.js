// Elementos
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const icons = document.querySelectorAll('.icon');
const dropzones = document.querySelectorAll('.dropzone');
const verifyButton = document.getElementById('verify');
const message = document.getElementById('message');
const timeDisplay = document.getElementById('time');

let timeRemaining = 30; // Tempo em segundos
let timerInterval;

// Função para embaralhar os ícones
const shuffleIcons = () => {
  const iconContainer = document.getElementById('icon-container');
  const iconsArray = Array.from(iconContainer.children);

  // Embaralha os ícones usando Fisher-Yates
  for (let i = iconsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [iconsArray[i], iconsArray[j]] = [iconsArray[j], iconsArray[i]];
  }

  iconsArray.forEach(icon => iconContainer.appendChild(icon));
};

// Função para iniciar o timer
const startTimer = () => {
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeDisplay.textContent = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      verifyOrganization(); // Verifica automaticamente quando o tempo acaba
    }
  }, 1000);
};

// Evento para iniciar o jogo
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none'; // Esconde a tela inicial
  gameContainer.style.display = 'block'; // Exibe o jogo
  verifyButton.style.display = 'inline-block'; // Exibe o botão "Verificar"

  shuffleIcons(); // Embaralha os ícones
  startTimer(); // Inicia o timer
});

// Permitir arrastar os ícones
icons.forEach(icon => {
  icon.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', icon.getAttribute('data-type')); // Define o tipo do ícone
    e.dataTransfer.setData('id', icon.id); // Passa o ID do ícone
  });
});

// Permitir que as zonas aceitem o drop
dropzones.forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessário para permitir o drop
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();

    const draggedType = e.dataTransfer.getData('type'); // Recupera o tipo do ícone arrastado
    const zoneType = zone.getAttribute('data-type'); // Recupera o tipo da dropzone

    if (draggedType === zoneType) {
      // Adiciona o ícone arrastado à zona
      const draggedId = e.dataTransfer.getData('id');
      const draggedElement = document.getElementById(draggedId);
      zone.appendChild(draggedElement);
      zone.classList.add('correct');
    } else {
      zone.classList.add('wrong');
    }
  });
});

// Função para verificar a organização
const verifyOrganization = () => {
  let correct = true;

  dropzones.forEach(zone => {
    const children = zone.querySelectorAll('.icon');
    children.forEach(child => {
      if (child.getAttribute('data-type') !== zone.getAttribute('data-type')) {
        correct = false;
      }
    });
  });

  if (correct) {
    message.textContent = 'Parabéns! O código da sua atividade é 12345.';
    message.style.color = 'green';
  } else {
    message.textContent = 'Você errou! O código da sua atividade é 67890.';
    message.style.color = 'red';
  }
};

// Botão de verificar
verifyButton.addEventListener('click', () => {
  clearInterval(timerInterval); // Para o timer ao clicar em verificar
  verifyOrganization();
});
