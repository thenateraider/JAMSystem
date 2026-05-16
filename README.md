<img width="1095" height="155" alt="Screenshot 2026-05-16 at 16 07 02" src="https://github.com/user-attachments/assets/697c7c63-4cc9-4c70-aa9f-7624c58097a7" />

# JAMSystem — Job Application Management System

A modern, responsive, and fully functional web application for tracking job applicants through the entire hiring pipeline. Built with React and backed by a free, real-time Google Sheets database via Google Apps Script.

> **Live Demo:** [https://thenateraider.github.io/JAMSystem/](https://thenateraider.github.io/JAMSystem/)

---

## 📸 Screenshots

### Dashboard Overview
<img width="1724" height="1119" alt="Screenshot 2026-05-16 at 15 50 36" src="https://github.com/user-attachments/assets/d5e552b0-e1da-4079-8ab9-976ea39e300b" />


### Add New Applicant Modal
<img width="1165" height="769" alt="Screenshot 2026-05-16 at 15 53 44" src="https://github.com/user-attachments/assets/1237ab7f-6d41-4431-a075-2482042cf02b" />


### Edit Applicant Modal (with Delete button)

<img width="1056" height="738" alt="Screenshot 2026-05-16 at 15 54 10" src="https://github.com/user-attachments/assets/109d387b-b57e-486c-b0f8-82fed122b9c9" />


### Confirmation Dialog (with loading spinner)
<img width="489" height="251" alt="Screenshot 2026-05-16 at 15 54 38" src="https://github.com/user-attachments/assets/9a6a8758-61ca-4fbe-bc2a-3c952bfd6355" />

### Toast Notification (Success)
<img width="1662" height="891" alt="Screenshot 2026-05-16 at 15 55 13" src="https://github.com/user-attachments/assets/658613c4-ec5d-4644-b56f-ccd40c7bc110" />

---

## 🌟 Features Overview

### 1. Dashboard Statistics
The top of the page displays **5 real-time stat cards** that automatically update as you add, edit, or delete records:

| Card | Description |
|------|-------------|
| **Total** | Total number of all applicants in the database |
| **Applied** | Applicants who have newly applied |
| **Interview** | Applicants who have been invited to an interview |
| **Passed** | Applicants who have passed the interview and been approved |
| **Rejected** | Applicants who have been rejected at any stage |

All counts update **instantly** when any CRUD operation is confirmed, without needing to refresh the page.

---

### 2. Applicant Table

The main table displays all applicant records with the following columns:

| Column | Description |
|--------|-------------|
| **ID** | Auto-generated unique identifier in `A0001` format |
| **Name** | Full name including honorific title (e.g., Mr. John Doe) |
| **Email** | Applicant's email address |
| **Phone** | Applicant's phone number (stored as text to preserve leading zero) |
| **Position** | Job position the applicant has applied for |
| **Status** | Color-coded badge showing the current hiring stage |
| **Updated At** | Date and time of the most recent edit |
| **Created At** | Date and time the record was first created |
| **Actions** | Edit (✎) and Delete (✕) buttons for each row |

<img width="1496" height="851" alt="Screenshot 2026-05-16 at 15 56 22" src="https://github.com/user-attachments/assets/ad049fb8-b055-4aaf-ac44-e8494263537a" />

---

### 3. Column Sorting (Ascending / Descending)

Every column header in the table is **clickable** and acts as a sort toggle.

- **First click** on a column → Sorts **Ascending (A → Z / Oldest → Newest)** and shows an **↑** arrow indicator.
- **Second click** on the same column → Sorts **Descending (Z → A / Newest → Oldest)** and shows a **↓** arrow indicator.
- Clicking a **different column** resets the direction to Ascending for that new column.

This works for all columns including `ID`, `Name`, `Email`, `Phone`, `Position`, `Status`, `Created At`, and `Updated At`.

> By default, the table is sorted by **ID** in **Descending** order, so the newest applicant always appears at the top.


<img width="800" height="415" alt="ezgif-58a6fa63f9164071" src="https://github.com/user-attachments/assets/c4235f67-05bc-46a5-81e0-dd81201a9130" />


---

### 4.1 Search

The **Search Bar** filters applicants in real-time as you type. No button press is required.

It searches across the following fields simultaneously:
- **Name**
- **Position**
- **Email**
- **ID**

The search is **case-insensitive**, meaning searching `"john"` will match `"John"`, `"JOHN"`, or `"JoHn"`.

When a search is active and no records match, the table displays an empty state message.

### 4.2 Status Filter

A **dropdown filter** next to the search bar allows you to quickly filter applicants by their current hiring status.

Available filter options:
- All (show everyone — default)
- Applied
- Interview
- Passed
- Rejected

The filter works **in combination with the search bar**. For example, you can search for "developer" and also filter by "Interview" at the same time.

<img width="800" height="415" alt="searchbar" src="https://github.com/user-attachments/assets/377ab1d6-fb24-45f4-b09f-afe86c9a3bac" />

---

### 5. Pagination

The table uses **pagination** to keep the interface clean and performant when the database grows large.

- Displays **10 records per page** by default.
- Shows **Previous** and **Next** buttons to navigate between pages.
- The current page resets automatically to page 1 when you apply a new search or filter.

<img width="619" height="380" alt="Screenshot 2026-05-16 at 16 02 35" src="https://github.com/user-attachments/assets/f704cd55-de6c-4cba-842c-e60bbd6f4e0d" />


---

### 6. Add New Applicant

Clicking the **"+ Add New Applicant"** button (top-right on desktop, full-width on mobile) opens a modal form.

**Form Fields:**

| Field | Type | Validation |
|-------|------|------------|
| **Title** | Dropdown (Mr. / Mrs. / Miss / Ms. / Other) | Required |
| **Name** | Text input | Required, min. 2 characters |
| **Email** | Email input | Required, must be valid format (`name@domain.tld`) |
| **Phone** | Tel input | Required, must start with `0` and be exactly 10 digits |
| **Position** | Text input | Required, min. 2 characters |
| **Status** | Dropdown | Fixed to "Applied" for new entries |
| **Note** | Textarea | Optional, for any additional remarks |

<img width="721" height="702" alt="Screenshot 2026-05-16 at 16 02 56" src="https://github.com/user-attachments/assets/7b5c571c-0aad-4de8-bce2-887dcf88f596" />


---

### 7. Edit Applicant

Clicking the **✎ (pencil) icon** in any table row, or the edit button in the table, opens the **Edit Applicant modal** pre-filled with the existing data.

In addition to the normal form fields, the Edit modal includes:

- **A "Delete" button** (red) positioned between Cancel and Save.
- The **Status dropdown** is restricted to only show valid next steps based on the current status (see Status Flow below).

<img width="659" height="691" alt="Screenshot 2026-05-16 at 16 03 14" src="https://github.com/user-attachments/assets/9b8e9081-2d07-4d71-bde1-33bfe24fac64" />


---

### 9. Validation System (Frontend)

All form inputs are validated in real-time as you type. Errors appear instantly below each field in red text.

#### ✅ Email Validation
- Must follow the standard format: `something@domain.tld`
- **Duplicate Check:** If another applicant in the database already has the same email address, an error is shown immediately: *"This Email is already registered."*

#### ✅ Phone Number Validation
- Must start with the digit `0`
- Must be exactly **10 digits** long (no letters, no dashes, no spaces)
- **Duplicate Check:** If another applicant has the same phone number: *"This phone number is already registered."*

#### ✅ Name + Title Duplicate Check
- Checks the combination of **Title + Full Name** (case-insensitive)
- For example, adding `Mr. John Doe` will be rejected if `mr. john doe` already exists.
- Error message: *"This exact name and title is already registered."*

#### ✅ Shake Animation
If you try to submit the form with a validation error, the offending field **shakes** to draw your attention to it visually.
<img width="800" height="454" alt="shakeerror" src="https://github.com/user-attachments/assets/6c6a51bc-dd3c-4fcd-a543-f2bde2aa7967" />


---

### 10. Status Flow Guard (Hiring Pipeline)

The Status dropdown in the **Edit** modal is intelligently restricted based on the applicant's **current status**. You cannot skip stages or undo a rejection.

| Current Status | Allowed Next Statuses |
|----------------|----------------------|
| **Applied** | Applied, Interview, Rejected |
| **Interview** | Interview, Passed, Rejected |
| **Passed** | Passed (locked — no further changes) |
| **Rejected** | Rejected (locked — can only Delete) |

This prevents accidental or incorrect status changes (e.g., moving someone directly from "Applied" to "Passed" without interviewing them, or un-rejecting an applicant).

> When a status is locked (Passed or Rejected), the dropdown is automatically disabled.

<img width="816" height="750" alt="Screenshot 2026-05-16 at 16 05 31" src="https://github.com/user-attachments/assets/9e9bc246-3b59-4afd-b6bf-c2419b6e4caf" />


---

### 11. Confirm Dialogs

All potentially destructive or permanent actions require a **two-step confirmation** via a modal dialog.

There are three types of confirmations:

1. **Save Applicant** — Appears when you click "Save Applicant" on the Add or Edit form.
2. **Delete Applicant** — Appears when you click "Delete" from the Edit modal or the ✕ button in the table. Shows the applicant's name and a red warning: *"This action cannot be undone."*
3. **Discard Changes** — Appears when you click "Cancel" or "✕" on the Edit modal while you have made unsaved changes to the form.

#### Loading Spinner on Confirm Button
Once you click **"Confirm"** in any dialog, the button instantly transforms into a **spinning loading indicator**:
- The confirm button is **disabled** (cannot be clicked again).
- The cancel button is also **disabled** (cannot interrupt the operation mid-way).
- This prevents double-submissions and data corruption during the network request.

<img width="530" height="295" alt="Screenshot 2026-05-16 at 16 06 04" src="https://github.com/user-attachments/assets/cf95148d-1207-4442-a79f-77e15aa6122d" />


---

### 12. Toast Notifications

After every completed action, a **Toast notification** slides in from the bottom-right corner of the screen to provide instant feedback.

| Action | Toast Message | Color |
|--------|--------------|-------|
| Add Applicant | "Applicant saved successfully" | 🟢 Green |
| Edit Applicant | "Applicant updated successfully" | 🟢 Green |
| Delete Applicant | "Applicant deleted successfully" | 🟢 Green |
| Any Error (duplicate, API error, etc.) | Error message from server | 🔴 Red |

- The toast **automatically disappears** after 5 seconds.
- You can also **manually close** it by clicking the `✕` button on the toast.

<img width="1662" height="891" alt="Screenshot 2026-05-16 at 15 55 13" src="https://github.com/user-attachments/assets/658613c4-ec5d-4644-b56f-ccd40c7bc110" />


---

### 13. Backend Validation (Google Apps Script)

Even though the frontend validates everything, the **Google Apps Script backend** independently re-validates all data before writing to the Google Sheet. This is the second layer of defense.

The backend checks for:
- **Duplicate Email**
- **Duplicate Phone Number**
- **Duplicate Name + Title** (exact match, case-insensitive)

This means the data integrity of your Google Sheet is maintained even if someone bypasses the frontend UI and calls the API directly.

---

### 14. Auto-Incrementing ID

The backend automatically assigns a unique ID to every new applicant in the format `A0001`, `A0002`, `A0003`, and so on.

The ID is generated by:
1. Scanning all existing rows in the Google Sheet.
2. Finding the highest current numeric suffix.
3. Incrementing it by 1 and padding it to 4 digits.

This logic runs entirely server-side, preventing ID conflicts even if multiple users add applicants at the same time.

---

### 15. Phone Number Formatting (Google Sheets)

Thai phone numbers start with `0`, which Google Sheets normally strips when it interprets the value as a number. JAMSystem solves this by instructing the backend to **prefix the phone value with a single quote** (`'`), forcing Google Sheets to treat it as plain text and preserve the leading zero.

The single quote is invisible in the sheet's cell display and is also invisible when the data is read back into the app.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | React 19 (via Vite) |
| **Styling** | Vanilla CSS (no CSS frameworks) — custom design tokens, glassmorphism, micro-animations |
| **State Management** | React Hooks (`useState`, `useEffect`, `useMemo`) |
| **Backend / Database** | Google Sheets + Google Apps Script (GAS) |
| **Deployment** | GitHub Pages (via `gh-pages`) |

---

## 🚀 Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thenateraider/JAMSystem.git
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

## ⚙️ Backend Setup (Google Sheets + Google Apps Script)

JAMSystem uses Google Sheets as its database. Follow these steps to connect your own sheet:

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Rename the tab at the bottom of the sheet to exactly: **`Applicants`** (case-sensitive).
3. In **Row 1**, add the following column headers exactly as shown:

   | A | B | C | D | E | F | G | H | I | J |
   |---|---|---|---|---|---|---|---|---|---|
   | id | title | name | email | phone | position | status | note | created_at | updated_at |

### Step 2: Deploy the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any existing code in the editor.
3. Paste the entire contents of the [`gas/Code.gs`](gas/Code.gs) file from this repository.
4. Click **Deploy → New deployment**.
5. Under "Select type", choose **Web app**.
6. Configure the settings:
   - **Description:** `JAMSystem API v1`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
7. Click **Deploy** and **authorize** the required permissions.
8. **Copy the generated Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

### Step 3: Connect the API to the Frontend

1. Open `src/services/applicantApi.js`.
2. Replace the `API_URL` value with your new Web App URL:
   ```javascript
   export const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
   ```

---

## 🌍 Deployment (GitHub Pages)

1. Ensure `vite.config.js` has the correct `base` path matching your repository name:
   ```javascript
   export default defineConfig({
     base: '/JAMSystem/', // Change this if your repo name is different
     plugins: [react()],
   })
   ```

2. Run the deploy command:
   ```bash
   npm run deploy
   ```

3. In your GitHub repository, go to **Settings → Pages**.
4. Set source to **Deploy from a branch**, select the **`gh-pages`** branch, and click **Save**.
5. Your site will be live at `https://[your-username].github.io/JAMSystem/`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
