
const envelope = document.querySelector('.envelope-wrapper');
const goToMenuBtn = document.getElementById('go-to-menu');

envelope.addEventListener('click', () => {
envelope.classList.toggle('flap');

if (envelope.classList.contains('flap')) {
    goToMenuBtn.classList.remove('hidden');
    goToMenuBtn.classList.add('visible');
} else {
    goToMenuBtn.classList.remove('visible');
    goToMenuBtn.classList.add('hidden');
}
});

