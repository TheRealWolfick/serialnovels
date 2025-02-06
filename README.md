# serialnovels

To install dependencies:

```bash
bun install
```

To run the server (will reload on refresh):

```bash
bun run start
```

To run the server with live reload:

```bash
bun run dev
```

If css needs to be updated, you can run either:

1. For a one off build
```bash
bun run build:css
```

2. For live reloading of css updates (run alongside live reload dev server)
```bash
bun run dev:tailwind
```

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
