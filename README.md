# Preorder Manager: Assessment Submission

This is a full-stack preorder management system built as an assessment submission. The application is built using **Next.js 16 (App Router)**, **SQLite**, and **Prisma ORM**, styled with Tailwind CSS to match the provided UI mockups.

---

## 🚀 Quick Start (Local Run)

Follow these steps to run the application locally on your machine.

### Prerequisites
* **Node.js** (v18.x or higher, Node v24.x recommended)
* **npm** (v9.x or higher)

### Setup & Run Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment File**:
   Copy the template to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt, use: `copy .env.example .env`)*

3. **Run Database Migrations**:
   This sets up the local SQLite database schema and applies default indexes.
   ```bash
   npx prisma migrate dev
   ```

4. **Seed Database**:
   Populates the database with 45 realistic, paginated preorder records.
   ```bash
   npx prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Open Browser**:
   Open [http://localhost:3000](http://localhost:3000) to view the application.

6. **Validate Production Build**:
   ```bash
   npm run build
   ```

---

## 📋 Assessment Requirements Fulfillment Checklist

Here is how each specification outlined in the assessment brief has been implemented:

### 1. Preorder List Page (`/`)
* [x] **Backend-Driven Filters**: Status tabs for `All`, `Active`, and `Inactive` query the database directly using database filter clauses (`where: { active: boolean }`).
* [x] **Backend-Driven Sorting**: Sorting by `Name`, `Created At`, `Starts At`, and `Ends At` is executed at the database query level (`orderBy`).
* [x] **Backend-Driven Pagination**: Renders records in slices of 8 items per page using Prisma's `take` and `skip` query offsets.
* [x] **Empty State**: Renders an interactive, centered empty state layout if no database preorders match the current filter query.

### 2. Status Switch and Delete
* [x] **Pill Toggle Switch**: Clickable active/inactive switch updates the database instantly via a Server Action. Local UI state updates optimistically and rolls back automatically if the network fails.
* [x] **Double-Confirmation Delete Modal**: Renders a warning modal before triggering the database delete action.

### 3. Selection Checkboxes
* [x] **Row Checkbox**: Client-side selection state toggle.
* [x] **Select All Checkbox**: Selects/deselects all rows on the current page.
* [x] **No Action Buttons**: No action buttons are displayed, adhering to the requirements.

### 4. Create & Update Preorder Routes
* [x] **Create Page (`/preorder/create`)**: Displays a clean form to add new records.
* [x] **Update Page (`/preorder/[id]`)**: Dynamic route that retrieves record values on the server and prefills all form input fields.
* [x] **Navigation Controls**: 
  * "Cancel" and "Back" buttons redirect cleanly back to the home page list.
  * "Save changes" redirects to `/` on a successful database operation.
* [x] **Loading States**: Displays an inline animated spinner on the "Save changes" button while saving.
* [x] **Form Validation**: Strict client-side and server-side validation using Zod (including range limits that force `endsAt` > `startsAt`).

---

## 🚀 Vercel Deployment Instructions

Since Vercel has a read-only filesystem, this project includes a serverless SQLite bridge configuration in [src/lib/prisma.ts](file:///e:/Development/Assesment/Xubitar/src/lib/prisma.ts) to enable SQLite read/write operations without external databases.

1. **Deploy Repository**: Deploy your GitHub repository to Vercel.
2. **Configure Environment Variable**: In Vercel's Environment Variables settings, add:
   ```env
   DATABASE_URL="file:/tmp/dev.db"
   ```
3. **Commit Database**: Ensure that `prisma/dev.db` is committed to version control so it gets deployed to Vercel's build directory. (We have configured [.gitignore](file:///e:/Development/Assesment/Xubitar/.gitignore) to keep `dev.db` trackable while ignoring SQLite lock and log files).

At startup, the app will automatically copy your database file to the writeable `/tmp` directory, allowing reads and writes to succeed.

---

## 📁 Repository Structure

```
.
├── prisma/
│   ├── dev.db               # SQLite database file (committed for Vercel deployment)
│   ├── schema.prisma        # Database models & index declarations
│   └── seed.ts              # Seeder with 45 realistic products
├── src/
│   ├── actions/
│   │   └── preorder.ts      # Server Actions (Create, Update, Toggle Active, Delete)
│   ├── app/
│   │   ├── globals.css      # Core styles & Tailwind rules
│   │   ├── layout.tsx       # Root layout with fonts & notifications
│   │   ├── loading.tsx      # Skeleton loader screen
│   │   ├── page.tsx         # List page with backend search queries & validation
│   │   └── preorder/
│   │       ├── [id]/
│   │       │   └── page.tsx # Update page
│   │       └── create/
│   │           └── page.tsx # Create page
│   ├── components/
│   │   └── preorder/
│   │       ├── FilterTabs.tsx   # All / Active / Inactive tabs
│   │       ├── Pagination.tsx   # Pagination controller
│   │       ├── PreorderForm.tsx # Dual-use Create/Update Form
│   │       ├── PreorderTable.tsx# Table list with checkbox and toggle actions
│   │       └── SortDropdown.tsx # Sorting and direction options
│   ├── lib/
│   │   ├── date.ts          # Server-safe timezone converters
│   │   ├── prisma.ts        # Prisma Client with serverless /tmp bridge
│   │   └── validations.ts   # Zod validation schemas
├── .env.example             # Environment variable template
├── DOCUMENTATION.md         # In-depth technical architecture & Interview prep Q&A
└── README.md                # Submission setup & checklist guide
```
