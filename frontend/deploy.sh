#!/bin/bash
echo "Deploying to GitHub..."
git add .
git commit -m "frissítés - $(date '+%Y-%m-%d %H:%M')"
git push origin main
echo "Done! Vercel is now deploying the changes."
