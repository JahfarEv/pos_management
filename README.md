⚙️ Backend Setup

1. Clone the repository
2. 
git clone https://github.com/JahfarEv/pos_management.git

cd pos-backend

3. Install dependencies
4. 
npm install

5. Create .env file
6. 
PORT=5000

MONGO_URI=your_mongo_db_string
JWT_SECRET=your_secret_key

6. Run server
7. 
npm run dev

💻 Frontend Setup

1. Go to frontend folder
2. 
cd pos-frontend

3. Install dependencies
4. 
npm install

5. Update API base URL

Inside src/utils/api.ts:

export const VITE_API_BASE = "https://pos-management-1.onrender.com/api";

4. Start frontend
   
5. npm run dev  


user login :{
"mobile": "9876543200",
  "password":"123456"
