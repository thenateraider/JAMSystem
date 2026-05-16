# JAMSystem - Job Application Management System

JAMSystem is a modern, responsive, and fully functional web application designed to track job applicants, their hiring status, and candidate records management. It provides a beautiful interface powered by React and uses Google Sheets as a real-time, zero-cost backend database.

## 🌟 Features

- **Modern UI/UX**: Clean, responsive design with smooth micro-animations, glassmorphism, and instant user feedback (Toast notifications, loading states).
- **Full CRUD Operations**: Add, Edit, and Delete applicant records seamlessly.
- **Smart Validation**: 
  - Frontend and Backend duplicate checks (preventing identical names, emails, and phone numbers).
  - Phone number formatting preservation.
- **Dynamic Status Flow**: Strict status transitions (e.g., from `Applied` you can only move to `Interview` or `Rejected`), preventing accidental workflow bypasses.
- **Real-time Backend**: Uses Google Apps Script to read and write directly to your personal Google Sheet. No expensive server needed!

## 🛠 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (No CSS frameworks, fully custom UI tokens).
- **Backend / Database**: Google Sheets + Google Apps Script (GAS).
- **Deployment**: GitHub Pages.

---

## 🚀 Quick Start (Local Development)

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/JAMSystem.git
   cd JAMSystem
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173`

---

## ⚙️ Backend Setup (Google Sheets API)

JAMSystem uses Google Sheets as a database. If you want to connect it to your own sheet:

### 1. Prepare the Google Sheet
- Create a new Google Sheet.
- Rename the active tab at the bottom to **`Applicants`** (Case sensitive).
- In the very first row (Row 1), create the following columns exactly as written:
  `id` | `title` | `name` | `email` | `phone` | `position` | `status` | `note` | `created_at` | `updated_at`

### 2. Deploy the Apps Script
- In your Google Sheet, click **Extensions > Apps Script**.
- Delete any existing code and paste the entire contents of the [`gas/Code.gs`](gas/Code.gs) file found in this repository.
- Click **Deploy > New deployment**.
- Select **Web app**.
- Set "Execute as" to **Me**.
- Set "Who has access" to **Anyone**. (Crucial for the React app to communicate with it).
- Click **Deploy** and authorize the permissions.
- **Copy the generated Web App URL**.

### 3. Connect the API
- In the project code, open `src/services/applicantApi.js`.
- Replace the `API_URL` constant with your new Web App URL:
  ```javascript
  export const API_URL = 'https://script.google.com/macros/s/.../exec'
  ```

---

## 🌍 Deployment (GitHub Pages)

This project is configured to be easily deployed to GitHub Pages.

1. Ensure the `base` in `vite.config.js` matches your GitHub repository name:
   ```javascript
   export default defineConfig({
     base: '/JAMSystem/', // Change this if your repo is named differently
     plugins: [react()],
   })
   ```

2. Run the deployment script:
   ```bash
   npm run deploy
   ```

3. Go to your GitHub repository settings -> **Pages**.
4. Set the source branch to **`gh-pages`** and save. Your site will be live shortly!

---

## 📄 License
This project is open-source and available under the MIT License.
