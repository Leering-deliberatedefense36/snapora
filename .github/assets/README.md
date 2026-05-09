# Repo assets

Drop the following files here so the README and GitHub repo render properly:

| File                    | Purpose                                                             | Recommended size          |
| ----------------------- | ------------------------------------------------------------------- | ------------------------- |
| `logo.png`              | App logo for the README header                                      | 256×256 (transparent PNG) |
| `banner.png`            | OG / social-preview image (Settings → Social preview)               | 1280×640                  |
| `demo.gif`              | Hero animation in the README — single most important file for stars | 800×~500, ≤5 MB           |
| `screenshot-editor.png` | Editor screenshot used in the Features section                      | 1600×1000                 |
| `screenshot-tray.png`   | Tray menu screenshot                                                | 600×400                   |

Tips:

- Generate `demo.gif` with [Gifski](https://gif.ski) or `ffmpeg -i source.mov -vf "fps=15,scale=800:-1" demo.gif`.
- Compress PNGs with `pngquant` or [tinypng.com` before committing.
- `banner.png` is what shows up in Slack / Twitter / Discord previews of the GitHub repo. Set it under **Repo Settings → General → Social preview**.
