import React, { useState, useEffect } from 'react';
import './ChatbotPage.css';
import followUpQuestions from './questions'; // Importing the questions from the new file
import axios from 'axios'; // Importing axios to send the data to the backend

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [initialQuery, setInitialQuery] = useState(''); // Save initial query
    const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false);
    const [followUpAnswers, setFollowUpAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userLevel, setUserLevel] = useState(''); // To store if the user is beginner or experienced
    const [showUserLevelModal, setShowUserLevelModal] = useState(false); // Control showing the modal
    const [filteredQuestions, setFilteredQuestions] = useState([]); // Filtered questions for beginners
    const [finalized, setFinalized] = useState(false); // To track if the questions are finalized

    // Load chat data from localStorage when the component is mounted
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
        const savedInitialQuery = localStorage.getItem('initialQuery');
        const savedFollowUpAnswers = JSON.parse(localStorage.getItem('followUpAnswers'));
        const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
        const savedIsSubmitted = localStorage.getItem('isSubmitted');
        const savedUserLevel = localStorage.getItem('userLevel');
        const savedFilteredQuestions = JSON.parse(localStorage.getItem('filteredQuestions'));

        if (savedMessages) setMessages(savedMessages);
        if (savedInitialQuery) setInitialQuery(savedInitialQuery);
        if (savedFollowUpAnswers) setFollowUpAnswers(savedFollowUpAnswers);
        if (savedQuestionIndex) setCurrentQuestionIndex(parseInt(savedQuestionIndex));
        if (savedIsSubmitted) setIsSubmitted(savedIsSubmitted === 'true');
        if (savedUserLevel) setUserLevel(savedUserLevel);
        if (savedFilteredQuestions) setFilteredQuestions(savedFilteredQuestions);
    }, []);

    // Save chat data to localStorage whenever it's updated
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        localStorage.setItem('initialQuery', initialQuery);
        localStorage.setItem('followUpAnswers', JSON.stringify(followUpAnswers));
        localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
        localStorage.setItem('isSubmitted', isSubmitted);
        localStorage.setItem('userLevel', userLevel);
        localStorage.setItem('filteredQuestions', JSON.stringify(filteredQuestions));
    }, [messages, initialQuery, followUpAnswers, currentQuestionIndex, isSubmitted, userLevel, filteredQuestions]);

    // Initial validation and keyword detection
    const appKeywords = ['app', 'build', 'create', 'mobile', 'develop'];

    // Keyword detection function
    const isAppRelatedInput = (message) => {
        return appKeywords.some(keyword => message.toLowerCase().includes(keyword));
    };

    const handleSend = () => {
        if (inputValue.trim() !== '') {
            const newMessage = { text: inputValue, sender: 'user' };
            setMessages([...messages, newMessage]);
    
            if (!initialQuery) {
                setInitialQuery(inputValue);
            }
    
            if (isAppRelatedInput(inputValue)) {
                setInputValue('');
                // Show typing indicator before responding
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: '...', sender: 'bot', typing: true }
                ]);
    
                setTimeout(() => {
                    setMessages(prevMessages => prevMessages.filter(msg => !msg.typing));
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: 'Are you a beginner or an experienced app builder?', sender: 'bot' }
                    ]);
                    setShowUserLevelModal(true); // Show the pop-up window modal
                }, 1000);
            } else {
                setInputValue('');
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: 'It seems like your message is not related to app creation. Could you provide details about the app you want to build?', sender: 'bot' }
                ]);
            }
        }
    };
    

    // Handle user selection of beginner or experienced
    const handleUserLevelSelection = (level) => {
        setUserLevel(level); // Set user level

        if (level === 'beginner') {
            // Filter the questions for beginners (only dropdown type)
            const dropdownQuestions = followUpQuestions.filter(q => q.type === 'dropdown');
            setFilteredQuestions(dropdownQuestions);
        } else {
            // If experienced, show all questions
            setFilteredQuestions(followUpQuestions);
        }

        setMessages(prevMessages => [
            ...prevMessages,
            { text: `You selected: ${level}`, sender: 'user' }
            
        ]);
        if (level === 'experienced') {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'Please provide more details about your experience.', sender: 'bot' }
            ]);
        }
        setShowUserLevelModal(false); // Close the modal
        setTimeout(() => {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'Great! Let\'s start with the questions.', sender: 'bot' }
            ]);
            setShowFollowUpQuestions(true); // Start showing follow-up questions
        }, 1000);
    };

    const handleFollowUpAnswerChange = (id, value) => {
        // Save the answer in the state
        setFollowUpAnswers((prevAnswers) => ({
            ...prevAnswers,
            [id]: value
        }));
    };

    const handleNextQuestion = () => {
        const currentQuestion = filteredQuestions[currentQuestionIndex];

        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: currentQuestion.question, sender: 'bot' },
                { text: followUpAnswers[currentQuestion.id], sender: 'user' }
            ]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finalizeQuestions(); // When it's the last question, finalize instead of going to the next question
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    
    const handleTextInputResize = (e) => {
        e.target.style.height = "auto"; // Reset the height first
        e.target.style.height = `${e.target.scrollHeight}px`; // Set the height based on the scroll height
    };

    const handleClearChat = () => {
        // Reset all states to clear the chat
        setMessages([]);
        setInputValue('');
        setInitialQuery(''); // Reset the initial query
        setShowFollowUpQuestions(false);
        setFollowUpAnswers({});
        setCurrentQuestionIndex(0);
        setIsSubmitted(false);
        setUserLevel('');
        setFilteredQuestions([]);
        setFinalized(false);

        // Clear localStorage
        localStorage.clear();
    };

    const finalizeQuestions = () => {
        // Display the last question and answer in the chatbot
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        setMessages(prevMessages => [
            ...prevMessages,
            { text: currentQuestion.question, sender: 'bot' },
            { text: followUpAnswers[currentQuestion.id], sender: 'user' }
        ]);
        setShowFollowUpQuestions(false); // Close the follow-up question modal
        setFinalized(true); // Set the finalized state to true
    };

    const handleFinalizeAndBuild = async () => {
        // Send chat history to the backend to build the prompt
        const chatHistory = [...messages, ...filteredQuestions.map(q => ({
            question: q.question,
            answer: followUpAnswers[q.id]
        }))];

        try {
            await axios.post('/api/build', { chatHistory });
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'We have sent your app idea to the backend to start building!', sender: 'bot' }
            ]);
        } catch (error) {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'There was an error sending your app idea to the backend.', sender: 'bot' }
            ]);
        }
    };

    const handleRetake = () => {
        // Reset the currentQuestionIndex to 0 and retake the follow-up questions
        setCurrentQuestionIndex(0);
        setFinalized(false);
        setShowFollowUpQuestions(true);
    };

    const renderCurrentQuestion = () => {
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        const savedAnswer = followUpAnswers[currentQuestion?.id] || ''; // Pre-fill the answer if it exists

        if (!currentQuestion) {
            return null; // If no question is available, do not render anything
        }

        return (
            <div className="question-box">
                <label>{currentQuestion.question}</label>
                {currentQuestion.type === 'dropdown' ? (
                    <select
                        className="follow-up-dropdown"
                        value={savedAnswer} // Pre-fill the selected option
                        onChange={(e) => handleFollowUpAnswerChange(currentQuestion.id, e.target.value)}
                    >
                        <option value="">Select an option</option>
                        {currentQuestion.options.map((option, idx) => (
                            <option key={idx} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <textarea
                        className="follow-up-text"
                        value={savedAnswer}
                        onChange={(e) => {
                            handleFollowUpAnswerChange(currentQuestion.id, e.target.value);
                            handleTextInputResize(e); // Adjust the height as the user types
                        }}
                        placeholder="Type your response..."
                    />
                )}
                <div className="navigation-buttons">
                    <button className="prev-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                    {currentQuestionIndex === filteredQuestions.length - 1 ? (
                        <button className="next-button" onClick={finalizeQuestions}>Finish</button> // Change to "Finish" when on the last question
                    ) : (
                        <button className="next-button" onClick={handleNextQuestion}>Next</button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Lets give Wings to your Idea</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Replace the input with Finalize/Retake buttons once finished */}
            {finalized ? (
                <div className="finalize-buttons">
                    <button className="finalize-button" onClick={handleFinalizeAndBuild}>Finalize and Build</button>
                    <button className="retake-button" onClick={handleRetake}>Retake</button>
                </div>
            ) : (
                <div className="chatbot-input-container">
                    <input
                        type="text"
                        className="chatbot-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                    />
                    <button className="send-button" onClick={handleSend}>Send</button>
                    <button className="clear-button" onClick={handleClearChat}>Clear</button> {/* Add the Clear button */}
                </div>
            )}

            {/* Modal for selecting user level (Beginner or Experienced) */}
            {showUserLevelModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowUserLevelModal(false)}>&times;</span>
                        <div className="modal-body">
                            <h3>Are you a beginner or an experienced app builder?</h3>
                            <div className="user-level-selection">
                                <button className="level-button" onClick={() => handleUserLevelSelection('beginner')}>I'm a Beginner</button>
                                <button className="level-button" onClick={() => handleUserLevelSelection('experienced')}>I'm Experienced</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Render follow-up questions in a modal (popup) */}
            {showFollowUpQuestions && !isSubmitted && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowFollowUpQuestions(false)}>&times;</span>
                        <div className="modal-body">
                            <div className="question-container">
                                {renderCurrentQuestion()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Show final message after all questions are answered */}
            {isSubmitted && (
                <div className="final-message">
                    We are building your mobile app...
                </div>
            )}
        </div>
    );
};

export default ChatbotPage;
