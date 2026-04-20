#  Korean E-commerce Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A premium, high-performance e-commerce frontend designed for a seamless Korean shopping experience. Built with a modern tech stack focusing on performance, aesthetics, and user engagement.

---

## ✨ Key Features

- **🚀 Performance First**: Built with **Vite 6** and **React 19** for lightning-fast HMR and optimized production builds.
- **🎨 Premium UI/UX**: Modern design system using **Tailwind CSS 4**, featuring glassmorphism, smooth animations, and a mobile-first approach.
- **🌓 Adaptive Theme**: Full **Dark Mode** support with smooth transitions via `next-themes`.
- **🧴 Skin Type Quiz**: Interactive assessment tool to provide personalized product recommendations.
- **🛒 Dynamic Shopping Cart**: Real-time cart management with persistent storage and optimistic UI updates.
- **🛡️ Admin Suite**: Comprehensive dashboard for managing products, categories, banners, and users.
- **🔍 Intelligent Search**: Advanced search functionality with category filters and real-time results.
- **🌐 Multilingual Content**: Specialized "About Us" page designed for global reach.
- **📱 Mobile Optimized**: Responsive design tailored for a flawless experience across all devices.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **State & Routing**: [React Router DOM 7](https://reactrouter.com/), [Axios](https://axios-http.com/)
- **Feedback**: [React Hot Toast](https://react-hot-toast.com/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes)

---

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
│   ├── admin/      # Admin-specific components
│   ├── common/     # Shared layout elements (Loader, etc.)
│   ├── coupang/    # Affiliate/Integration components
│   └── ui/         # Base UI primitives
├── context/        # React Context for global state
├── hooks/          # Custom React hooks
├── lib/            # External library configurations
├── pages/          # Full page components
│   ├── banners/    # Dynamic banner pages
│   └── admin/      # Admin dashboard pages
├── utils/          # Helper functions and constants
├── App.jsx         # Main application routing
└── main.jsx        # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Korean-Ecommerce-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with HMR. |
| `npm run build` | Compiles the application for production. |
| `npm run lint` | Runs ESLint to find and fix code style issues. |
| `npm run preview` | Previews the local production build. |

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

