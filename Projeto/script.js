// Elementos
const iconsContainer = document.getElementById('icon-container');
const icons = document.querySelectorAll('.icon');
const dropzones = document.querySelectorAll('.dropzone');
const verifyButton = document.getElementById('verify');
const message = document.getElementById('message');
const timeDisplay = document.getElementById('time');
const restartButton = document.getElementById('restart');

let timeRemaining = 30; // Tempo em segundos
let timerInterval;

// Função para embaralhar os ícones
const shuffleIcons = () => {
  const iconsArray = Array.from(iconsContainer.children); // Converte os ícones em um array

  // Embaralha os ícones com o algoritmo Fisher-Yates
  for (let i = iconsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [iconsArray[i], iconsArray[j]] = [iconsArray[j], iconsArray[i]];
  }

  // Reinsere os ícones no contêiner na nova ordem
  iconsArray.forEach(icon => iconsContainer.appendChild(icon));
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

// Permitir arrastar os ícones
icons.forEach(icon => {
  icon.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', icon.getAttribute('data-type'));
  });
});

// Permitir soltar nas zonas corretas
dropzones.forEach(zone => {
  zone.addEventListener('dragover', (e) => e.preventDefault());

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (zone.getAttribute('data-type') === type) {
      zone.appendChild(document.querySelector(`.icon[data-type="${type}"]`));
      zone.classList.add('correct');
    } else {
      zone.classList.add('wrong');
    }
  });
});

// Verificar organização
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

  verifyButton.disabled = true; // Desativa o botão após a verificação
};

// Botão de verificar
verifyButton.addEventListener('click', () => {
  clearInterval(timerInterval); // Para o timer ao clicar em verificar
  verifyOrganization();
});

// Embaralha os ícones e inicia o jogo
shuffleIcons();
startTimer();

// Reiniciar o jogo
restartButton.addEventListener('click', () => {
  location.reload(); // Recarrega a página
});
