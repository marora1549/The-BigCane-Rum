#!/bin/bash
# Image Asset Creation Helper Script
# This script helps create some of the missing icon assets for The Big Cane Rum website
# Requires: ImageMagick (convert) and optipng

echo "=== The Big Cane Rum - Image Asset Creation Helper ==="
echo "This script will create basic icon images for the cocktail finder page."
echo "Note: These are placeholder icons that should be replaced with professional assets before production."
echo ""

# Create directory for the new icons if it doesn't exist
ICON_DIR="./assets/images/icons"
mkdir -p $ICON_DIR

# Function to create a basic spirit icon
create_spirit_icon() {
    local name=$1
    local color=$2
    local highlight=$3
    local output_file="${ICON_DIR}/${name}-icon.png"
    
    echo "Creating ${name} icon with ${color} base color..."
    
    # Create a 50x50px transparent background
    convert -size 50x50 xc:transparent \
    \( -size 40x40 radial-gradient:${highlight}-${color} -gravity center \) -compose over -composite \
    \( -size 20x30 -background transparent -fill white -gravity center -density 144 \
       label:"BC" -trim +repage \) -gravity center -geometry +0+0 -compose over -composite \
    $output_file
    
    # Optimize the PNG
    if command -v optipng &> /dev/null; then
        optipng -quiet $output_file
    fi
    
    echo "Created: $output_file"
}

# Create the four spirit icons with different colors
create_spirit_icon "silver-rum" "rgba(200,200,220,0.8)" "rgba(240,240,255,0.9)"
create_spirit_icon "spiced-rum" "rgba(180,120,60,0.8)" "rgba(220,180,100,0.9)"
create_spirit_icon "guava-rum" "rgba(220,100,130,0.8)" "rgba(240,150,170,0.9)"
create_spirit_icon "gin" "rgba(100,180,200,0.8)" "rgba(150,220,240,0.9)"

# Copy the icons to the main images directory for immediate use
echo "Copying icons to main images directory..."
cp $ICON_DIR/*.png ./assets/images/

echo ""
echo "=== Icon creation complete ==="
echo "Basic spirit icons have been created in: $ICON_DIR"
echo "These icons have also been copied to assets/images/ for immediate use."
echo ""
echo "IMPORTANT: These are programmatically generated placeholders."
echo "For production, replace with professional icon designs according to image-specifications.md."
