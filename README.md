# Course Management Platform Backend Service

A comprehensive backend system for academic institutions to manage course allocations, track facilitator activities, and monitor student progress with multilingual support.

## 🚀 Features

### Module 1: Course Allocation System
- **Role-based Access Control**: Managers can create/update course allocations; Facilitators can view assigned courses.
- **CRUD Operations**: Complete management of course offerings with filtering capabilities.
- **Smart Assignment**: Automatic tracking of facilitator workload and capacity management.
- **Advanced Filtering**: Filter by trimester, cohort, intake period, facilitator, and delivery mode.

### Module 2: Facilitator Activity Tracker (FAT)
- **Weekly Activity Logs**: Comprehensive tracking of attendance, grading, and administrative tasks.
- **Redis-based Notifications**: Automated reminders and alerts for missing submissions.
- **Real-time Monitoring**: Managers can monitor submission status and completion rates.
- **Deadline Management**: Automated tracking of deadlines with escalating notifications.

### Module 3: Student Reflection Page (i18n/l10n)
- **Multilingual Support**: English and French language switching.
- **Local Storage**: Auto-save functionality and language preference persistence.
- **Responsive Design**: Mobile-friendly interface.
- **GitHub Pages Ready**: Easy deployment to GitHub Pages.

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **Message Queue**: Redis with Bull
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with comprehensive coverage
- **Security**: bcrypt, helmet, CORS, rate limiting
- **Logging**: Winston with structured logging
- **Frontend**: Vanilla HTML, CSS, JavaScript (for reflection page)

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- MySQL (v8.0 or higher)
- Redis (v6.0 or higher)
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/course-management-platform.git
   cd course-management-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```sql
   CREATE DATABASE course_management_db;
   CREATE DATABASE course_management_db_test;
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start

   # Run notification worker (in a separate terminal)
   npm run worker
   ```

## 🗄️ Database Schema

### Core Entities
- **Users**: Base authentication with role-based access.
- **Managers**: Course allocation management capabilities.
- **Facilitators**: Course delivery and activity tracking.
- **Students**: Enrollment and progress tracking.
- **Modules**: Course subjects and curriculum.
- **CourseOfferings**: Specific course instances.
- **ActivityTrackers**: Weekly facilitator activity logs.

### Key Relationships
- Users have role-specific profiles (Manager/Facilitator/Student).
- CourseOfferings link Modules, Classes, Cohorts, and Facilitators.
- ActivityTrackers belong to CourseOfferings.
- Students belong to Cohorts.

## 🔐 Authentication & Authorization

### JWT Implementation
- Access tokens (7 days default).
- Refresh tokens (30 days default).
- Automatic token refresh.
- Secure password hashing with bcrypt.

### Role-based Access Control
- **Admin**: Full system access.
- **Manager**: Course allocation management, activity monitoring.
- **Facilitator**: View assigned courses, submit activity logs.
- **Student**: Access reflection page, view own information.

## 📡 API Endpoints

### Authentication
```plaintext
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
POST /api/auth/refresh      - Refresh access token
POST /api/auth/logout       - User logout
GET  /api/auth/profile      - Get user profile
PUT  /api/auth/profile      - Update profile
POST /api/auth/change-password - Change password
```

### Course Management
```plaintext
GET    /api/courses         - Get course offerings (with filters)
POST   /api/courses         - Create course offering (Manager only)
GET    /api/courses/:id     - Get course offering details
PUT    /api/courses/:id     - Update course offering (Manager only)
DELETE /api/courses/:id     - Delete course offering (Manager only)
GET    /api/courses/my-courses - Get facilitator's assigned courses
POST   /api/courses/:id/assign-facilitator - Assign facilitator
```

### Activity Tracking
```plaintext
GET    /api/activities      - Get activity logs (with filters)
POST   /api/activities      - Submit activity log (Facilitator only)
GET    /api/activities/:id  - Get activity log details
PUT    /api/activities/:id  - Update activity log
DELETE /api/activities/:id  - Delete activity log (Manager only)
GET    /api/activities/my-logs - Get facilitator's own logs
GET    /api/activities/summary - Get weekly summary (Manager only)
```

### User Management
```plaintext
GET    /api/users           - Get all users (Admin only)
GET    /api/users/:id       - Get user by ID
PUT    /api/users/:id       - Update user (Admin only)
DELETE /api/users/:id       - Delete user (Admin only)
GET    /api/users/facilitators - Get all facilitators
GET    /api/users/students  - Get all students
GET    /api/users/stats     - Get user statistics
```

## 🔔 Notification System

### Redis Queues
- **Notifications Queue**: Email notifications and alerts.
- **Reminders Queue**: Scheduled activity log reminders.

### Automated Notifications
- **Activity Reminders**: Sent to facilitators for missing logs.
- **Manager Alerts**: Notifications for submissions and missed deadlines.
- **Deadline Monitoring**: Automated tracking with escalating alerts.

### Email Templates
- Activity log reminders.
- Manager alerts for missing submissions.
- Course allocation updates.
- System notifications.

## 🧪 Testing

### Test Coverage
- Unit tests for models and utilities.
- Integration tests for API endpoints.
- Authentication and authorization tests.
- Database relationship tests.

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/unit/models/User.test.js
```

## 🌐 Student Reflection Page

### Features
- **Language Switching**: Dynamic English/French translation.
- **Auto-save**: Automatic saving to localStorage.
- **Form Validation**: Client-side validation with feedback.
- **Responsive Design**: Mobile-friendly interface.

### Deployment to GitHub Pages
1. Create a new repository for the reflection page.
2. Copy contents of the `public/` folder.
3. Enable GitHub Pages in repository settings.
4. Access at: `https://yourusername.github.io/repository-name`.

### Local Testing
```bash
# Serve the public folder locally
npx http-server public -p 8080
```

## 📊 API Documentation

Interactive API documentation is available at:
- Development: `http://localhost:3000/api-docs`
- Swagger JSON: `http://localhost:3000/api-docs.json`

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up Redis instance
- [ ] Configure email service
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name course-management

# Start notification worker
pm2 start src/workers/notificationWorker.js --name notification-worker

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📈 Monitoring & Logging

### Winston Logging
- Structured JSON logging.
- Multiple log levels (error, warn, info, debug).
- File rotation in production.
- Console output in development.

### Health Check
```bash
GET /health
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds.
- **JWT Security**: Signed tokens with expiration.
- **Rate Limiting**: Configurable request limits.
- **Input Validation**: Comprehensive validation with express-validator.
- **SQL Injection Prevention**: Parameterized queries with Sequelize.
- **XSS Protection**: Helmet middleware.
- **CORS Configuration**: Configurable cross-origin requests.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub.
- Email: support@coursemanagement.edu.
- Documentation: Available in the `/docs` folder.

## 🎯 Project Status

✅ **Completed Features:**
- Authentication system with JWT.
- Role-based access control.
- Course allocation management.
- Activity tracking system.
- Redis notification system.
- Multilingual reflection page.
- Comprehensive API documentation.
- Unit and integration tests.
- Production-ready deployment configuration.

🔄 **Ongoing Improvements:**
- Performance optimization.
- Enhanced error handling.
- Additional test coverage.
- Advanced reporting features.

---

**Author** 
Plamedi Mayala.
