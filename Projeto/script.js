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
let timeRemaining = 30; // Tempo em segundos
let timerInterval;
let iconsInDropzones = 0; // Contador de ícones nas dropzones
let score = 0; // Pontuação inicial
let gameVerified = false; // Controle para impedir verificações duplicadas

// Função para embaralhar os ícones
const shuffleIcons = () => {
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
      calculateScore(false); // Calcula a pontuação apenas com as dropzones
    }
  }, 1000);
};

// Função para calcular a pontuação final
const calculateScore = (addTime = true) => {
  if (gameVerified) return; // Evita múltiplas verificações
  gameVerified = true; // Marca o jogo como verificado

  // Pontuação baseada nos ícones nas dropzones
  dropzones.forEach(zone => {
    const children = zone.querySelectorAll('.icon');
    children.forEach(child => {
      if (child.getAttribute('data-type') === zone.getAttribute('data-type')) {
        score += 1; // Pontuação positiva para ícones corretos
      } else {
        score -= 1; // Pontuação negativa para ícones incorretos
      }
    });
  });

  // Adiciona os pontos do tempo restante (se aplicável)
  if (addTime && timeRemaining > 0) {
    score += timeRemaining;
  }

  // Exibe a mensagem final em um pop-up
  if (score > 0) {
    alert(`Seu código é: ${score}`);
  } else {
    alert(`Organize para receber o código!`);
  }

  // Esconde o botão "Verificar" após a verificação
  verifyButton.style.display = 'none';
  // Exibe o botão de reinício
  restartIcon.style.display = 'block';
};

// Evento para verificar a organização
const verifyOrganization = () => {
  clearInterval(timerInterval); // Para o timer
  calculateScore(); // Calcula os pontos finais e exibe a mensagem
};

// Evento para iniciar o jogo
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none'; // Esconde a tela inicial
  gameContainer.style.display = 'block'; // Exibe o jogo

  shuffleIcons(); // Embaralha os ícones
  startTimer(); // Inicia o timer
});

// Evento de clique para verificar a organização
verifyButton.addEventListener('click', () => {
  clearInterval(timerInterval); // Para o timer ao clicar em verificar
  verifyOrganization();
});

// Lógica de arrastar e soltar (drag and drop)
icons.forEach(icon => {
  icon.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', icon.getAttribute('data-type')); // Define o tipo do ícone
    e.dataTransfer.setData('id', icon.id); // Passa o ID do ícone
  });
});

dropzones.forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessário para permitir o drop
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();

    const draggedType = e.dataTransfer.getData('type');
    const draggedId = e.dataTransfer.getData('id');
    const zoneType = zone.getAttribute('data-type');

    const draggedElement = document.getElementById(draggedId);

    // Adiciona o elemento na dropzone correta
    if (draggedType === zoneType) {
      if (!draggedElement.parentElement.classList.contains('dropzone')) {
        iconsInDropzones++; // Incrementa o contador de ícones nas dropzones
      }

      // Remove classes de erro, se existirem
      zone.classList.remove('wrong');
      zone.classList.add('correct');
      zone.appendChild(draggedElement); // Move o ícone para a dropzone correta
    } else {
      // Marca como erro
      zone.classList.add('wrong');
    }

    // Verifica se todos os ícones foram movidos
    if (iconsInDropzones === icons.length) {
      verifyButton.style.display = 'inline-block'; // Exibe o botão "Verificar"
    }
  });
});

// Evento para reiniciar o jogo
restartButton.addEventListener('click', () => {
  location.reload(); // Recarrega a página para reiniciar o jogo
});
