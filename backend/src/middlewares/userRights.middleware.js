// Middleware to check if the user has admin role
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User has admin role, allow access
  } else {
    res.status(403).send('Forbidden'); // User doesn't have admin role, deny access
  }
};

// Middleware to check if the user has lead manager role
export const isLeadManager = (req, res, next) => {
  if (req.user && req.user.role === 'lead manager') {
    next(); // User has lead manager role, allow access
  } else {
    res.status(403).send('Forbidden'); // User doesn't have lead manager role, deny access
  }
};

// Example routes with role-based access

// // Admin can view and edit all data
// app.get('/leads', isAdmin, (req, res) => {
//   // Code to retrieve and display all leads
//   res.send('Displaying all leads');
// });

// app.put('/leads/:id', isAdmin, (req, res) => {
//   // Code to update a lead
//   res.send('Lead updated successfully');
// });

// // Lead manager can view and edit assigned leads only
// app.get('/my-leads', isLeadManager, (req, res) => {
//   // Code to retrieve and display leads assigned to the lead manager
//   res.send('Displaying leads assigned to the lead manager');
// });

// app.put('/my-leads/:id', isLeadManager, (req, res) => {
//   // Code to update an assigned lead
//   res.send('Assigned lead updated successfully');
// });

// // Example authentication middleware (assumes user object is stored in req.user after authentication)
// const authenticateUser = (req, res, next) => {
//   // Perform user authentication, e.g., using Passport.js or JWT
//   // Store user object with role in req.user
//   req.user = {
//     id: 123,
//     role: 'admin' // Replace with actual role assigned to the user
//   };
//   next();
// };