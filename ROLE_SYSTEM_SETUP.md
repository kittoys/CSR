# Role System Implementation - Setup Guide

## 📋 Step-by-Step Setup

### 1. Run Database Migration

```bash
cd backend
node scripts/addRoleSystem.js
```

This script will:

- Add `created_by` column to `donation_proposals` table
- Update `users` table role column to ENUM('admin', 'petugas')
- Create `audit_log` table for tracking changes

### 2. Restart Backend Server

```bash
npm start
```

### 3. Update Frontend Startup

```bash
# In another terminal
cd frontend
npm start
```

## 👥 User Roles & Permissions

### ADMIN

- ✅ Create/Edit/Delete Programs
- ✅ Create/Edit/Delete Categories
- ✅ Create/Edit/Delete Proposals
- ✅ Approve/Reject Proposals (Change Status & Bright Status)
- ✅ View All Proposals
- ✅ View All Statistics & Charts
- ✅ Create/Edit/Delete Users (Petugas & Admin)
- ✅ Access User Management Page

### PETUGAS

- ✅ View Programs
- ✅ Create Proposals (default status "In Progress"/"Pending")
- ✅ Edit Their Own Proposals (before Admin approval)
- ✅ Upload Documents
- ✅ View Their Own Proposals Only
- ✅ View Limited Dashboard (only their proposals)
- ❌ Cannot Delete Proposals
- ❌ Cannot Access User Management
- ❌ Cannot View All Proposals

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/login` - Login (both roles)
- `POST /api/auth/register` - Create user (admin only)
- `GET /api/auth/users` - List users (admin only)
- `PUT /api/auth/users/:id` - Update user (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### Proposals

- `GET /api/proposals` - List (admin: all, petugas: own)
- `GET /api/proposals/:id` - View (admin: all, petugas: own)
- `POST /api/proposals` - Create (both roles, different defaults)
- `PUT /api/proposals/:id` - Update (admin: all, petugas: own)
- `DELETE /api/proposals/:id` - Delete (admin only)

## 🔄 Migration from Old System

If you have existing data without role tracking:

1. All existing proposals will have `created_by = NULL`
2. During update, admin can see/modify all proposals
3. Assign `created_by` to existing proposals (optional migration script)

## 📝 Test Accounts

Create test accounts via `/users` page (admin only):

1. **Admin Account**
   - Email: `admin@csr.com`
   - Password: any password
   - Role: `admin`

2. **Petugas Account**
   - Email: `petugas@csr.com`
   - Password: any password
   - Role: `petugas`

## 🎯 Testing the Role System

### As Admin:

1. Login with admin account
2. Go to `/users` to manage users
3. Create a petugas account
4. Navigate to proposals - see all proposals
5. Can approve/reject proposals

### As Petugas:

1. Login with petugas account
2. Go to proposals - see only their own
3. Can create new proposal
4. Cannot see other proposals
5. Cannot access `/users` page (redirected to unauthorized)

## 🐛 Troubleshooting

### Database error: "ER_DUP_FIELDNAME"

- Column already exists (safe to ignore)

### Login fails for petugas

- Check user role in database: `SELECT * FROM users WHERE email = 'petugas@csr.com';`
- Should show role = 'petugas'

### Cannot create proposals as petugas

- Check authentication token in localStorage
- Verify `created_by` is being set in INSERT query

### Cannot see user management page

- Only admin role can access `/users`
- Non-admins redirected to `/unauthorized`

## 📚 Files Modified/Created

### Backend

- ✅ `scripts/addRoleSystem.js` - Migration script
- ✅ `src/middleware/authMiddleware.js` - Role-based middleware
- ✅ `src/routes/auth.js` - Auth endpoints
- ✅ `src/routes/proposals.js` - Role-based proposals

### Frontend

- ✅ `components/RoleBasedRoute.jsx` - Role-based routing component
- ✅ `pages/Unauthorized.jsx` - Unauthorized page
- ✅ `pages/UserManagement.jsx` - User management page
- ✅ `src/App.js` - Updated routing

## 🚀 Next Steps

1. Test the role system with both admin and petugas accounts
2. Create petugas dashboards with limited features
3. Add role icons/badges in Navbar
4. Implement audit logging for proposals
5. Add email notifications for proposal status changes
