const connectDB = require("./backend/config/db.js");
const express = require("express");
const path = require("path");
const User = require("./backend/models/user.js");
const mongoose = require("mongoose");

const app = express();

// Connect to Database
connectDB();
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages')); // Assuming your EJS files are located in the 'views' directory

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simulate login logic (replace with your actual logic)
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ username: user.username, rollNo: user.rollNo }); // Send user data
    } else {
        res.status(401).json({ message: "Invalid username or password" }); // Unauthorized
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'signup.html'));
});

app.post('/register', async (req, res) => {
    const { name, rollNo, age, gender, password } = req.body;

    // Check if roll number already exists in the database
    const existingUser = await User.findOne({ rollNo });
    if (existingUser) {
        return res.send("User is already registered");
    }

    // If roll number doesn't exist, create a new user and save it to the database
    const newUser = new User({ name, rollNo, age, gender, password });
    await newUser.save();

    // Redirect the user to the dashboard
    res.redirect('/dashboard/');
});

app.get('/quiz', async (req, res) => {
    try {
        // Mongoose model for the Question schema
        const Question = mongoose.model('Question', {
            question: String,
            options: [String],
            correctOption: Number
        });

        // Fetch 5 random questions from the database
        const randomQuestions = await getRandomQuestionsFromDB(Question, 5);
        // Render the quiz page with the fetched questions
        res.render('quiz', { questions: randomQuestions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to get n random questions from the database
async function getRandomQuestionsFromDB(Question, n) {
    try {
        // Fetch n random questions from the database
        const questions = await Question.aggregate([{ $sample: { size: n } }]);
        return questions;
    } catch (error) {
        throw new Error('Error fetching questions from database:', error);
    }
}


// Function to get n random questions from the database
async function getRandomQuestionsFromDB(Question, n) {
    try {
        // Fetch n random questions from the database
        const questions = await Question.aggregate([{ $sample: { size: n } }]);
        return questions;
    } catch (error) {
        throw new Error('Error fetching questions from database:', error);
    }
}

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

app.post('/quiz', async (req, res) => {
    const submittedAnswers = req.body;
    try {
        // Logic to evaluate the submitted answers and calculate the score
        let score = 0;
        for (const questionId in submittedAnswers) {
            const selectedOption = parseInt(submittedAnswers[questionId]);
            const question = await Question.findById(questionId);
            if (question && question.correctOption === selectedOption) {
                score++;
            }
        }

        // Display the result to the user
        res.send(`Your score is: ${score}`);
    } catch (error) {
        console.error('Error evaluating quiz:', error);
        res.status(500).send('Internal Server Error');
    }
});

