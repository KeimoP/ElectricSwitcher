
#!/bin/bash
# GitHub Pages deployment script

# Install dependencies if needed
npm install

# Build static version
npm run build:static

# Create a .nojekyll file to prevent Jekyll processing
touch dist/.nojekyll

# Create a simple README for the GitHub Pages branch
echo "# Static Build for GitHub Pages

This branch contains the static build of the application for GitHub Pages deployment.
The main application code is in the main branch.
" > dist/README.md

echo "Static build for GitHub Pages completed successfully!"
echo "The build output is in the 'dist' directory."
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Create a gh-pages branch in your repository"
echo "2. Copy the contents of the 'dist' directory to that branch"
echo "3. Push the gh-pages branch to GitHub"
echo ""
echo "Alternatively, you can use gh-pages npm package or GitHub Actions for deployment."
