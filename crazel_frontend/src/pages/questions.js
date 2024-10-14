const followUpQuestions = [
    { id: 1, question: 'What is the main goal of your app?', type: 'text' },
    { id: 2, question: 'Who is the target audience for your app?', type: 'dropdown', options: ['Consumers', 'Businesses', 'Students', 'Professionals', 'All of the above'] },
    { id: 3, question: 'What problem does your app solve, or what value does it provide?', type: 'text' },
    { id: 4, question: 'What are the core features your app should have?', type: 'text' },
    { id: 5, question: 'Which platforms should your app support?', type: 'dropdown', options: ['iOS', 'Android', 'Both'] },
    { id: 6, question: 'Do you require user authentication (login/signup)?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 7, question: 'What kind of design are you envisioning for your app?', type: 'dropdown', options: ['Modern', 'Minimalistic', 'Playful', 'Professional', 'Colorful'] },
    { id: 8, question: 'Do you have any color preferences or themes?', type: 'text' },
    { id: 9, question: 'Do you need integration with external APIs or services?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 10, question: 'If yes, please specify the APIs or services to integrate.', type: 'text' },
    { id: 11, question: 'Do you require push notifications?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 12, question: 'Will your app need access to device features?', type: 'dropdown', options: ['Camera', 'Location', 'Microphone', 'Contacts', 'Storage', 'None'] },
    { id: 13, question: 'Do you want to include user engagement tools?', type: 'dropdown', options: ['User feedback forms', 'In-app messaging', 'Social media sharing', 'Ratings and reviews', 'None'] },
    { id: 14, question: 'What is your preferred development timeline?', type: 'dropdown', options: ['1-2 weeks', '1 month', '2-3 months', 'Flexible'] },
    { id: 15, question: 'Do you have specific accessibility requirements?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 16, question: 'If yes, please specify the accessibility features needed.', type: 'text' },
    { id: 17, question: 'Do you want Crazel to assist with deployment to app stores?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 18, question: 'Should your app support multiple languages?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 19, question: 'If yes, please list the languages.', type: 'text' },
    { id: 20, question: 'Do you have specific security requirements?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 21, question: 'If yes, please specify the security measures needed.', type: 'text' },
    { id: 22, question: 'Do you have existing branding materials to include?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 23, question: 'Please provide any additional comments or requirements.', type: 'text' }

];

export default followUpQuestions;
