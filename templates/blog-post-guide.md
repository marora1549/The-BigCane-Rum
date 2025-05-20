# The BigCane Blog Post Style and Structure Guide

## Overview
This guide ensures all blog posts maintain a consistent style, structure, and design across The BigCane website. Following these guidelines will create a cohesive experience for users and simplify maintenance for developers.

## File Structure
All blog posts should:
- Be stored in the `/blog-posts/` directory
- Use kebab-case for filenames (e.g., `caribbean-cocktail-culture.html`)
- Use the shared CSS files (no individual CSS per blog post)

## Template Usage
1. Copy the template from `/templates/blog-post-template.html`
2. Replace all placeholder tags (marked with [BRACKETS])
3. Add your content to the main content section
4. Test the blog post for responsiveness and functionality

## Required Placeholder Replacements

### Head Section
- `[BLOG_TITLE]` - Full title of the blog post
- `[BLOG_DESCRIPTION]` - SEO-friendly description (150-160 characters)
- `[BLOG_IMAGE]` - Featured image filename (used in og:image)
- `[BLOG_URL]` - The URL-friendly version of the title (matches the HTML filename)

### Header Section
- `[BLOG_TITLE_SHORT]` - Shorter version of the title for breadcrumbs
- `[BLOG_CATEGORY]` - Category name (Mixology, Nightlife, Travel, or Culture)
- `[AUTHOR_NAME]` - Full name of the author
- `[AUTHOR_IMAGE]` - Author profile image filename
- `[PUBLISH_DATE]` - Publication date in format "Month DD, YYYY"
- `[READ_TIME]` - Estimated read time in minutes
- `[VIEW_COUNT]` - View count (can be placeholder for new posts)
- `[COMMENT_COUNT]` - Comment count (can be placeholder for new posts)

### Content Section
- `[BLOG_IMAGE_ALT]` - Alt text for featured image
- `[BLOG_INTRO_PARAGRAPH]` - Compelling introduction paragraph

### Sidebar Section
- `[AUTHOR_SHORT_BIO]` - Brief author description (1-2 sentences)
- `[AUTHOR_ARTICLE_COUNT]` - Number of articles by this author
- `[AUTHOR_COUNTRIES_COUNT]` - Number of countries the author has covered
- Add popular and related posts with their respective placeholders
- `[FEATURED_PRODUCT_IMAGE]` - Featured product image
- `[FEATURED_PRODUCT_TITLE]` - Featured product name
- `[FEATURED_PRODUCT_DESCRIPTION]` - Short product description
- `[FEATURED_PRODUCT_RATING]` - Product rating (e.g., "4.5")

## HTML Structure Guidelines

### Main Content
Maintain this hierarchy:
1. Intro paragraph (use class `blog-post-intro`)
2. Main headings (use `<h2>` tags)
3. Subheadings (use `<h3>` tags)
4. Paragraphs (use `<p>` tags)
5. Lists (use `<ul>` or `<ol>` as appropriate)

### Special Elements
- **Blockquotes**: Use for testimonials or important quotes
  ```html
  <blockquote>
      "Quote text goes here."
      <cite>- Attribution</cite>
  </blockquote>
  ```

- **Image Grids**: Use for displaying multiple images
  ```html
  <div class="blog-post-image-grid reveal-from-bottom" data-delay="0.3">
      <div class="blog-post-grid-image">
          <img src="../assets/images/image1.jpg" alt="Description">
          <span>Caption</span>
      </div>
      <div class="blog-post-grid-image">
          <img src="../assets/images/image2.jpg" alt="Description">
          <span>Caption</span>
      </div>
  </div>
  ```

- **Highlight Boxes**: Use for key information or lists
  ```html
  <div class="blog-post-highlight-box">
      <h3>Title</h3>
      <ul>
          <li><strong>Item 1</strong> - Description</li>
          <li><strong>Item 2</strong> - Description</li>
      </ul>
  </div>
  ```

- **Call-to-Action Boxes**: Use for promoting products
  ```html
  <div class="blog-post-cta reveal-from-bottom" data-delay="0.4">
      <h3>Title</h3>
      <p>Description</p>
      <a href="../link.html" class="button glow-pulse">Button Text</a>
  </div>
  ```

## Content Guidelines

### Writing Style
- Maintain an energetic, enthusiastic tone aligned with The BigCane brand
- Use second-person perspective ("you") to directly engage readers
- Keep paragraphs short (3-5 sentences maximum)
- Include subheadings every 2-3 paragraphs for scanability

### SEO Best Practices
- Include the target keyword in the title, meta description, URL, and first paragraph
- Use related keywords naturally throughout the content
- Add alt text to all images
- Link to other relevant blog posts and product pages
- Aim for at least 1000 words for comprehensive articles

### Images
- Ensure all images are high-quality and properly sized
- Store all blog images in `/assets/images/`
- Use descriptive filenames
- Always include alt text for accessibility

## Animation and Interactive Elements
The template includes built-in animations:
- `reveal-from-bottom` - Elements fade in and move up as they enter the viewport
- `reveal-from-right` - Elements fade in and move left as they enter the viewport

Add a `data-delay` attribute to stagger animations:
```html
<element class="reveal-from-bottom" data-delay="0.2">Content</element>
```

## Testing Checklist
Before publishing, verify:
- All placeholder tags have been replaced
- All links work correctly
- Images display properly
- Content displays correctly on mobile devices
- No spelling or grammar errors
- SEO elements are in place
- Animations function properly

## Examples
Refer to the following blog posts as examples of proper implementation:
- "Caribbean Nightlife Guide" (`caribbean-nightlife-guide.html`)
- "Caribbean Cocktail Culture" (`caribbean-cocktail-culture.html`)
- "The Art of Distillation" (`art-of-distillation.html`)
