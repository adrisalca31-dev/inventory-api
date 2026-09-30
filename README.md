# Inventory API

A full-stack inventory management application built to practice backend development, REST APIs, database integration, testing, and frontend integration.

The project provides a REST API for managing products and a React frontend that consumes the API through HTTP requests.

## Features

### Backend

- Product CRUD operations
- Product search
- Pagination
- Sorting
- Input validation
- Proper HTTP status codes
- PostgreSQL database integration
- SQLAlchemy ORM
- Automated API tests with pytest

### Frontend

- Product dashboard
- Product creation
- Product editing
- Product deletion
- Product search
- Pagination controls
- Inventory statistics
- Stock status indicators
- Loading states
- Error handling
- Success feedback
- API refresh functionality
- Production build with Vite

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Uvicorn
- pytest

### Frontend

- React
- TypeScript
- Vite
- CSS

## Project Structure

```text
02-inventory-api/
│
├── app/
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   ├── database.py
│   └── main.py
│
├── tests/
│   ├── conftest.py
│   └── test_products.py
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── App.tsx
│
├── requirements.txt
└── README.md