// Script to fix the FunWala Telegram Bot image URL
const projectId = "1756401054698";
const newImageUrl = "https://cdn.jsdelivr.net/gh/sauravtechno/main-d@main/assets/test/gen.webp";

async function fixTelegramBotImage() {
  try {
    // First, get the current project data
    const getResponse = await fetch(`http://localhost:3000/api/admin/projects/${projectId}`);
    
    if (!getResponse.ok) {
      throw new Error(`Failed to fetch project: ${getResponse.statusText}`);
    }
    
    const project = await getResponse.json();
    console.log('Current project data:', project);
    
    // Update only the image URL
    const updateData = {
      ...project,
      img: newImageUrl
    };
    
    // Remove MongoDB-specific fields that shouldn't be in the update
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    console.log('Updating with:', updateData);
    
    // Update the project
    const updateResponse = await fetch(`http://localhost:3000/api/admin/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Failed to update project: ${updateResponse.statusText}`);
    }
    
    const result = await updateResponse.json();
    console.log('Update result:', result);
    console.log('✅ Successfully updated FunWala Telegram Bot image URL!');
    
  } catch (error) {
    console.error('❌ Error fixing image URL:', error);
  }
}

// Run the fix
fixTelegramBotImage();