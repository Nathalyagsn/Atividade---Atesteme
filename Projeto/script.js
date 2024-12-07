// Seleção de elementos do DOM
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const icons = document.querySelectorAll('.icon');
const dropzones = document.querySelectorAll('.dropzone');
const verifyButton = document.getElementById('verify');
const message = document.getElementById('message');
const timeDisplay = document.getElementById('time');
const iconContainer = document.getElementById('icon-container');
const restartIcon = document.getElementById('restart-icon');
const restartButton = document.getElementById('restart-button');

// Variáveis de controle
let timeRemaining = 30; // Tempo inicial
let timerInterval;
let score = 0; // Pontuação inicial
let gameVerified = false; // Controle de verificação única

// Função para embaralhar os ícones
const shuffleIcons = () => {
  const iconsArray = Array.from(iconContainer.children);
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
      verifyOrganization(); // Verifica automaticamente ao término do tempo
    }
  }, 1000);
};

// Função para verificar e calcular a pontuação
const verifyOrganization = () => {
  if (gameVerified) return; // Impede múltiplas verificações
  gameVerified = true;

  // Para o timer
  clearInterval(timerInterval);

  let allCorrect = true; // Verifica se todos os ícones estão corretos
  let allFilled = true; // Verifica se todas as dropzones estão preenchidas

  dropzones.forEach(zone => {
    const children = zone.querySelectorAll('.icon');
    if (children.length === 0) {
      allFilled = false; // Dropzone vazia
    } else {
      children.forEach(child => {
        if (child.getAttribute('data-type') !== zone.getAttribute('data-type')) {
          allCorrect = false; // Ícone errado
          score -= 1; // Pontuação negativa para ícone incorreto
          zone.classList.add('wrong'); // Marca como erro
        } else {
          score += 1; // Pontuação positiva para ícone correto
          zone.classList.add('correct'); // Marca como correto
        }
      });
    }
  });

  // Adiciona pontos do tempo restante
  score += timeRemaining;

  // Atualiza a mensagem de resultado
  if (!allFilled) {
    message.textContent = "Você precisa preencher todas as dropzones!";
    message.style.color = "orange";
  } else if (score > 0) {
    message.textContent = `Seu código é: ${score}`;
    message.style.color = "green";
  } else {
    message.textContent = "Organize para receber o código!";
    message.style.color = "red";
  }

  // Exibe o botão de reinício após verificar
  restartIcon.style.display = 'block';
  verifyButton.style.display = 'none'; // Esconde o botão "Verificar"
};

// Evento para iniciar o jogo
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none'; // Esconde a tela inicial
  gameContainer.style.display = 'block'; // Exibe o jogo
  shuffleIcons(); // Embaralha os ícones
  startTimer(); // Inicia o timer
});

// Evento de clique no botão "Verificar"
verifyButton.addEventListener('click', () => {
  verifyOrganization(); // Verifica a organização ao clicar
});

// Lógica de arrastar e soltar (drag and drop)
icons.forEach(icon => {
  icon.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', icon.getAttribute('data-type'));
    e.dataTransfer.setData('id', icon.id);
  });
});

dropzones.forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault(); // Necessário para permitir o drop
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData('id');
    const draggedElement = document.getElementById(draggedId);

    if (!zone.contains(draggedElement)) {
      zone.appendChild(draggedElement); // Move o ícone para a dropzone
    }

    // Verifica se todos os ícones foram movidos
    const totalIconsPlaced = Array.from(dropzones).reduce(
      (sum, zone) => sum + zone.querySelectorAll('.icon').length,
      0
    );

    if (totalIconsPlaced === icons.length) {
      verifyButton.style.display = 'inline-block'; // Exibe o botão "Verificar"
    }
  });
});

// Evento para reiniciar o jogo (recarregar a página)
restartButton.addEventListener('click', () => {
  location.reload(); // Recarrega a página para reiniciar o jogo
});
