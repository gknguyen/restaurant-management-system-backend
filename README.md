# Welcome to GK's repository

## Description

This is the source code for server-side (back-end) of restaurant management system

## Data Model Definition

- DTO (Data transfer object): Representational data of Model for transfering between services, maybe full or a part of Model, ex: UserDTO
- Model: Classes which represent the business area or resources, ex: UserModel
- Entity: Models which represent the data in DB, ex: User

## APIs

- POST /api/auth/login
- GET /api/common/user-types
- POST /api/common/user-types
- GET /api/common/product-types
- GET /api/common/product-types/{id}
- POST /api/common/product-types
- GET /api/common/menu-types
- GET /api/common/menu-types/{id}
- POST /api/common/menu-types
- GET /api/main-screen/products
