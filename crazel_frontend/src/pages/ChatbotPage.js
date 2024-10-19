import React, { useState, useEffect, useRef } from 'react';
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
    const [showInitialPopup, setShowInitialPopup] = useState(true); // Show initial popup
    const [appName, setAppName] = useState(''); // Store the name of the app
    const [showAppNamePrompt, setShowAppNamePrompt] = useState(false); // Control showing the app name prompt
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showRetryPopup, setShowRetryPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [gist_url, setGistUrl] = useState(''); // Store the gist URL for app preview
    const [rephrasedMessage, setRephrasedMessage] = useState(''); // To store the rephrased response
    const [showRephraseOptions, setShowRephraseOptions] = useState(false); // Control when to show rephrase options
    const [isEditing, setIsEditing] = useState(false); // For editing rephrased message
    const [editedRephrasedMessage, setEditedRephrasedMessage] = useState(''); // Store edited rephrased message
    const editableInputRef = useRef(null);

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

    // Handle OK button in the initial popup
    const handleOkClick = () => {
        setShowInitialPopup(false);
        setShowAppNamePrompt(true); // Show the app name prompt
    };

    // Handle app name submission
    const handleAppNameSubmit = () => {
        if (appName.trim()) {
            setShowAppNamePrompt(false);
            setMessages([...messages, { text: `App Name: ${appName}`, sender: 'user' }]);
        }
    };

    // Handle the input and send to backend for rephrasing
    const handleSend = async () => {
        if (inputValue.trim() !== '') {
            const newMessage = { text: inputValue, sender: 'user' };
            setMessages([...messages, newMessage]);

            // Save the initial query
            if (!initialQuery) {
                setInitialQuery(inputValue);
            }

            if (isAppRelatedInput(inputValue)) {
                setInputValue(''); // Clear the input

                try {
                    // Send the message to backend for rephrasing
                    const response = await axios.post('/api/chatbot/rephrase/', { text: inputValue });

                    if (response.status === 200 && response.data.rephrased_text) {
                        const rephrasedText = response.data.rephrased_text;

                        // Show the rephrased message and ask for confirmation
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { text: 'I have rephrased your query for better understanding:', sender: 'bot' },
                            { text: rephrasedText, sender: 'bot' }
                        ]);

                        // Save rephrased message for later reference and show options
                        setRephrasedMessage(rephrasedText);
                        setEditedRephrasedMessage(rephrasedText); // Prefill the editable message
                        setShowRephraseOptions(true); // Show the Yes/No/Exact options
                    }
                } catch (error) {
                    console.error('Error rephrasing the input:', error);
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: 'Sorry, I couldn\'t rephrase your request. Please try again.', sender: 'bot' }
                    ]);
                }
            } else {
                setInputValue('');
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: 'It seems like your message is not related to app creation. Could you provide details about the app you want to build?', sender: 'bot' }
                ]);
            }
        }
    };

    const handleFollowUpAnswerChange = (id, value, isMultiSelect = false) => {
        setFollowUpAnswers((prevAnswers) => {
            if (isMultiSelect) {
                // If multi-selection is allowed, toggle the selected value
                const prevSelected = prevAnswers[id] || [];
                const updatedSelected = prevSelected.includes(value)
                    ? prevSelected.filter(item => item !== value) // Remove if already selected
                    : [...prevSelected, value]; // Add new value
                return { ...prevAnswers, [id]: updatedSelected };
            } else {
                // For single select dropdowns
                return { ...prevAnswers, [id]: value };
            }
        });
    };
    

    // Function to handle editing the rephrased text
    const handleEditAndAccept = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (editableInputRef.current) {
                editableInputRef.current.focus(); // Automatically focus on the editable input field
            }
        }, 0);
    };

    // Function to handle the final acceptance of the edited message
    const handleAcceptEditedMessage = () => {
        setMessages(prevMessages => [
            ...prevMessages,
            { text: `You confirmed: ${editedRephrasedMessage}`, sender: 'user' } // User confirmation as their message
        ]);
        setShowRephraseOptions(false); // Hide the options
        setIsEditing(false); // Reset editing state
        askFollowUpQuestions(); // Proceed with follow-up questions
    };

    // Handle user response to the rephrase options
    const handleRephraseResponse = async (responseType) => {
        let confirmedMessage = '';

        if (responseType === 'confirm') {
            confirmedMessage = `You confirmed: ${rephrasedMessage}`;
            setMessages(prevMessages => [
                ...prevMessages,
                { text: confirmedMessage, sender: 'user' }
            ]);
            setShowRephraseOptions(false);
            askFollowUpQuestions(); // Proceed with follow-up questions
        } else if (responseType === 'reject') {
            confirmedMessage = `You rejected the rephrase. Fetching an alternative rephrase...`;

            setMessages(prevMessages => [
                ...prevMessages,
                { text: confirmedMessage, sender: 'user' }
            ]);
            setIsLoading(true); // Show loading widget

            try {
                // Retrigger the backend API to get another alternative rephrase
                const response = await axios.post('/api/chatbot/rephrase/', { text: initialQuery });

                setIsLoading(false); // Hide loading widget

                if (response.status === 200 && response.data.rephrased_text) {
                    const newRephrasedText = response.data.rephrased_text;

                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: 'Here is an alternative rephrase:', sender: 'bot' },
                        { text: newRephrasedText, sender: 'bot' }
                    ]);
                    setRephrasedMessage(newRephrasedText); // Update rephrased message
                    setShowRephraseOptions(true); // Show the options again for the new rephrase
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: 'Failed to get an alternative rephrase. Please try again later.', sender: 'bot' }
                    ]);
                }
            } catch (error) {
                setIsLoading(false); // Hide loading widget
                console.error('Error fetching alternative rephrase:', error);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: 'An error occurred while fetching an alternative rephrase.', sender: 'bot' }
                ]);
            }
        } else if (responseType === 'exact') {
            confirmedMessage = `You chose to proceed with your original request: ${messages[messages.length - 1].text}`;
            setMessages(prevMessages => [
                ...prevMessages,
                { text: confirmedMessage, sender: 'user' }
            ]);
            setShowRephraseOptions(false);
            askFollowUpQuestions(); // Proceed with follow-up questions
        }
    };

    // Function to trigger follow-up questions after rephrasing confirmation
    const askFollowUpQuestions = () => {
        setMessages(prevMessages => [
            ...prevMessages,
            { text: 'Are you a beginner or an experienced app builder?', sender: 'bot' }
        ]);
        setShowUserLevelModal(true); // Show the beginner/experienced modal
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
        // Reload the page to start fresh
        window.location.reload();
    };

    const LoadingWidget = () => (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Building your app, please wait...</p>
        </div>
    );

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
        setIsLoading(true);
    
        // Create chat history including multi-selected answers
        const chatHistory = [
            ...messages, // Include all messages so far
            {
                text: `Initial query: ${initialQuery}`, // The original input
                sender: 'user',
            },
            {
                text: `Rephrased query: ${rephrasedMessage}`, // The rephrased query from the bot
                sender: 'bot',
            },
            // Add follow-up questions and answers (including multi-select answers)
            ...filteredQuestions.map((q) => ({
                question: q.question,
                answer: Array.isArray(followUpAnswers[q.id]) ? followUpAnswers[q.id].join(', ') : followUpAnswers[q.id], // Handle multi-select answers
            })),
        ];
    
        try {
            const response = await axios.post('/api/chatbot/build/', { chatHistory, appName });
            const { gist_url } = response.data;
            setGistUrl(gist_url);
    
            if (response.status === 200) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: 'Success! Your app is now ready for review.', sender: 'bot' }
                ]);
                setShowSuccessPopup(true);
            } else {
                throw new Error("Backend failure");
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'There was an error sending your app idea to the backend.', sender: 'bot' }
            ]);
            setShowRetryPopup(true);
        } finally {
            setIsLoading(false);
            setFinalized(true);  // Disable buttons only after API response
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
        const savedAnswer = followUpAnswers[currentQuestion?.id] || []; // For multi-select, assume an array

        if (!currentQuestion) {
            return null; // If no question is available, do not render anything
        }

        return (
            <div className="question-box">
                <label>{currentQuestion.question}</label>
                {currentQuestion.type === 'dropdown' ? (
                    currentQuestion.multiSelect ? (
                        // Multi-select checkboxes
                        <div>
                            {currentQuestion.options.map((option, idx) => (
                                <div key={idx} className="multi-select-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={savedAnswer.includes(option)} // Check if already selected
                                            onChange={(e) => handleFollowUpAnswerChange(currentQuestion.id, option, true)}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Single-select dropdown
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
                    )
                ) : (
                    <textarea
                        className="follow-up-text"
                        value={savedAnswer}
                        onChange={(e) => handleFollowUpAnswerChange(currentQuestion.id, e.target.value)}
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
            {/* Initial Popup */}
            {showInitialPopup && (
                <div className="initial-popup">
                    <div className="popup-content">
                        <p>Welcome! Ready to create an app with Crazel?</p>
                        <button onClick={handleOkClick}>OK</button>
                    </div>
                </div>
            )}

            {showRephraseOptions && (
                <div className="rephrase-options">
                    <p>Does this sound right to you?</p>
                    {isEditing ? (
                        // Editable input field for rephrased message
                        <textarea
                            ref={editableInputRef} // Attach reference to focus the textarea
                            value={editedRephrasedMessage}
                            onChange={(e) => setEditedRephrasedMessage(e.target.value)}
                            className="editable-rephrase-input"
                        />
                    ) : (
                        <p>{rephrasedMessage}</p>
                    )}

                    {isEditing ? (
                        // Accept button when editing
                        <button onClick={handleAcceptEditedMessage}>Accept</button>
                    ) : (
                        <>
                            <button onClick={() => handleEditAndAccept()}>Edit and Accept</button>
                            <button onClick={() => handleAcceptEditedMessage()}>Yes, this is what I want</button>
                            <button onClick={() => handleRephraseResponse('reject')}>No, check again</button>
                            <button onClick={() => handleRephraseResponse('exact')}>Just give me exactly what I ask</button>
                        </>
                    )}
                </div>
            )}

            {/* App Name Prompt */}
            {showAppNamePrompt && (
                <div className="app-name-prompt">
                    <div className="prompt-content">
                        <h3>What would you like to name your app?</h3>
                        <input
                            type="text"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            placeholder="Enter app name..."
                        />
                        <button onClick={handleAppNameSubmit}>Submit</button>
                    </div>
                </div>
            )}

            <div className="chatbot-header">
                <h2>Let's give wings to your idea</h2>
            </div>

            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Render Finalize/Retake buttons or input based on finalized state */}
            {finalized ? (
                isLoading ? (
                    <LoadingWidget /> // Show loading spinner
                ) : (
                    <div className="finalize-buttons">
                        <button className="finalize-button" onClick={handleFinalizeAndBuild}>
                            Finalize and Build
                        </button>
                        <button className="retake-button" onClick={handleRetake} >
                            Retake
                        </button>
                    </div>
                )
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
                    <button className="clear-button" onClick={handleClearChat}>Clear</button>
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

             {/* Success Popup */}
             {showSuccessPopup && (
                <div className="success-popup">
                    <div className="popup-content">
                        <p>Success! Your app is now ready for review. Press the "VIEW" button to get a real-time preview.</p>
                        <button
                            onClick={() => window.location.href = `/app-preview?appname=${appName}&gisturl=${encodeURIComponent(gist_url)}`}

                        >
                            View
                        </button>
                        <button onClick={() => setShowSuccessPopup(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Retry Popup */}
            {showRetryPopup && (
                <div className="retry-popup">
                    <div className="popup-content">
                        <p>There was a failure on the backend. Do you want to retry?</p>
                        <button onClick={handleFinalizeAndBuild}>Retry</button>
                        <button onClick={() => setShowRetryPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotPage;
