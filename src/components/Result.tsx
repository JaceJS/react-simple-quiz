import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';
import { Question } from '../types';

const Result: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { answers, questions } = location.state as { answers: string[], questions: Question[] };

    // Count correct answers
    const correctAnswersCount = questions.filter((question: Question, index: number) =>
        question.correct_answer === answers[index]
    ).length;

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4} mb={4} textAlign="center">
                <Typography variant="h4" gutterBottom>Quiz Results</Typography>
                <Typography variant="body1">Total Questions: {questions.length}</Typography>
                <Typography variant="body1">Correct Answers: {correctAnswersCount}</Typography>
                <Typography variant="body1">Incorrect Answers: {questions.length - correctAnswersCount}</Typography>

                <Box mt={4} display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/quiz')}
                        sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }} // Warna biru
                    >
                        Play Again
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogout}
                        sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#c62828' } }} // Warna merah
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Result;
