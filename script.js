// Achievement System
const achievements = {
    firstWorkout: {
        id: 'firstWorkout',
        title: 'First Step',
        description: 'Complete your first workout',
        requirement: (workouts) => workouts.length >= 1
    },
    consistentWeek: {
        id: 'consistentWeek',
        title: 'Consistency King',
        description: 'Complete workouts 7 days in a row',
        requirement: (workouts) => checkStreak(workouts) >= 7
    },
    caloriesBurner: {
        id: 'caloriesBurner',
        title: 'Calorie Crusher',
        description: 'Burn 1000+ calories in a single week',
        requirement: (workouts) => calculateWeeklyCalories(workouts) >= 1000
    }
};

// Check workout streak
function checkStreak(workouts) {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 1;
    
    for (let i = 1; i < sortedWorkouts.length; i++) {
        const diff = Math.abs(
            (new Date(sortedWorkouts[i-1].date) - new Date(sortedWorkouts[i].date)) / (1000 * 60 * 60 * 24)
        );
        if (diff === 1) streak++;
        else break;
    }
    
    return streak;
}

// Calculate weekly calories
function calculateWeeklyCalories(workouts) {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return workouts
        .filter(w => new Date(w.date) >= weekAgo)
        .reduce((sum, w) => sum + w.calories, 0);
}

// Favorite workout functionality
function toggleFavorite(workoutId) {
    const workoutElement = document.querySelector(`[data-workout-id="${workoutId}"]`);
    const isFavorite = workoutElement.classList.toggle('favorite');
    
    // Update in localStorage
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex !== -1) {
        workouts[workoutIndex].favorite = isFavorite;
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}

// Print workout summary
function printWorkoutSummary() {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const printContent = `
        <html>
            <head>
                <title>Workout Summary</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; border: 1px solid #ddd; }
                    th { background: #f5f5f5; }
                </style>
            </head>
            <body>
                <h1>Workout Summary</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Calories</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workouts.map(w => `
                            <tr>
                                <td>${new Date(w.date).toLocaleDateString()}</td>
                                <td>${w.type}</td>
                                <td>${w.duration} min</td>
                                <td>${w.calories}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Motivational quotes system
const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Small progress is still progress.",
    "Your future self will thank you.",
    "Every rep counts, every step matters.",
    "Success starts with self-discipline."
];

function showWorkoutReminder() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = quote;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Countdown timer
class WorkoutCountdown {
    constructor(targetDate, displayElement) {
        this.targetDate = new Date(targetDate);
        this.displayElement = displayElement;
        this.interval = null;
    }
    
    start() {
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = this.targetDate - now;
            
            if (distance < 0) {
                clearInterval(this.interval);
                this.displayElement.textContent = "Challenge time!";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            this.displayElement.textContent = `${days}d ${hours}h ${minutes}m until challenge`;
        }, 1000);
    }
    
    stop() {
        if (this.interval) clearInterval(this.interval);
    }
}   