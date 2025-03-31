export function validatePersonData(data) {
    const errors = [];
    let isValid = true;
  
    // Validate name: required and not empty
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name is required and should be a valid string.');
      isValid = false;
    }
  
    // Validate registerNumber: required, alphanumeric and of length 10 (example condition)
    if (!data.registerNumber || typeof data.registerNumber !== 'string' || !/^[A-Za-z0-9]{10}$/.test(data.registerNumber)) {
      errors.push('Register Number is required and should be alphanumeric with a length of 10 characters.');
      isValid = false;
    }
  
    // Validate batch: required and should be a string (example condition)
    if (!data.batch || typeof data.batch !== 'string' || data.batch.trim() === '') {
      errors.push('Batch is required and should be a valid string.');
      isValid = false;
    }
  
    // Validate totalEventPoints: required and should be a number
    if (data.totalEventPoints === undefined || typeof data.totalEventPoints !== 'number') {
      errors.push('Total Event Points is required and should be a valid number.');
      isValid = false;
    }
  
    // Validate email (optional example, adjust to your schema)
    if (data.email && (!/\S+@\S+\.\S+/.test(data.email))) {
      errors.push('Email should be in a valid format.');
      isValid = false;
    }
  
    // Return the validation result and errors
    return { isValid, errors };
  }
  