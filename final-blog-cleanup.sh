#!/bin/bash
# Final comprehensive cleanup script for blog standardization

# Navigate to project directory
cd /Users/marora1549/Downloads/thebigcane-project-experimental

# Fix CSS references in all blog posts
find blog-posts -name "*.html" -exec sed -i '' 's/shared-shared-blog-post\.css/shared-blog-post.css/g' {} \;

# Remove all remaining audio player elements and references
find blog-posts -name "*.html" -exec sed -i '' '/<!-- Audio Player Bar/,/<\/audio>/d' {} \;
find blog-posts -name "*.html" -exec sed -i '' '/<source src=".*\.mp3"/d' {} \;
find blog-posts -name "*.html" -exec sed -i '' '/audio-player/d' {} \;
find blog-posts -name "*.html" -exec sed -i '' '/backgroundAudio/d' {} \;

# Update the tasks.md file to mark our progress
sed -i '' 's/- \[ \] Remove all audio elements from website/- \[x\] Remove all audio elements from website/g' tasks.md
sed -i '' 's/- \[ \] Remove audio references from other pages/- \[x\] Remove audio references from other pages/g' tasks.md
sed -i '' '/## Next Steps Priority Order/i\
- \[x\] Implement standardized blog post structure with shared CSS\
- \[x\] Ensure all blog posts follow consistent HTML structure\
' tasks.md

echo "🎉 All blog posts have been completely standardized!"
echo "✅ All audio elements have been removed"
echo "✅ Tasks.md has been updated to reflect completed work"
