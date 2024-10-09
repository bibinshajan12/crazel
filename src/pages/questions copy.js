const followUpQuestions = [
    { id: 1, question: 'What is the main goal of your app?', type: 'text' },
    { id: 2, question: 'Who is the target audience for your app?', type: 'dropdown', options: ['Consumers', 'Businesses', 'Both'] },
    { id: 3, question: 'What problem does your app solve, or what value does it provide?', type: 'text' },
    { id: 4, question: 'What are the core features your app should have?', type: 'text' },
    { id: 5, question: 'Do you need any special functionalities (e.g., chat, notifications, maps, etc.)?', type: 'dropdown', options: ['Chat', 'Notifications', 'Maps', 'None'] },
    { id: 6, question: 'Do you want to include in-app purchases or subscriptions?', type: 'dropdown', options: ['In-app purchases', 'Subscriptions', 'None'] },
    { id: 7, question: 'What kind of design are you envisioning for your app (e.g., modern, minimalistic, playful)?', type: 'dropdown', options: ['Modern', 'Minimalistic', 'Playful'] },
    { id: 8, question: 'Do you have any color preferences or themes?', type: 'text' },
    { id: 9, question: 'Do you need your app to support multiple languages?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 10, question: 'Is your app primarily for iOS, Android, or both?', type: 'dropdown', options: ['iOS', 'Android', 'Both'] },
    { id: 11, question: 'What type of app are you building (e.g., e-commerce, social media, utility)?', type: 'dropdown', options: ['E-commerce', 'Social media', 'Utility'] },
    { id: 12, question: 'Will your app be free or paid?', type: 'dropdown', options: ['Free', 'Paid'] },
    { id: 13, question: 'How do you plan to monetize the app (ads, subscriptions, one-time payment)?', type: 'dropdown', options: ['Ads', 'Subscriptions', 'One-time payment'] },
    { id: 14, question: 'Do you want to include features like notifications, user feedback forms, or engagement tools?', type: 'dropdown', options: ['Notifications', 'User feedback forms', 'Engagement tools', 'None'] },
    { id: 15, question: 'Would you like to integrate a user sign-in or account creation system?', type: 'dropdown', options: ['Yes', 'No'] },
    { id: 16, question: 'Do you want Crazel to help you with deployment to the App Store/Google Play Store?', type: 'dropdown', options: ['Yes', 'No'] }
];

export default followUpQuestions;
