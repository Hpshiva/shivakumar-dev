import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    {
      name: 'serve-root-images',
      configureServer(server) {
        server.middlewares.use('/images', (req, res, next) => {
          const filePath = path.join(__dirname, 'images', req.url.split('?')[0]);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.png') contentType = 'image/png';
            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
            else if (ext === '.svg') contentType = 'image/svg+xml';
            else if (ext === '.avif') contentType = 'image/avif';
            res.setHeader('Content-Type', contentType);
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
      closeBundle() {
        const copyRecursive = (src, dest) => {
          if (fs.statSync(src).isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(child => copyRecursive(path.join(src, child), path.join(dest, child)));
          } else {
            fs.copyFileSync(src, dest);
          }
        };
        const srcDir = path.resolve(__dirname, 'images');
        const destDir = path.resolve(__dirname, 'dist/images');
        if (fs.existsSync(srcDir)) {
          copyRecursive(srcDir, destDir);
          console.log('Copied root images/ to dist/images/');
        }
      }
    }
  ]
})
