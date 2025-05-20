#!/bin/bash
# Final cleanup script for blog post standardization

# Navigate to blog posts directory
cd /Users/marora1549/Downloads/thebigcane-project-experimental/blog-posts

# Fix doubled shared-shared-blog-post.css references
for file in *.html; do
  echo "Final cleanup for $file..."
  
  # Fix CSS reference
  sed -i '' 's/shared-shared-blog-post\.css/shared-blog-post.css/g' "$file"
  
  # Remove any remaining audio player sections and broken HTML
  sed -i '' '/<!-- Audio Player Bar/,/audio id="backgroundAudio"/d' "$file"
  sed -i '' '/audio-player__toggle/d' "$file"
  sed -i '' '/button class="audio-player/d' "$file"
  sed -i '' '/<\/audio>/d' "$file"
  
  # Clean up any excessive empty divs or broken tags
  sed -i '' 's/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/<\/div>/g' "$file"
  
  echo "✅ $file cleaned up"
done

echo "🎉 Final cleanup complete!"
