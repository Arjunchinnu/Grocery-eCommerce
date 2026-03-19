# 🛒 E-Commerce Grocery Web App

A full-stack **MERN-based grocery e-commerce application** with secure authentication, Stripe payments, and password recovery functionality. This project simulates a real-world online grocery store with user and admin features.

---

## 🚀 Features

### 👤 User Features

- User Registration & Login (JWT Authentication)
- Forgot Password & Reset Password (Email-based recovery)
- Browse Products by Category
- Add to Cart / Remove from Cart
- Address Management
- Place Orders (Cash on Delivery & Online Payment)
- View Order History
- Secure Checkout with Stripe

---

### 💳 Payment Integration

- Integrated with **Stripe Payment Gateway**
- Secure card payments
- Webhook-based payment verification
- Automatic order status update (`isPaid: true`)
- Cart cleared after successful payment

---

### 🔐 Authentication & Security

- JWT-based authentication
- Protected routes
- Password hashing using bcrypt
- Secure password reset flow with token

---

### 🛍️ Admin / Seller Features

- Add / Update / Delete Products
- View All Orders
- Manage Inventory
- Order Tracking System

---

## 🏗️ Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)

### Integrations

- Stripe (Payments)
- Cloudinary (Image Upload)
- Nodemailer (Password Recovery Emails)

---

## 📂 Project Structure

```
client/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── context/
 │   ├── App.jsx
     └── main.jsx

server/
 ├── controllers/
 ├── models/
 ├── middlewares/
 ├── routes/
 ├── configs/
 └── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in your backend:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

CLOUDINARY_API_KEY=your_key
CLOUDINARY_SECRET_KEY=your_secret
CLOUDINARY_NAME=your_name

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 💻 Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/grocery-ecommerce.git
cd grocery-ecommerce
```

---

### 2️⃣ Install dependencies

#### Backend

```
cd server
npm install
```

#### Frontend

```
cd client
npm install
```

---

### 3️⃣ Run the project

#### Start Backend

```
npm run server
```

#### Start Frontend

```
npm run dev
```

---

## 💳 Stripe Webhook Setup

### Local Development

```
stripe listen --forward-to localhost:4000/api/order/webhook
```

---

### Production (Render)

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint:

```
https://your-backend.onrender.com/api/order/webhook
```

3. Select event:

```
checkout.session.completed
```

4. Copy webhook secret → add to `.env`

---

## 🌐 Deployment

### Backend

- Deploy on Render

### Frontend

- Deploy on Render / Vercel

---

## 🧪 Test Card (Stripe)

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

---

## 📸 Screenshots (Optional)

- Home Page
- Product Listing
- Cart Page
- Checkout Page
- Orders Page

---

## 📌 Future Improvements

- Razorpay Integration (India Payments)
- Real-time Order Tracking
- Push Notifications
- Admin Analytics Dashboard
- Product Reviews & Ratings

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by **Arjun**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
