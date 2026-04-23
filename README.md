# Task & Project Collaboration Tool

A comprehensive, full-stack web application designed for efficient task tracking, project management, and team collaboration. The platform features a real-time Kanban board, team management, and project tracking to help teams stay organized and productive.

## 🚀 Features

- **Project Management**: Create, view, and manage projects.
- **Real-Time Kanban Board**: Track tasks using a drag-and-drop Kanban board (To Do, In Progress, Done). Real-time updates are powered by WebSockets to ensure all team members see changes instantly.
- **Task Management**: Create tasks, assign them to team members, set priorities, and track progress.
- **Team Management**: Add, edit, and remove team members dynamically.
- **Activity Feed**: View recent activities across the platform.
- **Modern UI/UX**: Built with React and styled with vanilla CSS for a fast, responsive, and beautiful interface.

## 💻 Tech Stack

### Frontend
- **React 19**
- **Vite** (Build tool)
- **React Router DOM** (Routing)
- **StompJS & SockJS** (WebSocket client for real-time collaboration)
- **Lucide React** (Icons)

### Backend
- **Java 21**
- **Spring Boot 3** (WebMVC, Data JPA, WebSocket)
- **H2 Database** (In-memory database for rapid development)
- **Lombok** (Boilerplate reduction)
- **Maven** (Build automation)

## 📋 Prerequisites

To run this project locally, ensure you have the following installed:
- [Java Development Kit (JDK) 21](https://jdk.java.net/21/)
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Maven (Optional, as the project includes a Maven wrapper `mvnw`)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Beast93489/Project-collabaration-and-management-tool.git
cd "Project-collabaration-and-management-tool"
```

### 2. Running the Backend (Spring Boot)

Navigate to the `backend` directory and run the Spring Boot application:

```bash
cd backend
# On Windows
./mvnw.cmd spring-boot:run
# On macOS/Linux
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.

### 3. Running the Frontend (React + Vite)

Open a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will typically run on `http://localhost:5173`. Open this URL in your browser to access the application.

## 📁 Project Structure

```text
├── backend/                  # Spring Boot backend application
│   ├── src/main/java/...     # Java source code (Controllers, Services, Repositories, Entities)
│   ├── src/main/resources/   # Application properties and resources
│   └── pom.xml               # Maven dependencies
│
├── frontend/                 # React frontend application
│   ├── src/components/       # Reusable UI components (Sidebar, Topbar, Layout)
│   ├── src/pages/            # Page components (Dashboard, Projects, KanbanBoard, Team)
│   ├── src/assets/           # Static assets
│   ├── package.json          # Node dependencies and scripts
│   └── vite.config.js        # Vite configuration
│
└── README.md                 # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
