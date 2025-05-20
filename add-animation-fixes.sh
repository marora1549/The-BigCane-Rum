#!/bin/bash

# Add animation-fixes.css to all HTML files
# This script adds the animation-fixes.css reference to all HTML files in the project

echo "Adding animation-fixes.css to all HTML files..."

# Find all HTML files excluding node_modules
find /Users/marora1549/Downloads/thebigcane-project-experimental -name "*.html" | grep -v node_modules | while read file; do
    # Check if the file doesn't already include animation-fixes.css
    if ! grep -q "animation-fixes.css" "$file"; then
        # Find the right place to insert the link (after responsive-fixes.css or before </head>)
        if grep -q "responsive-fixes.css" "$file"; then
            # Insert after responsive-fixes.css
            sed -i '' 's|responsive-fixes.css"></noscript>|responsive-fixes.css"></noscript>\n    <!-- Global animation fixes -->\n    <link rel="stylesheet" href="/css/components/animation-fixes.css">|g' "$file"
        else
            # Insert before </head>
            sed -i '' 's|</head>|    <!-- Global animation fixes -->\n    <link rel="stylesheet" href="/css/components/animation-fixes.css">\n</head>|g' "$file"
        fi
        echo "Updated: $file"
    else
        echo "Already updated: $file"
    fi
done

echo "Done!"
