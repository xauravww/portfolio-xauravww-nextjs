#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script converts project images to WebP format for better performance.
 * Run with: node scripts/optimize-images.js
 * 
 * Requirements: Install sharp package
 * npm install sharp --save-dev
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

async function optimizeImages() {
  try {
    // Try to import sharp, if not available, provide instructions
    let sharp;
    try {
      sharp = require('sharp');
    } catch (error) {
      console.log('📦 Sharp not found. Install it with:');
      console.log('npm install sharp --save-dev');
      console.log('\nThen run this script again to optimize your images.');
      return;
    }

    const projectsDir = join(process.cwd(), 'public', 'assets', 'projects');
    
    if (!existsSync(projectsDir)) {
      console.log('❌ Projects directory not found:', projectsDir);
      return;
    }

    const files = readdirSync(projectsDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log('✅ No images to optimize found in projects directory');
      return;
    }

    console.log(`🚀 Found ${imageFiles.length} images to optimize...`);

    for (const file of imageFiles) {
      const inputPath = join(projectsDir, file);
      const outputPath = join(projectsDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      
      try {
        await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);
        
        const inputStats = statSync(inputPath);
        const outputStats = statSync(outputPath);
        const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
        
        console.log(`✅ ${file} → ${basename(outputPath)} (${savings}% smaller)`);
      } catch (error) {
        console.log(`❌ Failed to optimize ${file}:`, error.message);
      }
    }

    console.log('\n🎉 Image optimization complete!');
    console.log('\n💡 Tips:');
    console.log('- Update your project data to use .webp extensions');
    console.log('- Keep original files as fallbacks');
    console.log('- Consider using Next.js Image component for automatic optimization');

  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Run the optimization
optimizeImages();