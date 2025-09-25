# 🏠 Airbnb Frontend

A polished Airbnb-style property rental experience built with Angular 20. This project showcases a modern SPA with advanced search, booking workflows, and rich host tooling.

![Angular](https://img.shields.io/badge/Angular-20.1.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-2.2.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## ✨ Highlights

- **Dynamic Search** with location, date, and guest filtering
- **Interactive Maps** using Leaflet and Google Maps integrations
- **Host Dashboard** for property management, availability calendars, and pricing tools
- **Real-time Messaging** powered by SignalR for guest-host conversations
- **AI Chatbot** support and notification center for instant assistance
- **Internationalization** with English and Arabic (RTL) support via `ngx-translate`

---

## 🧰 Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | Angular 20, Angular Material, RxJS |
| Styling | Tailwind CSS, Bootstrap, Animate.css |
| Maps & Media | Leaflet, @angular/google-maps, Swiper |
| Communication | SignalR, RxJS, ngx-cookie-service |
| Tooling | Angular CLI, Prettier, Karma, Jasmine |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/omargallo/AirbnbFrontend.git
cd AirbnbFrontend
npm install --legacy-peer-deps
```

### 2. Run Locally
```bash
npm start
# opens http://localhost:4200/
```

### 3. Build Production Bundle
```bash
npm run build
# output: dist/AirbnbFrontend/
```

---

## 📂 Project Layout

```
src/
├── app/
│   ├── components/        # Reusable UI components (calendar, chatbot, filters)
│   ├── core/              # Services, guards, interceptors, models
│   ├── layout/            # Main, host, dashboard layouts
│   ├── pages/             # Route-level features (home, booking, profile, etc.)
│   └── shared/            # Shared components, directives, pipes
├── assets/
│   ├── i18n/              # Translation files (en.json, ar.json)
│   └── images/            # Static imagery and icons
└── environments/          # Environment configs
```

---

## 🧪 Testing

```bash
npm test              # Run Karma unit tests
ng test --watch       # Watch mode
ng test --code-coverage
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing`
5. Open a pull request ✨

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙌 Author

**Omar Gallo**  
GitHub: [@omargallo](https://github.com/omargallo)

> ⭐ If this project helps you, please consider giving it a star!
