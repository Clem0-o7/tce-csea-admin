import { validateEventData } from '@/utils/validate-event'; 
import { validatePersonData } from '@/utils/validate-person'; 


export function withEventValidation(handler) {
  return async (req, res) => {
    if (['POST', 'PUT'].includes(req.method)) {
      const { isValid, errors } = validateEventData(req.body);
      
      if (!isValid) {
        return res.status(400).json({ 
          error: 'Invalid event data', 
          details: errors 
        });
      }
    }
    
    return handler(req, res);
  };
}


export function withValidation(validateFn, handler) {
  return async (req, res) => {
    // Check if the request method requires validation
    if (['POST', 'PUT'].includes(req.method)) {
      const { isValid, errors } = validateFn(req.body);
      
      if (!isValid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
      }
    }
    
    // Proceed to the handler if validation passes
    return handler(req, res);
  };
}

// Add new logic to handle specific validation needs for event winners


// Add another middleware for person validation (if needed for winner creation or other tasks)
export function withPersonValidation(handler) {
  return async (req, res) => {
    if (['POST', 'PUT'].includes(req.method)) {
      const { isValid, errors } = validatePersonData(req.body); // validate person data
      
      if (!isValid) {
        return res.status(400).json({
          error: 'Invalid person data',
          details: errors,
        });
      }
    }
    
    return handler(req, res);
  };
}
