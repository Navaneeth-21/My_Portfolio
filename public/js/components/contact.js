export function initContactForm() {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            console.log('Form submitted:', { name, email, subject, message });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
}