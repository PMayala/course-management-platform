# Course Management Platform Backend Service

A comprehensive backend service for managing course allocations, facilitator activities, and student progress in academic institutions.

## 🚀 Features

### Module 1: Course Allocation System
- **Role-based Access**: Managers can create, update, delete course offerings; Facilitators can view assigned courses
- **Comprehensive Filtering**: Filter by trimester, cohort, intake period, facilitator, and delivery mode
- **Relationship Management**: Complex relationships between modules, cohorts, classes, facilitators, and delivery modes

### Module 2: Facilitator Activity Tracker (FAT)
- **Weekly Activity Logs**: Track attendance, grading progress, moderation, and administrative tasks
- **Status Tracking**: Monitor completion status (Done, Pending, Not Started) for various activities
- **Redis-backed Notifications**: Automated reminders and compliance alerts
- **Background Workers**: Process notification queues and track delivery results

### Module 3: Student Reflection Page (i18n/l10n)
- **Multilingual Support**: Dynamic language switching between English and French
- **Interactive Interface**: User-friendly reflection prompts and responses
- **GitHub Pages Hosting**: Deployed static site with full internationalization

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Message Queue**: Redis with Bull queue processing
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with Supertest
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Redis (v6.0 or higher)
- Git

## ⚡ Quick Start

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd course-management-platform
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env` file in the root directory:
\`\`\`env
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
\`\`\`

### 4. Database Setup
\`\`\`bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE course_management;
exit

# Run database migrations (automatic on server start)
npm start
\`\`\`

### 5. Seed Database (Optional)
\`\`\`bash
npm run seed
\`\`\`

### 6. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The server will start on `http://localhost:3000`
API documentation available at `http://localhost:3000/api-docs`

## 📊 Database Schema

### Core Entities
- **Managers**: System administrators who manage course allocations
- **Facilitators**: Instructors assigned to teach specific courses
- **Students**: Learners enrolled in cohorts and classes
- **Modules**: Course subjects with codes, credits, and descriptions
- **Cohorts**: Student groups with program and timeline information
- **Classes**: Academic terms (e.g., 2024S, 2025J)
- **Modes**: Delivery methods (Online, In-person, Hybrid)

### Relationships
- **CourseOffering**: Links modules, facilitators, cohorts, classes, and modes
- **ActivityTracker**: Weekly activity logs linked to course offerings

## 🔐 Authentication Flow

### Registration
\`\`\`bash
# Register Manager
POST /api/auth/register/manager
Content-Type: application/json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@university.edu",
  "password": "Manager123!"
}

# Register Facilitator
POST /api/auth/register/facilitator
Content-Type: application/json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@university.edu",
  "password": "Facilitator123!",
  "specialization": "JavaScript & Node.js"
}
\`\`\`

### Login
\`\`\`bash
POST /api/auth/login
Content-Type: application/json
{
  "email": "alice@university.edu",
  "password": "Manager123!",
  "role": "manager"
}
\`\`\`

Response includes JWT token for subsequent API calls.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/manager` - Register new manager
- `POST /api/auth/register/facilitator` - Register new facilitator
- `POST /api/auth/login` - Login user

### Course Management
- `GET /api/courses` - List course offerings (with filters)
- `POST /api/courses` - Create course offering (managers only)
- `PUT /api/courses/:id` - Update course offering (managers only)
- `DELETE /api/courses/:id` - Delete course offering (managers only)

### Facilitator Management
- `GET /api/facilitators` - List all facilitators (managers only)
- `GET /api/facilitators/my-courses` - Get assigned courses (facilitators only)

### Activity Tracking
- `GET /api/activities` - List activity logs (with filters)
- `POST /api/activities` - Create/update activity log (facilitators only)

### File Upload System
- **Document Upload**: Upload activity-related documents and attachments
- **Profile Pictures**: Upload and manage user profile pictures
- **Bulk Upload**: Upload multiple files simultaneously
- **File Validation**: Automatic file type and size validation
- **Secure Storage**: Files stored securely with unique naming

### File Upload Endpoints
- `POST /api/uploads/activity-document` - Upload activity documents
- `POST /api/uploads/profile-picture` - Upload profile pictures
- `POST /api/uploads/bulk-upload` - Upload multiple files
- `GET /uploads/:filename` - Serve uploaded files

### File Upload Examples
\`\`\`bash
# Upload activity document
curl -X POST "http://localhost:3000/api/uploads/activity-document" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@/path/to/file.pdf" \
  -F "activityId=1" \
  -F "description=Weekly report"

# Upload profile picture
curl -X POST "http://localhost:3000/api/uploads/profile-picture" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "picture=@/path/to/image.jpg"
\`\`\`

### File Upload Configuration
- **Maximum file size**: 10MB
- **Allowed file types**: JPEG, PNG, PDF, DOC, DOCX, TXT, CSV, XLSX
- **Storage location**: `/uploads` directory
- **Naming convention**: `fieldname-timestamp-random.extension`

### Query Parameters
Course and activity endpoints support filtering:
- `trimester`: T1, T2, T3
- `cohortId`: Integer
- `intakePeriod`: HT1, HT2, FT
- `facilitatorId`: Integer
- `modeId`: Integer
- `weekNumber`: 1-52 (activities only)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers and protection
- **SQL Injection Prevention**: Parameterized queries with Sequelize

## 📨 Notification System

### Redis Queue Processing
- **Activity Submissions**: Notify managers when facilitators submit logs
- **Deadline Reminders**: Automated reminders for missing submissions
- **Compliance Alerts**: Manager notifications for missed deadlines
- **Background Workers**: Process queues with retry logic and error handling

### Notification Types
- `activity_submitted`: Facilitator submits weekly log
- `deadline_reminder`: Automated reminder for pending submissions
- `compliance_alert`: Manager alert for missed deadlines

## 🧪 Testing

### Run Tests
\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
\`\`\`

### Test Coverage
- **Model Tests**: Manager, CourseOffering, ActivityTracker
- **Utility Tests**: Password validation, email validation, trimester validation
- **Integration Tests**: API endpoints with authentication

## 🌐 Student Reflection Page (i18n/l10n)

### Features
- **Multilingual Interface**: English and French language support
- **Dynamic Content Switching**: Real-time language toggling
- **Reflection Prompts**: Interactive questions about course experience
- **Responsive Design**: Mobile-friendly interface

### GitHub Pages Deployment
The reflection page is deployed as a static site supporting:
- Language detection and preference storage
- Smooth content transitions
- Accessible design patterns
- Modern web standards

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are configured:
- Database connection details
- Redis connection settings
- JWT secret key
- Application port

### Production Considerations
- Use environment-specific database configurations
- Configure Redis clustering for high availability
- Set up proper logging and monitoring
- Implement backup strategies for database
- Use HTTPS in production
- Configure proper CORS policies

## 📈 Performance Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Redis Caching**: Fast notification queue processing
- **Background Workers**: Non-blocking notification processing
- **Pagination**: Large dataset handling (implement as needed)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/api-docs`
2. Review the test files for usage examples
3. Create an issue in the GitHub repository

## 🏗️ Architecture Notes

### Design Patterns
- **MVC Architecture**: Clear separation of models, routes, and business logic
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Middleware Pattern**: Authentication and validation

### Scalability Considerations
- **Horizontal Scaling**: Stateless API design
- **Database Optimization**: Proper indexing and relationships
- **Queue Processing**: Background job handling
- **Caching Strategy**: Redis for frequently accessed data

---

