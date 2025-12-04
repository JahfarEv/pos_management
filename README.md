⚙️ Backend Setup

1. Clone the repository
git clone https://github.com/JahfarEv/pos_management.git
cd pos-backend

2. Install dependencies
npm install

3. Create .env file
PORT=5000
MONGO_URI=your_mongo_db_string
JWT_SECRET=your_secret_key

4. Run server
npm run dev

💻 Frontend Setup

1. Go to frontend folder
cd pos-frontend

2. Install dependencies
npm install

3. Update API base URL

Inside src/utils/api.ts:

export const VITE_API_BASE = "https://pos-management-1.onrender.com/api";

4. Start frontend
npm run dev  


user login :{
"mobile": "9876543200",
  "password":"123456"
