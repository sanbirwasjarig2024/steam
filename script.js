// Select elements
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const introGif = document.getElementById('introGif');
const container = document.querySelector('.container');
const loginForm = document.querySelector('.login-form');
const birthdayMessage = document.getElementById('birthdayMessage');

// Select all spans (text messages) and image elements inside birthdayMessage
// Correct order of spans and images
const messageElements = [
    document.getElementById('message1'),
    document.getElementById('message2'),
    document.getElementById('message3'),
    document.getElementById('message4'),
    document.getElementById('message5'),
    document.getElementById('message6'),
    document.getElementById('message7'),
    document.getElementById('message8'),
    document.getElementById('message10'),
    document.getElementById('moon1'),        // Image appears after message10
    document.getElementById('message12'),
    document.getElementById('hurricanes'),   // Image appears after message12
    document.getElementById('message14'),
    document.getElementById('calendar'),     // Image appears after message14
    document.getElementById('message16'),
    document.getElementById('max_rewind1'),
    document.getElementById('message18'),
    document.getElementById('max_rewind2'),
    document.getElementById('message19'),
    document.getElementById('message20')
];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // Full-screen canvas

let particlesArray = [];

// Function to animate letters of text
function animateLetters(element) {
    const text = element.innerText;  // Get the text content of the element
    element.innerText = '';  // Clear the element's text
    const chars = [...text];  // Split the text into individual characters

    // Create span for each character and append it to the element
    chars.forEach((char, index) => {
        const span = document.createElement('span');  
        span.classList.add('letter');  // Add the animation class
        span.style.animationDelay = `${index * 0.05}s`;  // Delay for each letter

        // Check if the character is a space
        if (char === ' ') {
            span.innerHTML = '&nbsp;';  // Non-breaking space
        } else {
            span.innerText = char;  // Set the character
        }

        element.appendChild(span);  // Add the span to the element
    });
}

function showMaxPhotoEffect() {
    // Step 1: Show the max image
    const maxPhoto = document.getElementById('max');
    maxPhoto.style.display = 'block';
    setTimeout(() => {
        maxPhoto.style.opacity = 1; // Fully visible
    }, 10); // Small delay for opacity transition

    // Step 2: Flash white and then blackout (photo effect)
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100vw';
    flashOverlay.style.height = '100vh';
    flashOverlay.style.backgroundColor = 'white';
    flashOverlay.style.opacity = '0';
    flashOverlay.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(flashOverlay);

    // Flash white and then blackout after 2 seconds
    setTimeout(() => {
        flashOverlay.style.opacity = '1'; // Flash to white
        setTimeout(() => {
            flashOverlay.style.backgroundColor = 'black'; // Change to black (blackout)
            setTimeout(() => {
                flashOverlay.style.opacity = '0'; // Fade out the blackout
                
                init(); // Start butterfly animation
                // Step 3: Remove Max photo after the blackout effect
                maxPhoto.style.display = 'none'; // Hide Max photo
                
                init(); // Start butterfly animation
                

                // Start the butterfly animation after the blackout effect
                setTimeout(() => {
                    flashOverlay.remove(); // Remove the overlay
                    showLoginForm();  // Ensure this line is present
                    
                }, 300); // Give some delay before starting butterfly animation
            }, 400); // Keep blackout for a short duration
        }, 300); // Keep white flash for a short duration
    }, 2000); // Delay of 2 seconds before the flash effect
}



function showBirthdayMessages() {
    let delay = 0; // Initial delay

    // Loop through each element and display it in sequence
    messageElements.forEach((element, index) => {
        if (!element) {
            console.error(`Element with index ${index} is missing.`);
            return; // Skip this iteration if the element is null
        }

        let displayTime = 2000; // Default display time for images (1 second)

        if (element.tagName === 'SPAN') {
            // Calculate display time based on the length of the text (for spans)
            const textLength = element.innerText.length;
            displayTime = 1000 + textLength * 60; // 100ms per character for text messages

            // Show the text element
            setTimeout(() => {
                // Hide all previous elements
                messageElements.forEach(el => {
                    if (el) {
                        el.style.opacity = '0';
                        el.style.display = 'none';
                    }
                });

                // Display the current text element
                element.style.display = 'block'; // Ensure it's visible
                setTimeout(() => {
                    element.style.opacity = 1; // Text is fully opaque
                }, 10);  // Give a tiny delay to allow CSS transition to kick in

                animateLetters(element);  // Animate letters for text spans

                // Check for the next image element
                const nextElement = messageElements[index + 1];
                if (nextElement && nextElement.tagName === 'IMG') {
                    setTimeout(() => {
                        nextElement.style.display = 'block'; // Ensure the image is visible
                        setTimeout(() => {
                            nextElement.style.opacity = 0.5; // Set image opacity to 0.5 (semi-transparent)
                        }, 10);  // Small delay to allow CSS transition to work
                    }, textLength * 50);  // Show the image halfway through the text animation
                }
            }, delay);
        } else if (element.tagName === 'IMG') {
            // For images, just display them with a smooth fade-in
            setTimeout(() => {
                element.style.display = 'block'; // Ensure it's visible
                setTimeout(() => {
                    element.style.opacity = 0.5; // Smooth fade-in with semi-transparent opacity
                }, 10);  // Give a tiny delay to allow CSS transition to work
            }, delay);
        }

        // Set a common timeout for fading out both text and images
        setTimeout(() => {
            element.style.opacity = 0; // Fade out after display time
        }, delay + displayTime);

        // Update the delay for the next element
        delay += displayTime + 500;  // Add buffer time (e.g., 500ms) between elements
    });

    // When the birthday messages finish, do not trigger Max photo effect or anything else here.
    setTimeout(() => {
        birthdayMessage.style.display = 'none';
        container.style.display = 'block';  // Only show the container after the messages
    }, delay + 1000);  // Wait for all messages to show before hiding
}


// Function to handle the animation sequence
function startAnimationSequence() {
    // Step 1: Show the intro GIF, and wait for 4.5 seconds before transitioning
    setTimeout(() => {
        // Hide the intro GIF
        document.querySelector('.intro-gif').style.display = 'none';
        
        // Step 2: Show the Happy Birthday message and display each element sequentially
        birthdayMessage.style.display = 'block';
        showBirthdayMessages();  // Show elements one by one
        
        // Step 3: After the birthday messages finish, trigger the Max photo effect
        // Calculate the total time it takes for all birthday messages to display
        const birthdayMessagesDuration = calculateBirthdayMessagesDuration();  // Add this function to calculate duration

        // Step 4: Trigger the Max photo effect after birthday messages are done
        setTimeout(() => {
            showMaxPhotoEffect();  // Trigger the Max photo effect after the birthday messages
        }, birthdayMessagesDuration);  // Max photo effect starts after messages

    }, 4500);  // 4.5 seconds delay for GIF (as per the GIF length)
}



// Butterfly particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;  // Size adjusted for butterflies
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.aspectRatio = butterflyImage.width / butterflyImage.height; // Get aspect ratio of butterfly image
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;  // Reduce size gradually
    }
    draw() {
        const width = this.size;  // Use the particle's size as width
        const height = this.size / this.aspectRatio;  // Calculate height based on aspect ratio
        ctx.drawImage(butterflyImage, this.x, this.y, width, height);  // Draw the butterfly image
    }
}

function calculateBirthdayMessagesDuration() {
    let totalDuration = 0;

    // Loop through each message to calculate the total display time
    messageElements.forEach((element) => {
        if (element.tagName === 'SPAN') {
            // Calculate display time based on the text length (100ms per character)
            const textLength = element.innerText.length;
            const displayTime = 1000 + textLength * 60;  // 100ms per character for text messages
            totalDuration += displayTime + 500;  // Add buffer time between elements
        } else if (element.tagName === 'IMG') {
            // Fixed display time for images
            totalDuration += 2000 + 500;  // 3500ms display time + 500ms buffer
        }
    });

    return totalDuration;
}


// Initialize particles
function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }
    animate(); // Start the animation loop
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

function showLoginForm() {
    const loginForm = document.querySelector('.login-form'); // Select the login form container
    
    // Step 1: Make the login form container visible
    loginForm.style.display = 'block'; // Ensure the login form is displayed

    // Step 2: Use a small timeout to allow the browser to recognize the display change
    setTimeout(() => {
        // Step 3: Add the class that triggers the sliding and fade-in animation
        loginForm.classList.add('show-login-form');
    }, 10); // Small delay to ensure CSS transition kicks in
}


// Load the butterfly image
const butterflyImage = new Image();
butterflyImage.src = 'img/butterfly1.png';  // Replace with the path to your butterfly image

// When the butterfly image is loaded, trigger the sequence
butterflyImage.onload = function() {
    startAnimationSequence();  // Start the whole sequence
};


function fadeInImage() {
    const image = document.querySelector('.image-container img'); // Select the image inside the container

    // Step 1: Set the opacity to 1 after a short delay to trigger the transition
    setTimeout(() => {
        image.style.opacity = '1';  // Set opacity to 1, transition will handle the fading
    }, 10); // Short delay to ensure the transition kicks in
}
