# ShopVibe - Full Stack E-Commerce Platform

A premium, modern e-commerce storefront built with a React frontend and a Django backend. ShopVibe focuses on a clean editorial design system, structured data management, and a seamless shopping experience.

## Features
- **Editorial UI/UX**: Implements a high-fashion, minimalist design using Framer Motion for fluid transitions.
- **Full Stack Integration**: Built with a Django REST API for secure backend management and a responsive React frontend.
- **Inventory Management**: Structured catalog system with filtering, category sorting, and dynamic stock tracking.
- **Secure Authentication**: Robust user registration and authentication flow.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Django, Django REST Framework
- **State Management**: React Hooks (useState/useEffect), LocalStorage

## Project Structure
- `core/`: Contains the Django backend app logic and models.
- `shopvibe_backend/`: Core project configuration and settings.
- `shopvibe_frontend/`: Frontend React application.

## Getting Started

### Backend Setup
1. Navigate to the project root.
2. Create a virtual environment: `python -m venv env`
3. Activate environment: `source env/bin/activate` (or `env\Scripts\activate` on Windows).
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Start the server: `python manage.py runserver`

### Frontend Setup
1. Navigate to the frontend folder: `cd shopvibe_frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---
*Developed with a focus on clean, editorial design principles and robust full-stack architecture.*