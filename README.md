# 📚 ExcelMind – AI-powered Learning Platform

ExcelMind is an AI-enhanced educational web platform that allows students to enroll in and interact with courses, lecturers to manage assignments and grade submissions, and admins to manage enrollments and settings.

---

## 🚀 Features

- Role-based access for Students, Lecturers, and Admins
- Course creation and updating for Lecturers
- Students can enroll in or drop courses
- Assignment submission and grading
- Admins manage enrollments and assign lecturers
- Real-time weighted grading system for students
- AI assistant for syllabus and course suggestions (Mocked)
- Fully Dockerized setup (Frontend + Backend + PostgreSQL)
- Cloudinary for file uploads
- Some dummy data to showcase recent activities and deadlines in Students dashboard

---

## ⚙️ Technologies Used

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL
- **AI**: OpenAI API (Mocked)
- **Deployment**: Docker, Docker Compose
- **File Uploads**: Cloudinary

---

## 📂 Project Structure

```bash
excelmind-assessment/
├── backend/               # Express backend with Prisma ORM
├── frontend/              # React + Vite frontend
├── docker-compose.yml     # Docker orchestration file
├── setup-env.sh           # Script to generate .env files
├── .env.example           # Root-level sample env file



---

## 🛠️ Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/Litezy/excelmind-assessment.git
cd excelmind-assessment

#auto generate env files in root and sub folders(BE & FE)
chmod +x setup-env.sh
./setup-env.sh
#or manually generate env files for root and sub folders(BE & FE)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

#Install Backend Dependencies
cd backend
npm install
npx prisma migrate dev

#Install Frontend Dependencies (in a new terminal)
cd frontend
npm install
npm run dev

#To spin up PostgreSQL, backend, and frontend together:
docker-compose up --build


---

## ❗ NB: Why Node.js + Express.js Was Used

The original assessment suggested using **NestJS** or **FastAPI**, both of which are excellent frameworks. However, I chose to build the backend using **Node.js with Express.js** for the following reason:

> I do not yet have strong experience with NestJS or FastAPI — I am still actively learning them. However, I ensured that every feature in this project was completed properly, following best practices and maintainable code structure.

That said, I am highly adaptable and confident that I can quickly learn and contribute using **NestJS**, **FastAPI**, or any other technology stack required on the job.
