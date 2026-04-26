# AI Interview Preparation Platform

An AI-powered platform that generates personalized interview questions, skill gap analysis, and preparation roadmaps based on your resume and target job description. The app also generates ATS-friendly resume PDFs tailored to specific job applications.

## 🚀 Features

- **Resume Upload**: Upload your PDF resume for analysis
- **Job Description Analysis**: Input target job description
- **Self Description**: Provide a brief self-description
- **AI-Generated Technical Questions**: Personalized technical interview questions
- **AI-Generated Behavioral Questions**: Behavioral interview questions based on your background
- **Skill Gap Analysis**: Identify skills you need to improve
- **Preparation Roadmap**: Day-by-day study plan to prepare for the interview
- **AI-Generated Resume PDF**: Generate ATS-friendly resumes tailored to job descriptions

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router v7** - Routing
- **Axios** - HTTP client
- **SCSS** - Styling

### Backend
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **Gemini AI** - AI for generating interview content and resumes
- **Puppeteer** - PDF generation
- **pdf2json** - PDF text extraction
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
gen ai project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   ├── models/
│   │   │   ├── blacklist.model.js
│   │   │   ├── interviewReportModel.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   └── services/
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── style/
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Gemini API key

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/interview-ai
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview` | Generate interview report |
| GET | `/api/interview/reports` | Get all user's reports |
| GET | `/api/interview/reports/:id` | Get specific report |
| POST | `/api/interview/resume/pdf/:id` | Generate resume PDF |

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Upload Resume**: Upload your PDF resume
3. **Enter Job Description**: Paste the job description you're targeting
4. **Self Description**: Write a brief description about yourself
5. **Generate Report**: Click generate to get your personalized interview prep
6. **View Results**: Browse through technical questions, behavioral questions, skill gaps, and your preparation roadmap
7. **Download Resume**: Generate an ATS-friendly resume PDF for the job

## 📦 Dependencies

### Backend
- `@google/genai` - Gemini AI SDK
- `bcryptjs` - Password hashing
- `cookie-parser` - Cookie parsing
- `cors` - CORS support
- `dotenv` - Environment variables
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `mongoose` - MongoDB ODM
- `multer` - File upload
- `pdf2json` - PDF parsing
- `puppeteer` - Headless browser for PDF generation
- `zod` - Schema validation
- `zod-to-json-schema` - Zod to JSON Schema

### Frontend
- `axios` - HTTP client
- `react` - UI library
- `react-dom` - React DOM
- `react-router` - Routing
- `sass` - CSS preprocessor
- `vite` - Build tool

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GEMINI_API_KEY` | Gemini AI API key |
| `PORT` | Server port (default: 3000) |

## 📄 License

ISC License
