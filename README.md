# Inventory API

A full-stack inventory management application built with FastAPI, PostgreSQL, React, and TypeScript.

The project provides a REST API for managing products and a web dashboard that consumes the API to display and manage inventory information.

## Project Overview

Inventory API was developed as a portfolio project focused on building a complete backend application and connecting it to a frontend interface.

The project covers:

- REST API development
- CRUD operations
- PostgreSQL database integration
- SQLAlchemy ORM
- Request validation
- Pagination
- Sorting
- Search
- Stock filtering
- Error handling
- Automated testing
- CORS configuration
- React frontend integration
- Responsive interface design
- Environment configuration

## Technologies

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Pytest
- HTTPX
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- CSS

### Development Tools

- Git
- GitHub
- VS Code
- PostgreSQL.app
- DBeaver

## Project Structure

```text
02-inventory-api/
│
├── app/
│   ├── routers/
│   │   └── products.py
│   ├── config.py
│   ├── crud.py
│   ├── database.py
│   ├── exceptions.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Pagination.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductStats.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   └── ProductToolbar.tsx
│   │   ├── hooks/
│   │   │   ├── useApiStatus.ts
│   │   │   ├── useInventoryStats.ts
│   │   │   └── useProducts.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── apiError.ts
│   │   ├── types/
│   │   │   └── product.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── tests/
│   ├── conftest.py
│   └── test_products.py
│
├── .env
├── .gitignore
├── README.md
└── requirements.txt