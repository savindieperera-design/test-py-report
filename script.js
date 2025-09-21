// NAVBAR 
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}


// HOME PAGE 
if (document.body.contains(document.getElementById("hero-text"))) {
 
  const slogans = [
    "Healthy Living Starts Today",
    "Eat Well, Live Well",
    "Your Wellness, Our Priority",
    "Strong Body, Calm Mind"
  ];
  let index = 0;
  const heroText = document.getElementById("hero-text");

  setInterval(() => {
    index = (index + 1) % slogans.length;
    heroText.textContent = slogans[index];
  }, 3000);

  
  const tips = [
    "Drink at least 8 glasses of water daily.",
    "Walk for 30 minutes every day.",
    "Eat more fruits and vegetables.",
    "Get at least 7 hours of sleep.",
    "Stretch for 10 minutes in the morning."
  ];
  const today = new Date().getDate();
  document.getElementById("tip").textContent = tips[today % tips.length];

  
  document.getElementById("newsletter-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;
    localStorage.setItem("newsletterEmail", email);
    alert("Thank you for subscribing!");
    this.reset();
  });
}


// CALCULATOR PAGE 

function animateCounter(id, endValue, duration = 1000) {
  const element = document.getElementById(id);
  let start = 0;
  const increment = endValue / (duration / 16);
  const counter = setInterval(() => {
    start += increment;
    if (start >= endValue) {
      element.textContent = Math.round(endValue);
      clearInterval(counter);
    } else {
      element.textContent = Math.round(start);
    }
  }, 16);
}

function animateProgressBar(barId, counterId, value, max = 200) {
  const bar = document.getElementById(barId);
  const span = document.getElementById(counterId);
  let width = 0;
  const targetWidth = Math.min((value / max) * 100, 100); 
  const increment = targetWidth / 60; 
  const counterIncrement = value / 60;

  let displayedValue = 0;
  const interval = setInterval(() => {
    width += increment;
    displayedValue += counterIncrement;
    if (width >= targetWidth) {
      width = targetWidth;
      displayedValue = value;
      clearInterval(interval);
    }
    bar.style.width = width + "%";
    span.textContent = Math.round(displayedValue);
  }, 16);
}

if (document.getElementById("calorieForm")) {
  document.getElementById("calorieForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const height = parseInt(document.getElementById("height").value);
    const weight = parseInt(document.getElementById("weight").value);
    const activity = parseFloat(document.getElementById("activity").value);

    if (!age || !gender || !height || !weight || !activity) {
      alert("Please fill all fields!");
      return;
    }

    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activity;
    const carbs = (tdee * 0.50) / 4;
    const protein = (tdee * 0.20) / 4;
    const fat = (tdee * 0.30) / 9;

    document.getElementById("results").style.display = "block";

    
    animateCounter("bmrResult", Math.round(bmr));
    animateCounter("tdeeResult", Math.round(tdee));

    
    animateProgressBar("carbsBar", "carbsResult", Math.round(carbs), 300);
    animateProgressBar("proteinBar", "proteinResult", Math.round(protein), 150);
    animateProgressBar("fatBar", "fatResult", Math.round(fat), 100);
  });
}



// WORKOUT PAGE


 document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("workoutForm")) {
    const workouts = {
      arms: { none: "Push-ups", dumbbells: "Bicep Curls", bands: "Band Shoulder Press" },
      legs: { none: "Squats", dumbbells: "Dumbbell Lunges", bands: "Band Glute Bridges" },
      core: { none: "Plank", dumbbells: "Russian Twists", bands: "Band Russian Twists" },
      fullbody: { none: "Burpees", dumbbells: "Dumbbell Squat Press", bands: "Band Deadlifts" }
    };

    const form = document.getElementById("workoutForm");
    const list = document.getElementById("workoutList");
    const results = document.getElementById("workoutResults");
    const timerDisplay = document.getElementById("workoutTimer");

    let interval = null;

    
    const saved = JSON.parse(localStorage.getItem("currentWorkout"));
    if (saved) {
      resumeWorkout(saved.exercise, saved.startTime, saved.duration);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const bodyPart = document.getElementById("bodyPart").value;
      const equipment = document.getElementById("equipment").value;

      if (!bodyPart || !equipment) {
        alert("Please select both options.");
        return;
      }

      if (localStorage.getItem("currentWorkout")) {
        alert("A workout is already running. Please finish it first!");
        return;
      }

      const exercise = workouts[bodyPart][equipment];
      const duration = 60;
      const startTime = Date.now();

      localStorage.setItem("currentWorkout", JSON.stringify({ exercise, startTime, duration }));

      showWorkout(exercise, duration);
      startTimer(exercise, startTime, duration);
    });

    function showWorkout(exercise, timeLeft) {
      results.style.display = "block";
      list.innerHTML = `<li>Exercise: ${exercise}</li>`;
      timerDisplay.textContent = `${exercise} - ${timeLeft}s`;
    }

    function startTimer(exercise, startTime, duration) {
      clearInterval(interval);
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = duration - elapsed;

        if (timeLeft > 0) {
          timerDisplay.textContent = `${exercise} - ${timeLeft}s`;
        } else {
          clearInterval(interval);
          timerDisplay.textContent = "✅ Workout Complete!";
          localStorage.removeItem("currentWorkout");
        }
      }, 1000);
    }

    function resumeWorkout(exercise, startTime, duration) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeLeft = duration - elapsed;

      if (timeLeft > 0) {
        showWorkout(exercise, timeLeft);
        startTimer(exercise, startTime, duration);
      } else {
        timerDisplay.textContent = "✅ Workout Complete!";
        localStorage.removeItem("currentWorkout");
      }
    }
  }
});



// CONTACT PAGE

if (document.getElementById("contactForm")) {
  document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ name, email, message, date: new Date().toLocaleString() });
    localStorage.setItem("messages", JSON.stringify(messages));

    alert("Thank you for your message! We’ll get back to you soon.");
    this.reset();
  });
}

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const isOpen = answer.style.display === 'block';
    answer.style.display = isOpen ? 'none' : 'block';
  });
});

