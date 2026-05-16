# JAMSystem - Job Applicant Management System

## เป้าหมายโครงการ

พัฒนาเว็บระบบจัดการผู้สมัครงานที่ใช้งานได้จริงผ่าน GitHub Pages โดยมี Frontend สำหรับจัดการข้อมูลผู้สมัคร และใช้ Google Apps Script เป็น Backend API เชื่อมกับ Google Sheets เป็นฐานข้อมูล

## Tech Stack ที่เลือก

- Frontend: React + Vite
- Styling: CSS Modules หรือ CSS ปกติแบบแยกไฟล์ตาม component
- Backend: Google Apps Script Web App
- Database: Google Sheets
- Deployment: GitHub Pages

เหตุผลที่เลือก React + Vite:

- เหมาะกับ GitHub Pages เพราะ build เป็น static files ได้ง่าย
- โครงสร้าง component ชัดเจน อธิบายระหว่างสัมภาษณ์ได้ง่าย
- Vite ตั้งค่าเร็ว โค้ดไม่ซับซ้อนเกินโจทย์

## Scope หลัก

ระบบต้องทำงานกับข้อมูลผู้สมัคร โดยมีความสามารถหลักดังนี้:

1. แสดงรายการผู้สมัครทั้งหมด
2. เพิ่มผู้สมัครใหม่
3. แก้ไขข้อมูลผู้สมัคร
4. ลบผู้สมัครพร้อม confirm
5. ตรวจข้อมูลซ้ำจาก email หรือ phone
6. ควบคุมการเปลี่ยนสถานะตาม flow
7. Search, filter, sort
8. Pagination หรือ lazy load
9. Loading และ error state
10. Responsive ทั้ง mobile และ desktop

## Data Model

Google Sheets ใช้ column ดังนี้:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | รหัสผู้สมัคร สร้างอัตโนมัติ |
| name | string | yes | ชื่อผู้สมัคร |
| phone | string | yes | เบอร์โทร เป็นตัวเลข |
| email | string | yes | อีเมล รูปแบบถูกต้อง |
| position | string | yes | ตำแหน่งที่สมัคร |
| status | string | yes | Applied, Interview, Passed, Rejected |
| note | string | no | หมายเหตุ |
| created_at | string | yes | วันที่สร้างข้อมูล |
| updated_at | string | no | วันที่แก้ไขล่าสุด |

## Status Flow

สถานะที่อนุญาต:

- Applied
- Interview
- Passed
- Rejected

กติกาเบื้องต้น:

- Applied สามารถไป Interview หรือ Rejected ได้
- Interview สามารถไป Passed หรือ Rejected ได้
- Passed เป็นสถานะสุดท้าย ย้อนกลับไม่ได้
- Rejected เป็นสถานะสุดท้าย ย้อนกลับไม่ได้

ตัวอย่างที่ต้องป้องกัน:

- Passed ไป Applied
- Rejected ไป Interview
- Passed ไป Interview

## API Design

Google Apps Script Web App จะรับ request ผ่าน `doGet` และ `doPost`

เนื่องจาก Google Apps Script Web App รองรับ HTTP method แบบจำกัดในบางกรณี ฝั่ง Frontend จะส่ง action ผ่าน request body เพื่อจำลอง method:

- `GET /exec?action=list`
- `POST /exec` พร้อม body `{ "action": "create", "payload": {...} }`
- `POST /exec` พร้อม body `{ "action": "update", "id": "...", "payload": {...} }`
- `POST /exec` พร้อม body `{ "action": "delete", "id": "..." }`

Response format:

```json
{
  "success": true,
  "data": [],
  "message": "OK"
}
```

Error format:

```json
{
  "success": false,
  "error": "Validation error",
  "details": {}
}
```

## Frontend Folder Structure

```text
src/
  components/
    ApplicantForm/
    ApplicantTable/
    ConfirmDialog/
    FilterBar/
    Pagination/
    StatusBadge/
  hooks/
    useApplicants.js
  pages/
    ApplicantsPage.jsx
  services/
    applicantApi.js
  utils/
    statusFlow.js
    validators.js
    formatDate.js
  App.jsx
  main.jsx
  styles/
    global.css
```

## Component Plan

### ApplicantsPage

หน้าหลักของระบบ รวม state สำคัญ เช่น list, selected applicant, search, filter, sort, pagination, loading และ error

### ApplicantTable

แสดงข้อมูลผู้สมัครเป็นตารางบน desktop และอาจปรับเป็น card list บน mobile

### ApplicantForm

ใช้ร่วมกันทั้ง create และ update มี validation ก่อนส่งข้อมูล

### FilterBar

รวมช่อง search by name, filter by status และ sort by latest created date

### ConfirmDialog

ใช้ก่อนลบข้อมูล เพื่อป้องกันการลบโดยไม่ตั้งใจ

### StatusBadge

แสดงสถานะให้อ่านง่าย และช่วยแยกสีตามสถานะ

## Validation Plan

Frontend validation:

- name, phone, email, position ห้ามว่าง
- email ต้องตรงรูปแบบทั่วไป
- phone ต้องเป็นตัวเลข
- status ต้องอยู่ในรายการที่กำหนด
- ตรวจ status flow ก่อนส่ง update

Backend validation:

- ตรวจ field ซ้ำอีกครั้งเพื่อกันการยิง API ตรง
- ตรวจ duplicate email หรือ phone ตอน create
- ตรวจ duplicate email หรือ phone ตอน update โดยต้องไม่เทียบกับ record เดิม
- ตรวจ status flow ก่อน update
- ส่ง error message ที่อ่านเข้าใจง่าย

## Pagination Plan

เริ่มจาก client-side pagination ก่อน เพราะข้อมูลมาจาก Google Sheets และง่ายต่อการอธิบาย:

- ดึงข้อมูลทั้งหมดจาก API
- sort ด้วย created_at ล่าสุดก่อน
- filter/search จากข้อมูลใน memory
- แบ่งหน้า เช่น 10 รายการต่อหน้า

ถ้าต้องขยายระบบภายหลัง ค่อยย้าย pagination ไปทำที่ Backend

## GitHub Pages Deployment Plan

ใช้ Vite ตั้งค่า `base` ให้ตรงกับชื่อ repository เช่น:

```js
export default defineConfig({
  base: "/JAMSystem/",
  plugins: [react()]
});
```

ขั้นตอน deploy:

1. สร้าง repository บน GitHub
2. push source code
3. ติดตั้ง `gh-pages`
4. เพิ่ม script deploy ใน `package.json`
5. run `npm run deploy`
6. เปิด GitHub Pages จาก branch `gh-pages`

## ลำดับการทำงาน

### Phase 1 - Scaffold Frontend

- [x] สร้าง React + Vite project
- [x] จัด folder structure
- [x] ทำหน้า layout หลัก
- [x] สร้าง mock data เพื่อขึ้น UI ก่อน

### Phase 2 - Build UI

- [x] ทำ applicant list
- [x] ทำ form เพิ่มและแก้ไข
- [x] ทำ confirm delete
- [x] ทำ loading, empty และ error state
- [x] ทำ responsive mobile และ desktop

### Phase 3 - Frontend Logic

- [x] เพิ่ม validation
- [x] เพิ่ม search by name
- [x] เพิ่ม filter by status
- [x] เพิ่ม sort by latest created date (ปรับให้เรียงตามหัวตารางแล้ว)
- [x] เพิ่ม pagination
- [x] เพิ่ม status flow guard

### Phase 4 - Google Sheets + GAS

- [x] สร้าง Google Sheet (ใส่หัวคอลัมน์)
- [x] เขียน Apps Script API (อยู่ใน `gas/Code.gs`)
- [x] ทำ CRUD
- [x] ทำ backend validation
- [x] ทำ duplicate check
- [x] deploy GAS เป็น Web App

### Phase 5 - Connect API

- [x] ตั้งค่า API URL
- [x] เชื่อม frontend กับ GAS
- [x] handle loading และ error state จาก API จริง
- [x] ทดสอบ create, update, delete, list

### Phase 6 - Deploy + README

- ตั้งค่า GitHub Pages
- deploy frontend
- เขียน README
- ใส่วิธีติดตั้ง รัน เชื่อม Google Sheets/GAS และ deploy
- ทดสอบ URL จริง

## สิ่งที่ต้องเตรียมก่อนเริ่มเขียนโค้ด

- ชื่อ GitHub repository ที่จะใช้
- Google account สำหรับสร้าง Google Sheet และ Apps Script
- ชื่อ sheet tab เช่น `Applicants`
- URL ของ GAS Web App หลัง deploy

## Acceptance Checklist

- เปิดเว็บจาก GitHub Pages ได้จริง
- เพิ่มผู้สมัครได้
- แก้ไขข้อมูลได้
- ลบข้อมูลได้ และมี confirm
- ห้ามเพิ่ม email หรือ phone ซ้ำ
- ห้ามเปลี่ยน status ย้อน flow
- Search by name ใช้งานได้
- Filter by status ใช้งานได้
- Sort by latest created date ใช้งานได้
- Pagination ใช้งานได้
- Responsive บนมือถือ
- README มีวิธีติดตั้ง รัน เชื่อม GAS และ deploy ครบ
