# Welcome to GK's repository

## Description

This is the source code for server-side (back-end) of restaurant management system

## Technical Approach:

- Programming language: Javascript (Typescript)
- Design pattern: OOP
- Server-side Framework: Express.js
- API: Restful API
- SQL ORM: Sequelize
- SQL Database: MySQL
- Unit test tool: mocha, chai, nyc
- Unit test report: mochawesome, lcov
- API test: Postman API
- Management tools: prettier, eslint, husky
- Container: Docker

## Preinstallation

- Nodejs: https://nodejs.org/en/download/
- Docker: https://www.docker.com/products/docker-desktop

## Installation

```bash
npm ci
```

## Run the app

1. In Development

```bash
npm run start:dev
```

2. In Production

```bash
npm run build
npm run start:prod
```

## Test

```bash
npm run test
npm run test:cov
```

test reports are in folder .reports/

## Summary

```bash
npm run complex
```

summary reports are in folder .reports/

## Dockerization

```bash
npm run build
docker-compose up
```

## Data Model Definition

- DTO (Data transfer object): Representational data of Model for transfering between services, maybe full or a part of Model, ex: UserDTO
- Model: Classes which represent the business area or resources, ex: UserModel
- Entity: Models which represent the data in DB, ex: User

## APIs

### authentication

- POST /api/auth/login

### common resources

- GET /api/common/user-types
- POST /api/common/user-types
- GET /api/common/product-types
- GET /api/common/product-types/{id}
- POST /api/common/product-types
- GET /api/common/menu-types
- GET /api/common/menu-types/{id}
- POST /api/common/menu-types
- GET /api/common/image/user-avatar/{fileName}
- GET /api/common/image/product-image/{fileName}

### screens resources

- GET /api/main-screen/products
- GET /api/product-screen/products
- GET /api/product-screen/products/{id}
- POST /api/product-screen/products/search
- POST /api/product-screen/products
- PATCH /api/product-screen/products/{id}
- DELETE /api/product-screen/products/{id}
- GET /api/user-screen/users
- GET /api/user-screen/users/{id}
- POST /api/user-screen/users/search
- POST /api/user-screen/users
- PATCH /api/user-screen/users/{id}
- DELETE /api/user-screen/users/{id}
