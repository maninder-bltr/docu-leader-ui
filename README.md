# Docu-Leader Frontend

## 📋 Overview

Docu-Leader is an AI-powered document intelligence platform that combines the capabilities of a smart librarian and an accountant into one seamless interface. The frontend application provides an intuitive user interface for uploading documents, querying information, and tracking invoices with the power of AI.
URL: https://maninder-bltr.github.io/docu-leader-ui/

### 🎯 Purpose

The application serves as the visual interface for a **Domain-Aware Document Intelligence Engine** that can:
- Upload and process various document formats (PDFs, images, spreadsheets)
- Perform semantic search across document collections using RAG (Retrieval Augmented Generation)
- Automatically extract invoice data and track payments
- Generate smart reminders for overdue payments
- Provide AI-powered answers grounded in your document context

---

## ✨ Key Features

### 1. **Document Intelligence**
- Drag-and-drop document upload interface
- Support for multiple file formats (PDF, PNG, JPEG, XLSX, DOCX)
- Real-time processing status tracking
- Semantic search across all uploaded documents
- AI-powered question answering based on document content

### 2. **Invoice Management**
- Automatic invoice data extraction
- Vendor name, invoice number, dates, and amounts
- Invoice status tracking (Draft, Unpaid, Paid, Overdue)
- Payment reminder generation
- Visual invoice dashboard

### 3. **User Management**
- Secure authentication with JWT
- User registration and login
- Protected routes for authenticated users
- Session management

### 4. **Dashboard & Analytics**
- Overview of all documents and invoices
- Quick access to recent uploads
- Invoice summary statistics
- Upcoming and overdue payments

---

## 🏗 Architecture

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Core UI library |
| **React Router 6** | Navigation and routing |
| **Axios** | HTTP client for API calls |
| **Context API** | State management (Auth, Document, Invoice) |
| **CSS3** | Styling with responsive design |
| **GitHub Pages** | Hosting and deployment |

## 🔄 How It Works

### 1. **Authentication Flow**

```
User → Login/Signup → JWT Token → Authenticated Requests
```

- Users register with email/password
- Backend returns JWT token
- Token stored in localStorage
- Token attached to all subsequent API requests
- Protected routes check authentication status

### 2. **Document Upload & Processing**

```
User Upload → File Validation → API Call → Async Processing → Status Updates
```

1. User selects/drops file (validation: size, type)
2. File sent to `/api/documents` endpoint
3. Backend returns document ID with "UPLOADED" status
4. Frontend polls for status updates
5. When processing completes, document appears in list
6. Document becomes searchable in the query interface

### 3. **Semantic Search (RAG)**

```
User Query → Embedding Generation → Vector Search → Context Building → AI Answer
```

1. User types a question in the search bar
2. Query sent to `/api/documents/query` endpoint
3. Backend finds relevant document chunks using vector similarity
4. Retrieved chunks used as context for Gemini AI
5. AI generates answer grounded in document context
6. Response displayed with source document references

### 4. **Invoice Management**

```
Upload Invoice → AI Extraction → Invoice Created → Track → Payment Reminders
```

1. Invoice document uploaded (auto-detected)
2. Backend extracts: vendor, invoice#, dates, amounts
3. Invoice appears in invoice dashboard with "UNPAID" status
4. Users can:
   - Mark as paid
   - View details
   - Generate payment reminders
   - Filter by status
   - See upcoming/overdue invoices

### 5. **Real-time Updates**

- Document processing status (UPLOADED → PROCESSING → COMPLETED/FAILED)
- Invoice status changes (UNPAID → PAID)
- List refreshes after actions
- Loading states during async operations

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (Spring Boot application)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/maninder-bltr/docu-leader-ui.git
cd docu-leader-ui
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
Create `.env` file in root:
```env
REACT_APP_API_URL=[http://localhost:8088/api](https://docu-leader-backend.onrender.com)
REACT_APP_PUBLIC_URL=
```

4. **Start development server**
```bash
npm start
# or
yarn start
```

5. **Build for production**
```bash
npm run build
# or
yarn build
```

---

## 📡 API Integration

The frontend communicates with the backend through RESTful APIs:

### Document Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Upload document |
| GET | `/api/documents` | List all documents |
| GET | `/api/documents/{id}` | Get document details |
| POST | `/api/documents/query` | Semantic search |

### Invoice Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List all invoices |
| GET | `/api/invoices/{id}` | Get invoice details |
| PUT | `/api/invoices/{id}/pay` | Mark invoice as paid |
| POST | `/api/invoices/{id}/remind` | Generate reminder |
| GET | `/api/invoices/overdue` | Get overdue invoices |
| GET | `/api/invoices/due-in-next-days?days=7` | Get upcoming invoices |

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

---

## 🎨 Key Components Explained

### 1. **Landing Page** (`Landing.js`)
- Hero section with logo and value proposition
- "How It Works" steps (Upload → AI Extracts → Ask/Track)
- Use cases grid for different user personas
- Call-to-action buttons based on auth status

### 2. **DocumentUpload Component**
- Drag-and-drop zone
- File type validation
- Upload progress indicator
- Success/error notifications
- Automatic redirect to document list

### 3. **Query Interface**
- Search bar with auto-suggest
- Results display with source references
- Markdown rendering for AI answers
- Copy to clipboard functionality

### 4. **Invoice Dashboard**
- Filterable invoice list
- Status badges (UNPAID, PAID, OVERDUE)
- Quick actions (Mark Paid, Generate Reminder)
- Summary statistics
- Calendar view for due dates

---

## 🛡️ Security Features

1. **JWT Authentication**
   - Tokens stored securely in localStorage
   - Automatic token attachment to requests
   - Token expiration handling
   - Logout clears tokens

2. **Protected Routes**
   - Redirect to login for unauthenticated users
   - Role-based access ready for future

3. **Input Validation**
   - File size limits (50MB max)
   - Allowed file types
   - Form validation on login/signup

---

## 📱 Responsive Design

The application is fully responsive across:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (below 768px)

Features:
- Collapsible sidebar
- Stacked cards on mobile
- Touch-friendly buttons
- Optimized tables for small screens

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8088/api` |
| `REACT_APP_PUBLIC_URL` | Public URL for assets | `''` (empty for local) |
| `REACT_APP_MAX_FILE_SIZE` | Max upload size (MB) | `50` |

---

## 🚢 Deployment

### GitHub Pages Deployment

1. **Update package.json**
```json
{
  "homepage": "https://maninder-bltr.github.io/docu-leader-ui"
}
```

2. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

3. **Add deploy scripts**
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. **Set environment for production**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_PUBLIC_URL=/docu-leader-ui
```

5. **Deploy**
```bash
npm run deploy
```

---

## 🧪 Testing

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

---

## 📈 Performance Optimizations

1. **Code Splitting**
   - Lazy loading for routes
   - Dynamic imports for heavy components

2. **Caching**
   - API response caching
   - Memoized selectors
   - Local storage for user preferences

3. **Image Optimization**
   - Lazy loading images
   - Proper image sizing
   - WebP format support

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Team

- **Maninder Singh** - Lead Developer

---

## 📞 Support

For support, email maninder.bltr@gmail.com or create an issue in the repository.

---

## 🎯 Future Roadmap

- [ ] Multi-user workspaces
- [ ] Real-time collaboration
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email integration for reminders
- [ ] Scheduled automatic reminders
- [ ] Audit trail and version history
- [ ] Custom document templates
