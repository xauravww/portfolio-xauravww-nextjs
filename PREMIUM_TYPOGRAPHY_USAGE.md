# Premium Typography Usage Guide

## Quick Start - Using Tailwind Classes

Since you're using Next.js with Tailwind, here are the simple classes you can use:

### Font Classes
```jsx
// Headlines and hero sections
<h1 className="font-serif text-4xl md:text-6xl font-bold">Your Title</h1>

// Section headings
<h2 className="font-sans text-2xl md:text-4xl font-semibold">Section Title</h2>

// Body text
<p className="font-sans text-base leading-relaxed">Your content here</p>

// Small text
<span className="font-sans text-sm">Small text</span>
```

### Premium Effects
```jsx
// Gradient text
<h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
  Premium Gradient Text
</h1>

// Text with shadow
<h2 className="font-sans text-2xl font-semibold text-shadow">
  Text with Shadow
</h2>
```

## Available Font Variables
- `font-sans` → Inter (for UI and headings)
- `font-serif` → Playfair Display (for elegant headlines)
- `font-mono` → System monospace (for code)

## Examples by Component Type

### Hero Section
```jsx
<div className="text-center">
  <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4">
    Welcome to My Portfolio
  </h1>
  <p className="font-sans text-xl md:text-2xl text-gray-600">
    Full Stack Developer & Designer
  </p>
</div>
```

### Project Cards
```jsx
<div className="bg-white rounded-lg p-6">
  <h3 className="font-sans text-xl font-semibold mb-2">Project Name</h3>
  <p className="font-sans text-gray-600">Project description...</p>
</div>
```

### Navigation
```jsx
<nav className="font-sans font-medium">
  <a href="#about" className="hover:text-blue-600">About</a>
  <a href="#projects" className="hover:text-blue-600">Projects</a>
</nav>
```

## No Additional Setup Required
The fonts are now automatically loaded and optimized by Next.js. Just use the Tailwind classes above in your components!
