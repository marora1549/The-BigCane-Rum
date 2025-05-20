#!/bin/bash
# Script to standardize blog post structure and fix HTML issues

# Navigate to blog posts directory
cd blog-posts

# For each blog post HTML file
for file in *.html; do
  echo "Processing $file..."
  
  # 1. Replace blog-post.css with shared-blog-post.css
  sed -i '' 's/blog-post\.css/shared-blog-post.css/g' "$file"
  
  # 2. Add SEO meta tags if missing
  if ! grep -q 'property="og:title"' "$file"; then
    title=$(grep -o '<title>.*</title>' "$file" | sed 's/<title>\(.*\)<\/title>/\1/')
    description=$(grep -o '<meta name="description" content=".*">' "$file" | sed 's/.*content="\(.*\)".*/\1/')
    
    # Insert SEO meta tags before the closing </head>
    sed -i '' '/<\/head>/i \
    <!-- SEO Meta Tags --> \
    <meta property="og:title" content="'"$title"'"> \
    <meta property="og:description" content="'"$description"'"> \
    <meta property="og:image" content="../assets/images/blog1-placeholder.jpg"> \
    <meta property="og:url" content="https://thebigcane.com/blog-posts/'"${file%.*}"'.html"> \
    <meta name="twitter:card" content="summary_large_image">' "$file"
  fi
  
  # 3. Remove all audio player elements and references
  # First, remove the audio player section
  sed -i '' '/<div class="audio-player/,/<\/div>/d' "$file"
  
  # Remove audio player script references
  sed -i '' '/audio-player\.js/d' "$file"
  
  # 4. Clean up any broken HTML structure (empty divs or broken tags)
  sed -i '' '/<div>\s*<\/div>/d' "$file"
  sed -i '' '/<div>\s*$/d' "$file"
  sed -i '' '/^\s*<\/div>/d' "$file"
  
  echo "✅ Completed processing $file"
done

echo "🎉 All blog posts have been standardized!"
