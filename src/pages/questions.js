const followUpQuestions = [
    { id: 1, question: 'What is the main goal of your app?', type: 'text' },
    { id: 2, question: 'Who is the target audience for your app?', type: 'dropdown', options: ['Consumers', 'Businesses', 'Both'] },
    { id: 3, question: 'What problem does your app solve, or what value does it provide?', type: 'text' },
    { id: 4, question: 'What are the core features your app should have?', type: 'text' },
    { id: 7, question: 'What kind of design are you envisioning for your app (e.g., modern, minimalistic, playful)?', type: 'dropdown', options: ['Modern', 'Minimalistic', 'Playful'] },
    { id: 8, question: 'Do you have any color preferences or themes?', type: 'text' },
    { id: 14, question: 'Do you want to include features like notifications, user feedback forms, or engagement tools?', type: 'dropdown', options: ['Notifications', 'User feedback forms', 'Engagement tools', 'None'] },
    { id: 16, question: 'Do you want Crazel to help you with deployment to the App Store/Google Play Store?', type: 'dropdown', options: ['Yes', 'No'] }
];

export default followUpQuestions;
