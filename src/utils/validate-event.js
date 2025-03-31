// utils/validate-event.js
export function validateEventData(data) {
    const errors = [];
  
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Event name is required');
    }
  
    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string');
    }
  
    if (data.date && isNaN(new Date(data.date).getTime())) {
      errors.push('Invalid date format');
    }
  
    if (data.status && !['upcoming', 'ongoing', 'completed'].includes(data.status)) {
      errors.push('Invalid status value');
    }
  
    if (data.teamSizeMin && (isNaN(data.teamSizeMin) || data.teamSizeMin < 1)) {
      errors.push('Minimum team size must be a positive number');
    }
  
    if (data.teamSizeMax && (isNaN(data.teamSizeMax) || data.teamSizeMax < data.teamSizeMin)) {
      errors.push('Maximum team size must be greater than or equal to minimum team size');
    }
  
    if (data.in_carousal && typeof data.in_carousal !== 'boolean') {
      errors.push('in_carousal must be a boolean value');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  }