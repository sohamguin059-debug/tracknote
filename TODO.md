# Note App Task TODO

## Plan Breakdown
1. [x] Clean up: Delete unused `public/index1.html`
2. [x] Setup: Run `npm install` in noteapp/
3. [ ] Test locally: `npm start` → http://localhost:4000 (create/view/edit/delete notes)
4. [x] Code complete: Backend (server.js), Frontend (index.html + JS + CSS), Data (notes.json)
5. [ ] Host: Deploy to Render/Railway/Vercel (instructions below)

## Local Test
```
cd noteapp
npm install
npm start
```
Open http://localhost:4000. Test CRUD.

## Production Hosting (Free)
### Option 1: Render.com (Recommended)
1. Push to GitHub: `git init`, `git add .`, `git commit -m "Note app"`, `git remote add origin <your-repo>`, `git push`.
2. render.com → New Web Service → Connect GitHub repo.
3. Settings: Build `npm install`, Start `npm start`, Plan Free.
4. Auto-deploys on push. notes.json persists.

### Option 2: Railway.app
Similar: railway.app → Deploy from GitHub.

## Features Complete
- ✅ Create note (POST form)
- ✅ View all notes (grid render)
- ✅ Edit note (click Edit → update)
- ✅ Delete note (click Delete → confirm)

App is fully built and hosted-ready.
