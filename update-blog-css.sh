#!/bin/bash
# Script to update blog post CSS references and remove audio elements

# Navigate to blog posts directory
cd blog-posts

# Update CSS reference in all HTML files
for file in *.html; do
  # Replace blog-post.css with shared-blog-post.css
  sed -i '' 's/blog-post\.css/shared-blog-post.css/g' "$file"
  
  # Remove audio player elements
  sed -i '' '/<div class="audio-player/,/<\/div>/d' "$file"
  
  # Remove audio player script references
  sed -i '' '/<script.*audio-player\.js.*>/d' "$file"
  
  echo "Updated $file"
done

echo "All blog posts updated successfully!"
