// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll to booking section
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// Booking Form Submission
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('roomType').value;
    const messageDiv = document.getElementById('bookingMessage');

    // Validate dates
    if (new Date(checkIn) >= new Date(checkOut)) {
        messageDiv.textContent = 'Check-out date must be after check-in date!';
        messageDiv.classList.remove('success');
        messageDiv.classList.add('error');
        return;
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Room prices
    const roomPrices = {
        standard: 79,
        deluxe: 129,
        suite: 249
    };

    const totalPrice = roomPrices[roomType] * nights;

    messageDiv.innerHTML = `
        <strong>Booking Confirmed!</strong><br>
        Room Type: ${roomType.charAt(0).toUpperCase() + roomType.slice(1)}<br>
        Guests: ${guests}<br>
        Nights: ${nights}<br>
        Total Price: $${totalPrice.toFixed(2)}<br>
        <small>A confirmation email will be sent to you shortly.</small>
    `;
    messageDiv.classList.remove('error');
    messageDiv.classList.add('success');

    // Reset form
    document.getElementById('bookingForm').reset();
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = e.target;
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    // Simple validation
    if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
        alert('Please fill all fields!');
        return;
    }

    // Show success message
    const button = form.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Message Sent!';
    button.style.background = '#27ae60';

    // Reset form
    form.reset();

    // Restore button after 2 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);

    console.log('Form submitted:', {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    });
});

// Room card selection
document.querySelectorAll('.room-card button').forEach(button => {
    button.addEventListener('click', (e) => {
        const roomCard = e.target.closest('.room-card');
        const roomName = roomCard.querySelector('h3').textContent;
        
        // Scroll to booking and set room type
        const roomTypeSelect = document.getElementById('roomType');
        const roomTypeValue = roomName.toLowerCase().split(' ')[0];
        
        roomTypeSelect.value = roomTypeValue;
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        
        // Show visual feedback
        e.target.textContent = 'Selected!';
        e.target.style.background = '#27ae60';
        setTimeout(() => {
            e.target.textContent = 'Select';
            e.target.style.background = '';
        }, 1500);
    });
});

// Set minimum check-in date to today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    checkInInput.setAttribute('min', today);

    // Update minimum check-out date
    checkInInput.addEventListener('change', () => {
        const checkOutInput = document.getElementById('checkOut');
        const minCheckOut = new Date(checkInInput.value);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        checkOutInput.setAttribute('min', minCheckOut.toISOString().split('T')[0]);
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards and room cards
document.querySelectorAll('.feature-card, .room-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Stagger animation for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .room-card, .testimonial-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
        }, 100);
    });
});
