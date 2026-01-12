# Crazel

Crazel is an AI-driven no-code/low-code platform that enables users to design, generate, preview, and deploy full-fledged mobile applications through natural language conversations.

## 🚀 Features

- **🤖 AI-Powered Chatbot**: Interact with an intelligent AI assistant to describe your app requirements in plain English
- **📱 Flutter App Generation**: Automatically generates complete Flutter mobile applications based on your specifications
- **👁️ Real-time Preview**: Preview your generated apps in the browser before deployment
- **⚡ Fast Deployment**: Build and deploy apps quickly with streamlined deployment tools
- **🎨 Beautiful UI/UX**: Generate apps with modern, responsive designs that work across all devices
- **🔐 Authentication**: Built-in user authentication and session management
- **📦 Template Library**: Access to pre-built app templates to jumpstart your development

## 🏗️ Architecture

Crazel is built with a microservices architecture:

- **Frontend** (`crazel_frontend/`): React-based web application
- **Backend** (`crazel_backend/`): Django REST API server
- **LLM Service** (`crazel_llm/`): AI/LLM model service for code generation
- **Flutter Service** (`flutter_service/`): Flutter build and compilation service
- **Flutter Backend** (`crazel_flutter/`): DartPad backend for Flutter web compilation

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.8+ (for local development)
- Node.js 14+ (for local development)
- Flutter SDK (for local development)

## 🛠️ Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/bibinshajan12/crazel.git
cd crazel
```

2. Create `.env` files for each service (see Configuration section)

3. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:8000

### Local Development

#### Backend Setup

```bash
cd crazel_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Setup

```bash
cd crazel_frontend
npm install
npm start
```

## ⚙️ Configuration

Create `.env` files in the following directories with your configuration:

- `crazel_backend/.env`
- `flutter_service/.env`
- `crazel_frontend/.env`

Required environment variables (examples):
```env
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_ENDPOINT=your_endpoint

# Django Configuration
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=sqlite:///db.sqlite3
```

## 📁 Project Structure

```
crazel-web-app/
├── crazel_backend/          # Django backend application
│   ├── authentication/      # User authentication module
│   ├── chatbot/            # Chatbot and AI integration
│   ├── flutterbuild/       # Flutter build management
│   └── app_preview/        # App preview functionality
├── crazel_frontend/        # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   └── pages/          # Application pages
├── crazel_llm/            # LLM/AI service
├── flutter_service/       # Flutter build service
├── crazel_flutter/        # DartPad backend service
└── docker-compose.yml     # Docker orchestration
```

## 🎯 Usage

1. **Start a Conversation**: Navigate to the chatbot interface and describe your app idea
2. **Refine Requirements**: Work with the AI to clarify and refine your app specifications
3. **Generate Code**: The platform generates Flutter code based on your requirements
4. **Preview**: Preview your app in the browser using the built-in preview feature
5. **Deploy**: Build and deploy your app to mobile platforms

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd crazel_backend
python manage.py test

# Frontend tests
cd crazel_frontend
npm test
```

### Code Style

- Backend: Follow PEP 8 Python style guide
- Frontend: Follow ESLint configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- Repository: https://github.com/bibinshajan12/crazel
- Documentation: (Add documentation link if available)

## 👥 Authors

- **Bibin Shajan** - [GitHub](https://github.com/bibinshajan12)

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- OpenAI/Azure OpenAI for AI capabilities
- Django and React communities

---

**Note**: Make sure to keep your `.env` files secure and never commit them to version control. The `.gitignore` file is configured to exclude sensitive files.
