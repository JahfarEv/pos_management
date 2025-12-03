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

export const API_URL = "http://localhost:5000/api";

4. Start frontend
npm run dev
