

### **Backend Folder:**
```
backend/
   ├── src/                     (All TypeScript source code)
   │   ├── config/
   │   │   ├── passport.ts      (Google OAuth config)
   │   │   ├── redis.ts         (Redis connection)
   │   │   └── email.ts         (SMTP config)
   │   ├── controllers/
   │   │   └── emailController.ts (API logic)
   │   ├── middleware/
   │   │   └── auth.ts          (Authentication)
   │   ├── routes/
   │   │   ├── auth.ts          (Auth endpoints)
   │   │   └── email.ts         (Email endpoints)
   │   ├── services/
   │   │   ├── emailScheduler.ts (BullMQ jobs)
   │   │   └── rateLimiter.ts   (Rate limiting)
   │   ├── workers/
   │   │   └── emailWorker.ts   (Background worker)
   │   └── index.ts             (Main server)
   ├── prisma/
   │   └── schema.prisma        (Database schema)
   ├── node_modules/            (Dependencies - KEEP!)
   ├── package.json             (Dependencies list)
   ├── package-lock.json        (Lock file)
   ├── tsconfig.json            (TypeScript config)
   └── .env.example             (Environment template)
```

### **Frontend Folder:**
```
frontend/
   ├── src/
   │   ├── app/
   │   │   ├── page.tsx         (Main page)
   │   │   ├── layout.tsx       (Root layout)
   │   │   ├── providers.tsx    (React Query)
   │   │   └── globals.css      (Styles)
   │   ├── components/
   │   │   ├── Dashboard.tsx    (Main dashboard)
   │   │   ├── LoginPage.tsx    (Google login)
   │   │   ├── ComposeModal.tsx (Email form)
   │   │   └── EmailTable.tsx   (Email lists)
   │   ├── lib/
   │   │   └── api.ts           (Axios config)
   │   └── types/
   │       └── index.ts         (TypeScript types)
   ├── node_modules/            (Dependencies - KEEP!)
   ├── package.json             (Dependencies list)
   ├── package-lock.json        (Lock file)
   ├── tsconfig.json            (TypeScript config)
   ├── tailwind.config.ts       (Tailwind config)
   ├── postcss.config.js        (PostCSS config)
   ├── next.config.js           (Next.js config)
   └── .env.local.example       (Environment template)
