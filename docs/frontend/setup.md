# Setup Guide

## Requirements

| Tool | Version |
|---|---|
| Node.js | >= 18.x |
| Package Manager | `pnpm` (recommended) or `npm` |

> This project uses `pnpm-workspace.yaml`, so **pnpm is the preferred package manager**.

---

## Installation

Clone the repository and install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for all API requests (appended to Axios instance) |
| `VITE_BACKEND_URL` | Backend origin URL (used for file/media assets) |

> **Note:** Vite only exposes variables prefixed with `VITE_` to the client at build time.

---

## Running the Development Server

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

The app will start on `http://localhost:5173` by default.

---

## Building for Production

```bash
# Using pnpm
pnpm build

# Using npm
npm run build
```

The build output will be placed in the `dist/` directory.

---

## Lint

```bash
pnpm lint
# or
npm run lint
```
