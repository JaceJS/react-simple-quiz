import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Container, LinearProgress, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Question, QuizState } from '../types';

const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(120);
    const navigate = useNavigate();

    // Save and load quiz state from localStorage
    const saveQuizState = (quizState: QuizState) => {
        localStorage.setItem('quizState', JSON.stringify(quizState));
    };
    const loadQuizState = (): QuizState | null => {
        const savedState = localStorage.getItem('quizState');
        return savedState ? JSON.parse(savedState) : null;
    };

    // Save quiz state to localStorage
    useEffect(() => {
        if (questions.length > 0) {
            saveQuizState({
                questions,
                currentQuestionIndex,
                answers,
                timeLeft,
            });
        }
    }, [questions, currentQuestionIndex, answers, timeLeft]);

    // Fetch questions from LocalStorage or API
    useEffect(() => {
        const fetchQuestions = async () => {
            const savedState = loadQuizState();

            if (savedState) {
                setQuestions(savedState.questions);
                setCurrentQuestionIndex(savedState.currentQuestionIndex);
                setAnswers(savedState.answers);
                setTimeLeft(savedState.timeLeft);
            } else {
                try {
                    const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple');
                    setQuestions(response.data.results);
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            }
        };

        fetchQuestions();
    }, []);

    // If time runs out, redirect to /result 
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsQuizFinished(true);
            navigate('/result', { state: { answers, questions } });
            localStorage.removeItem('quizState');
        }
    }, [timeLeft, navigate, answers, questions]);

    // Handle answer selection
    const handleAnswer = (answer: string) => {
        setAnswers([...answers, answer]);

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsQuizFinished(true);
            navigate('/result', { state: { answers, questions } });
            localStorage.removeItem('quizState');
        }
    };

    if (isQuizFinished) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h5">
                    Quiz Finished. Redirecting to results...
                </Typography>;
            </Box>
        );
    }

    // Loading questions
    if (questions.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ marginTop: '20px' }}>
                    Loading Questions...
                </Typography>
            </Box>
        );
    }

    // Display current question and get all answers
    const currentQuestion = questions[currentQuestionIndex];
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                <Typography variant="h5" gutterBottom>
                    Question {currentQuestionIndex + 1} / {questions.length}
                </Typography>
                <Typography variant="body1" gutterBottom dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                <Box mt={2}>
                    {allAnswers.map((answer, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            onClick={() => handleAnswer(answer)}
                            sx={{ marginBottom: '10px', display: 'block', width: '100%' }}
                        >
                            {answer}
                        </Button>
                    ))}
                </Box>
                <Box mt={4}>
                    <LinearProgress variant="determinate" value={(timeLeft / 120) * 100} />
                    <Typography mt={2}>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Quiz;
