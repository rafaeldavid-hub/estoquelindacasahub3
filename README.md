# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

## Design tokens & layout

This project follows a strict 8‑pixel grid for spacing and layout.  The Tailwind
configuration has been adjusted so that `1` unit of spacing (`p-1`, `m-1`,
`gap-1`, etc.) equals **0.5 rem (8 px)**, with larger values scaling linearly.  As
a result, all existing spacing utilities should now align to the 8 px baseline.

Border radius is standardized at **12 px** across components; the CSS variable
`--radius` (used by the theme for `rounded-lg` and friends) has been updated to
`0.75rem`.  Finally, box‑shadow values are fixed in the Tailwind config to a
small, medium, large and so on set of predefined, non‑changing shadows.

These rules give the UI consistent rhythms and make it easier to create new
layouts and components that automatically follow the design system.

### Typography

### Dynamic background image

A global CSS variable `--background-url` is used to control the background of
the main content wrapper.  At build time the variable is populated from an
environment value named **VITE_BACKGROUND_URL** (string containing the image
URL).

By default the `AppLayout` component will read that value and apply
`background-image: url(...)` with `background-size: cover` and
`background-position: center`.  You can configure it via your `.env` file or
through Vercel/Lovable environment settings.

Example `.env` file for light/dark backgrounds:

```
VITE_BACKGROUND_URL_LIGHT=https://i.ibb.co/3Yh6ZpBJ/5226644.jpg
VITE_BACKGROUND_URL_DARK=https://example.com/dark-bg.jpg
```

(The legacy `VITE_BACKGROUND_URL` still maps to the light image.)

Header and footer remain glasmorphic panels that float above the background.

When the user toggles light/dark mode, the image will softly cross‑fade
thanks to a small transition applied to the main container.

### Typography

The application now uses the operating system’s native font stack. On macOS
and iOS this resolves to **San Francisco Pro** (SF Pro Text/Display); other
environments fall back to Helvetica/Arial/sans-serif.  You should not need to
fetch or bundle any external font files.

### Glass‑style cards

Based on the screenshot you provided, we also expose a pair of helpers for
creating the “glassmorphic” card look:

- `glass-card` – applies the dark‑mode background, 10px blur, 1px border,
  18px radius and fixed shadow.
- `.light .glass-card` – light mode overrides for higher background opacity and
  a darker border.
- `glass-card-gradient` – optional gradient overlay (linear 145° white at very
  low opacity) for a subtle premium effect.

The card radius is intentionally larger than the global 12px base; this keeps
regular buttons/forms snug while giving content panels more breathing room.


This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Deploy no Vercel com Credenciais

Para fazer deploy automático no Vercel em tempo real com alterações, siga os passos:

### 1. Obtenha seu token do Vercel

1. Acesse [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique em "Create Token" e defina um nome e um tempo de expiração (ex: 7 dias)
3. Copie o token gerado (você não poderá visualizá-lo novamente depois)

### 2. Encontre o ID do seu projeto

1. Acesse [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto e vá para Settings
3. Copie o "Project ID" e o "Org ID" (se aplicável)

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as credenciais:

```bash
VERCEL_TOKEN=seu_token_aqui
VERCEL_PROJECT_ID=seu_project_id_aqui
VERCEL_ORG_ID=seu_org_id_aqui
```

### 4. Faça o deploy

Para fazer deploy em staging:
```bash
npm run deploy
```

Para fazer deploy em produção:
```bash
npm run deploy:prod
```

**Nota:** O arquivo `.env.local` é ignorado pelo git (veja `.gitignore`), portanto suas credenciais não serão expostas.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
