# 🎓 Course Management Platform Backend Service

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

**A comprehensive backend service for managing course allocations, facilitator activities, and student progress in academic institutions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [File Upload System](#file-upload-system)
- [Notification System](#notification-system)
- [Student Reflection Page](#student-reflection-page)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Features

<div align="center">

![Features](https://img.shields.io/badge/Features-3-blue?style=for-the-badge)
![Modules](https://img.shields.io/badge/Modules-3-green?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-2-orange?style=for-the-badge)

</div>

### 🎯 Course Allocation System
- **👥 Role-based Access Control**: Managers can create, update, delete course offerings; Facilitators can view assigned courses
- **🔍 Advanced Filtering**: Filter by trimester, cohort, intake period, facilitator, and delivery mode
- **🔗 Relationship Management**: Complex relationships between modules, cohorts, classes, facilitators, and delivery modes

### 📊 Facilitator Activity Tracker (FAT)
- **📅 Weekly Activity Logs**: Track attendance, grading progress, moderation, and administrative tasks
- **📈 Status Monitoring**: Monitor completion status (Done, Pending, Not Started) for various activities
- **🔔 Automated Notifications**: Redis-backed reminders and compliance alerts
- **⚡ Background Processing**: Asynchronous notification queues with delivery tracking

### 🌍 Student Reflection Page (Internationalization)
- **🗣️ Multilingual Support**: Dynamic language switching between English and French
- **💬 Interactive Interface**: User-friendly reflection prompts and responses
- **🚀 Static Site Deployment**: GitHub Pages hosting with full internationalization

## Technology Stack

<div align="center">

### 🖥️ Backend & Runtime
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### 🗄️ Database & ORM
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

### 🔐 Authentication & Security
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![bcrypt](https://img.shields.io/badge/bcrypt-2D3748?style=for-the-badge&logo=letsencrypt&logoColor=white)

### 📨 Message Queue & Cache
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Bull](https://img.shields.io/badge/Bull-FF6B6B?style=for-the-badge&logo=redis&logoColor=white)

### 📖 Documentation & Testing
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

### 🛡️ Security & Middleware
![Helmet](https://img.shields.io/badge/Helmet-4B9CD3?style=for-the-badge&logo=helmet&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-FF5733?style=for-the-badge&logo=cors&logoColor=white)

</div>

| Category | Technologies | Description |
|----------|-------------|-------------|
| **🖥️ Backend** | Node.js, Express.js | Server runtime and web framework |
| **🗄️ Database** | MySQL, Sequelize ORM | Relational database with object mapping |
| **🔐 Authentication** | JWT, bcrypt | Token-based auth with password hashing |
| **📨 Message Queue** | Redis, Bull Queue | Caching and background job processing |
| **📖 Documentation** | Swagger/OpenAPI 3.0 | Interactive API documentation |
| **🧪 Testing** | Jest, Supertest | Unit and integration testing |
| **🛡️ Security** | Helmet, CORS, Rate limiting | Security headers and protection |

## 📋 Prerequisites

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v16+-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-v8.0+-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-v6.0+-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

Before you begin, ensure you have the following installed:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| **🟢 Node.js** | v16 or higher | [Download Node.js](https://nodejs.org/) |
| **🐬 MySQL** | v8.0 or higher | [Download MySQL](https://dev.mysql.com/downloads/) |
| **🔴 Redis** | v6.0 or higher | [Download Redis](https://redis.io/download) |
| **📦 Git** | Latest | [Download Git](https://git-scm.com/) |

## ⚡ Quick Start

<div align="center">

![Setup Steps](https://img.shields.io/badge/Setup%20Steps-6-blue?style=for-the-badge)
![Time to Setup](https://img.shields.io/badge/Setup%20Time-5%20mins-green?style=for-the-badge)

</div>

### 1. Clone the Repository
```bash
git clone <repository-url>
cd course-management-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Application Settings
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=course_management
DB_USER=root
DB_PASSWORD=your_mysql_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 4. Database Setup
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE course_management;"

# Database migrations run automatically on server start
npm start
```

### 5. Seed Database (Optional)
```bash
npm run seed
```

### 6. Start Development Server
```bash
npm run dev
```

🎉 **You're ready to go!**

<div align="center">

[![Server](https://img.shields.io/badge/Server-http://localhost:3000-blue?style=for-the-badge&logo=server&logoColor=white)](http://localhost:3000)
[![API Docs](https://img.shields.io/badge/API%20Docs-http://localhost:3000/api--docs-green?style=for-the-badge&logo=swagger&logoColor=white)](http://localhost:3000/api-docs)

</div>

## Database Schema

### Core Entities

| Entity | Description |
|--------|-------------|
| **Managers** | System administrators who manage course allocations |
| **Facilitators** | Instructors assigned to teach specific courses |
| **Students** | Learners enrolled in cohorts and classes |
| **Modules** | Course subjects with codes, credits, and descriptions |
| **Cohorts** | Student groups with program and timeline information |
| **Classes** | Academic terms (e.g., 2024S, 2025J) |
| **Modes** | Delivery methods (Online, In-person, Hybrid) |

### Key Relationships
- **CourseOffering**: Links modules, facilitators, cohorts, classes, and modes
- **ActivityTracker**: Weekly activity logs linked to course offerings

## 🔐 Authentication

<div align="center">

![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=JSON%20web%20tokens)
![bcrypt](https://img.shields.io/badge/bcrypt-Password%20Hashing-2D3748?style=for-the-badge&logo=letsencrypt&logoColor=white)

</div>

### User Registration

#### Register Manager
```bash
POST /api/auth/register/manager
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@university.edu",
  "password": "Manager123!"
}
```

#### Register Facilitator
```bash
POST /api/auth/register/facilitator
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@university.edu",
  "password": "Facilitator123!",
  "specialization": "JavaScript & Node.js"
}
```

### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@university.edu",
  "password": "Manager123!",
  "role": "manager"
}
```

**Response includes JWT token for subsequent API calls.**

## 📡 API Endpoints

<div align="center">

![REST API](https://img.shields.io/badge/REST-API-blue?style=for-the-badge&logo=api&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-Documented-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

</div>

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/auth/register/manager` | Register new manager | Public |
| `POST` | `/api/auth/register/facilitator` | Register new facilitator | Public |
| `POST` | `/api/auth/login` | Login user | Public |

### Course Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/courses` | List course offerings (with filters) | Authenticated |
| `POST` | `/api/courses` | Create course offering | Managers only |
| `PUT` | `/api/courses/:id` | Update course offering | Managers only |
| `DELETE` | `/api/courses/:id` | Delete course offering | Managers only |

### Facilitator Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/facilitators` | List all facilitators | Managers only |
| `GET` | `/api/facilitators/my-courses` | Get assigned courses | Facilitators only |

### Activity Tracking
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/activities` | List activity logs (with filters) | Authenticated |
| `POST` | `/api/activities` | Create/update activity log | Facilitators only |

### Query Parameters
Both course and activity endpoints support filtering:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `trimester` | T1, T2, T3 | Academic trimester |
| `cohortId` | Integer | Cohort identifier |
| `intakePeriod` | HT1, HT2, FT | Intake period |
| `facilitatorId` | Integer | Facilitator identifier |
| `modeId` | Integer | Delivery mode identifier |
| `weekNumber` | 1-52 | Week number (activities only) |

## 📁 File Upload System

<div align="center">

![File Upload](https://img.shields.io/badge/Max%20Size-10MB-orange?style=for-the-badge&logo=upload&logoColor=white)
![File Types](https://img.shields.io/badge/Formats-7%20Types-green?style=for-the-badge&logo=file&logoColor=white)
![Security](https://img.shields.io/badge/Validation-Secure-red?style=for-the-badge&logo=shield&logoColor=white)

</div>

### Features
- **Document Upload**: Activity-related documents and attachments
- **Profile Pictures**: User profile picture management
- **Bulk Upload**: Multiple file upload support
- **File Validation**: Automatic type and size validation
- **Secure Storage**: Unique naming and secure file storage

### Configuration
- **Maximum file size**: 10MB
- **Supported formats**: JPEG, PNG, PDF, DOC, DOCX, TXT, CSV, XLSX
- **Storage location**: `/uploads` directory
- **Naming convention**: `fieldname-timestamp-random.extension`

### Upload Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/uploads/activity-document` | Upload activity documents |
| `POST` | `/api/uploads/profile-picture` | Upload profile pictures |
| `POST` | `/api/uploads/bulk-upload` | Upload multiple files |
| `GET` | `/uploads/:filename` | Serve uploaded files |

### Examples

#### Upload Activity Document
```bash
curl -X POST "http://localhost:3000/api/uploads/activity-document" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@/path/to/file.pdf" \
  -F "activityId=1" \
  -F "description=Weekly report"
```

#### Upload Profile Picture
```bash
curl -X POST "http://localhost:3000/api/uploads/profile-picture" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "picture=@/path/to/image.jpg"
```

## 📨 Notification System

<div align="center">

![Redis](https://img.shields.io/badge/Redis-Queue%20Processing-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Background Jobs](https://img.shields.io/badge/Background-Workers-purple?style=for-the-badge&logo=worker&logoColor=white)

</div>

### Redis Queue Processing
The system uses Redis queues for asynchronous notification processing:

- **Activity Submissions**: Notify managers when facilitators submit logs
- **Deadline Reminders**: Automated reminders for missing submissions
- **Compliance Alerts**: Manager notifications for missed deadlines
- **Background Workers**: Process queues with retry logic and error handling

### Notification Types
| Type | Description |
|------|-------------|
| `activity_submitted` | Facilitator submits weekly log |
| `deadline_reminder` | Automated reminder for pending submissions |
| `compliance_alert` | Manager alert for missed deadlines |

## 🌍 Student Reflection Page

<div align="center">

![i18n](https://img.shields.io/badge/i18n-2%20Languages-blue?style=for-the-badge&logo=translate&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-black?style=for-the-badge&logo=github&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Design-green?style=for-the-badge&logo=responsive&logoColor=white)

</div>

### Features
- **Multilingual Interface**: English and French language support
- **Dynamic Language Switching**: Real-time language toggling
- **Interactive Prompts**: Reflection questions about course experience
- **Responsive Design**: Mobile-friendly interface
- **GitHub Pages Deployment**: Static site with full internationalization

### Technical Implementation
- Language detection and preference storage
- Smooth content transitions
- Accessible design patterns
- Modern web standards compliance

## 🧪 Testing

<div align="center">

![Jest](https://img.shields.io/badge/Jest-Testing%20Framework-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Coverage](https://img.shields.io/badge/Coverage-Reports-green?style=for-the-badge&logo=codecov&logoColor=white)

</div>

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Model Tests**: Manager, CourseOffering, ActivityTracker
- **Utility Tests**: Password validation, email validation, trimester validation
- **Integration Tests**: API endpoints with authentication
- **Performance Tests**: Load testing for critical endpoints

## 🛡️ Security

<div align="center">

![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-red?style=for-the-badge&logo=shield&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Helmet](https://img.shields.io/badge/Helmet-Security%20Headers-4B9CD3?style=for-the-badge&logo=helmet&logoColor=white)

</div>

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: express-validator for comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Prevention**: Parameterized queries with Sequelize ORM

### Best Practices
- Regular security audits
- Dependency vulnerability scanning
- Environment variable protection
- API endpoint protection
- File upload security validation

## 🚀 Deployment

<div align="center">

![Production Ready](https://img.shields.io/badge/Production-Ready-green?style=for-the-badge&logo=rocket&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-Process%20Manager-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

</div>

### Environment Variables
Ensure all required environment variables are configured for production:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_production_jwt_secret
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
REDIS_HOST=your_production_redis_host
```

### Production Checklist
- [ ] Configure environment-specific database settings
- [ ] Set up Redis clustering for high availability
- [ ] Implement proper logging and monitoring
- [ ] Configure database backup strategies
- [ ] Enable HTTPS in production
- [ ] Configure appropriate CORS policies
- [ ] Set up process managers (PM2, Docker)
- [ ] Configure reverse proxy (Nginx, Apache)

## ⚡ Performance

<div align="center">

![Performance](https://img.shields.io/badge/Performance-Optimized-yellow?style=for-the-badge&logo=speedometer&logoColor=white)
![Caching](https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Database](https://img.shields.io/badge/Database-Indexed-blue?style=for-the-badge&logo=database&logoColor=white)

</div>

### Optimization Features
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Redis Caching**: Fast notification queue processing
- **Background Workers**: Non-blocking notification processing
- **Pagination Support**: Efficient large dataset handling

### Performance Monitoring
- Database query optimization
- Redis memory usage monitoring
- API response time tracking
- Background job processing metrics

## 🤝 Contributing

<div align="center">

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)
![Contributors](https://img.shields.io/badge/Contributors-Welcome-orange?style=for-the-badge&logo=github&logoColor=white)

</div>

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📄 License

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

<div align="center">

![Documentation](https://img.shields.io/badge/Documentation-Complete-green?style=for-the-badge&logo=gitbook&logoColor=white)
![Support](https://img.shields.io/badge/Support-Available-blue?style=for-the-badge&logo=support&logoColor=white)

</div>

### Getting Help
- 📚 **API Documentation**: Available at `/api-docs` when server is running
- 🧪 **Usage Examples**: Review test files for implementation examples
- 🐛 **Issues**: Create an issue in the GitHub repository
- 💬 **Discussions**: Use GitHub Discussions for general questions

### 📚 Additional Resources

<div align="center">

[![Sequelize](https://img.shields.io/badge/Sequelize-Docs-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Guide-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-Docs-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/documentation)
[![JWT](https://img.shields.io/badge/JWT-Best%20Practices-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

</div>

---

<div align="center">

**🎓 Built with ❤️ for academic institutions**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![For Education](https://img.shields.io/badge/For-Education-blue?style=for-the-badge&logo=education&logoColor=white)

</div>