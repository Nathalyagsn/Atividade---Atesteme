// Elementos
const icons = document.querySelectorAll('.icon');
const dropzones = document.querySelectorAll('.dropzone');
const verifyButton = document.getElementById('verify');
const message = document.getElementById('message');

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
verifyButton.addEventListener('click', () => {
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
});
