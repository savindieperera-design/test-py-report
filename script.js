// =======================
// NAVBAR (Hamburger Menu)
// =======================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// =======================
// HOME PAGE SCRIPTS
// =======================
if (document.body.contains(document.getElementById("hero-text"))) {
  // Hero auto-rotating slogans
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

  // Health Tip of the Day
  const tips = [
    "Drink at least 8 glasses of water daily.",
    "Walk for 30 minutes every day.",
    "Eat more fruits and vegetables.",
    "Get at least 7 hours of sleep.",
    "Stretch for 10 minutes in the morning."
  ];
  const today = new Date().getDate();
  document.getElementById("tip").textContent = tips[today % tips.length];

  // Newsletter localStorage
  document.getElementById("newsletter-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;
    localStorage.setItem("newsletterEmail", email);
    alert("Thank you for subscribing!");
    this.reset();
  });
}

// =======================
// CALCULATOR PAGE SCRIPTS
// =======================
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
    document.getElementById("bmrResult").textContent = `BMR: ${Math.round(bmr)} calories/day`;
    document.getElementById("tdeeResult").textContent = `TDEE: ${Math.round(tdee)} calories/day`;
    document.getElementById("carbsResult").textContent = `Carbs: ${Math.round(carbs)} g/day`;
    document.getElementById("proteinResult").textContent = `Protein: ${Math.round(protein)} g/day`;
    document.getElementById("fatResult").textContent = `Fat: ${Math.round(fat)} g/day`;
  });
}

// =======================
// WORKOUT PAGE SCRIPTS
// =======================

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

    // Load saved workout
    const saved = JSON.parse(localStorage.getItem("currentWorkout"));
    if (saved) {
      resumeWorkout(saved.exercise, saved.startTime, saved.duration);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // THIS stops the page reload

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


// =======================
// CONTACT PAGE
// =======================
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

    // For now just save message to localStorage (no backend)
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ name, email, message, date: new Date().toLocaleString() });
    localStorage.setItem("messages", JSON.stringify(messages));

    alert("Thank you for your message! We’ll get back to you soon.");
    this.reset();
  });
}
// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const isOpen = answer.style.display === 'block';
    answer.style.display = isOpen ? 'none' : 'block';
  });
});

