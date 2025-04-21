# 🐶 Paws & Hearts - Dog Adoption App

Hey! This is my submission for the Fetch Frontend Take-Home Exercise. I built a React app that helps users find their perfect dog match from a list of adoptable dogs. The UI is fully responsive, the data is fetched from the provided API, and the project follows the MVP design pattern.

---

## 🔗 Live Demo

**Hosted on Vercel:**  
👉 dog-adoption-gamma.vercel.app

**GitHub Repo:**  
👉 https://github.com/pavanbobba09/dog_adoption

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/pavanbobba09/dog_adoption
cd dog-adoption
npm install
npm run dev
```

Make sure you're using Node v18+ and you have Vite installed globally

## 📁 Project Structure (MVP Pattern)

```
src/
├─ models/         # API logic (fetch calls)
├─ presenters/     # Business logic and helpers
├─ views/          # React components (UI)
├─ utils/          # Validation & debounce
├─ App.jsx         # Main router config
```

## ✅ Features Implemented

1. **Login & Authentication**
   * Login using name and email [doesn’t need to be real, just well-formed]
   * Form validation and error handling
   * "Remember Me" functionality using `localStorage`
   * Auth session via HttpOnly cookie
   * Protected routes using custom `ProtectedRoute`

2. **Dog Search Page**
   * Filter by breed with search
   * Pagination with dynamic controls
   * Sort dogs by breed (A-Z, Z-A)
   * Show all dog fields (image, name, breed, age, zip_code)
   * Add/remove favorites (saved in `localStorage`)
   * Animated loading states and UI transitions

3. **Match Generation Page**
   * Match one dog based on favorites
   * Avoid repeat matches until all are shown
   * Option to try a new match or contact the shelter
   * Email opens with prefilled subject and message

4. **General UX Features**
   * Fully responsive on desktop & mobile
   * Colorful UI with gradients and emojis 🐾
   * Custom 404 Not Found page
   * Error fallback for API failures
   * Smooth transitions and animations

## 💡 Extra Features

* Input sanitization for security
* Debounce on search inputs
* Scroll-to-top on pagination
* Match progress indicator (Match 2 of 5)

## 🧩 Challenges I Overcame

Working on this project came with some interesting challenges:
* Managing state across multiple components while keeping favorites synchronized
* Implementing pagination with the API's cursor-based system
* Handling various error states from the API gracefully

I solved these by leveraging the MVP pattern and using local storage effectively!!!

## 📚 What I Learned

This project helped me improve:
* Working with external APIs and handling authentication
* Implementing complex state management across multiple views
* Creating responsive designs with Tailwind CSS
* Building a more maintainable codebase using MVP architecture
* Writing more reusable and modular components

## 🧠 Why I Used MVP Architecture

I used the **Model-View-Presenter** pattern because it keeps my app clean and modular. I've worked with tightly coupled code in past projects, and MVP makes it easier to:
* Separate UI from logic
* Test presenter functions independently
* Reuse API and business logic across views

This helped me scale the project without turning it into a mess. I also wanted it to reflect how apps are structured in real-world frontend teams.

## 📦 Tech Stack

* **React** (Frontend)
* **Tailwind CSS** (Styling)
* **Fetch API** (Data)
* **React Router DOM** (Routing)
* **Vercel** (Deployment)

## 📌 Final Thoughts

This project was fun to build! I really enjoyed making the UI playful while keeping the code organized. I focused on good structure, smooth UX, and readable logic.

The main goal was to create something that not only met the requirements but also provided a delightful experience for dog lovers looking to adopt. I hope you enjoy reviewing it as much as I enjoyed building it!

🐶✨🐶✨🐶✨
