# Submission Guide



### Required Files & Folders:

```
reachinbox-scheduler/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── passport.ts
│   │   │   ├── redis.ts
│   │   │   └── email.ts
│   │   ├── controllers/
│   │   │   └── emailController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── email.ts
│   │   ├── services/
│   │   │   ├── emailScheduler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── workers/
│   │   │   └── emailWorker.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── providers.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ComposeModal.tsx
│   │   │   └── EmailTable.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next.config.js
│   └── .env.local.example
│
├── docker-compose.yml
├── .gitignore
└── README.md



## Submission Checklist:

- [ ] All source code files included
- [ ] README.md with setup instructions
- [ ] package.json files (both backend & frontend)
- [ ] docker-compose.yml
- [ ] Prisma schema
- [ ] TypeScript config files
- [ ] .env.example files (NOT .env)
- [ ] .gitignore file
- [ ] NO node_modules folders
- [ ] NO .env files with secrets
- [ ] NO build/dist folders

---
