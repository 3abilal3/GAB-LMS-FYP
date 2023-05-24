// workingRightsMiddleware.js

function workingRightsMiddleware(req, res, next) {
  // Get the user's designation from the authentication data (e.g., req.user.designation)
  const userDesignation = req.user.designation;

  // Set the working rights based on the user's designation
  if (userDesignation === 'Manager') {
    req.workingRights = {
      editLeads: true,
      assignLeads: true,
      viewAllLeads: true
    };
  } else if (userDesignation === 'LeadManager') {
    req.workingRights = {
      editLeads: false,
      assignLeads: false,
      viewAllLeads: false
    };
  }

  next();
}

module.exports = workingRightsMiddleware;
