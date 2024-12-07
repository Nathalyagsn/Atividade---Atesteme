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
const restartButton = document.getElementById('restart-button');

// Variáveis de controle
let timeRemaining = 30; 
let timerInterval;
let score = 0;
let gameVerified = false; 
let gamefinished = false;

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
      verifyOrganization();
      gamefinished = true;
    }
  }, 1000);
};

// Função para verificar e calcular a pontuação
const verifyOrganization = () => {
  if (gameVerified) return;
  gameVerified = true;

  clearInterval(timerInterval);

  let allCorrect = true; 
  let allFilled = true;

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

  // Exibe a pontuação e a mensagem apropriada
  if (!allFilled) {
    message.textContent = "Você precisa preencher todos os espaços abaixo!";
    message.style.color = "orange";
    message.style.textShadow = "1px 2px black";
  } else if (!allCorrect) {
    message.textContent = `Seu código é: ${score}. A organização está incorreta!`;
    message.style.color = "red";
  } else {
    message.textContent = `Parabéns! Seu código é: ${score}`;
    message.style.color = "green";
  }

  restartButton.style.display = 'block'; 
  verifyButton.style.display = 'none'; 
};

// Função que verifica se todas as dropzones estão preenchidas e não há ícones sobrando
const checkAllDropzonesFilled = () => {
  const iconsOutsideDropzones = Array.from(document.querySelectorAll('.icon')).filter( icon => !icon.closest('.dropzone'));

  if (iconsOutsideDropzones.length === 0) {
    verifyButton.style.display = 'inline-block';
  }else {
    verifyButton.style.display = 'none';
  }

};

// Evento para iniciar o jogo
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block'; 
  shuffleIcons();
  startTimer(); 
  checkAllDropzonesFilled();
});

// Evento de clique no botão "Verificar"
verifyButton.addEventListener('click', () => {
  gamefinished = true;
  verifyOrganization();
});

// Lógica de arrastar e soltar (drag and drop)
icons.forEach(icon => {
  icon.addEventListener('dragstart', e => {
    if (gamefinished === false) {
      e.dataTransfer.setData('type', icon.getAttribute('data-type'));
      e.dataTransfer.setData('id', icon.id);
    } else {
      e.preventDefault(); 
      console.log('Ação de arrastar bloqueada: o jogo já terminou.');
    }
  });
});


dropzones.forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData('id');
    const draggedElement = document.getElementById(draggedId);

    if (!zone.contains(draggedElement)) {
      zone.appendChild(draggedElement);
    }

    checkAllDropzonesFilled();
  });
});

// Evento para reiniciar o jogo (recarregar a página)
restartButton.addEventListener('click', () => {
  location.reload(); 
});
