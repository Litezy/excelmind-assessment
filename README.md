## Architecture

```mermaid
graph TD
    A[Frontend<br/>React + Vite] --> B[Backend<br/>Node.js + Express]
    B --> C[(PostgreSQL<br/>Prisma)]
    B --> D[Cloudinary<br/>Image Upload]
    B --> E[OpenAI API<br/>AI Assistant]
    
    C -.->|Assignment, Course,<br/>User Data| B