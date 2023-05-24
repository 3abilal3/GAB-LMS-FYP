const express = require("express");
const { userAuthorization } = require("../middlewares/auth.middleware");
const {
  createNewLeadValidation,
  replyLeadMessageValidation,
} = require("../middlewares/formValidation.middleware");
const {
  insertLeads,
  getLeads,
  getLeadsById,
  deleteLead,
  updateClientReply,
  updateStatusClose,
  generateLeadsReport,
  saveStaffInfo,
  insertStaff,
  insertCust,
  insertCat,
} = require("../model/leads/leads.model");



const { LeadsSchema } = require("../model/leads/leads.schema");
const { LeadCategorySchema } = require("../model/leads/category.Schema");
const mongoose = require("mongoose");
const {
  isAdmin,
  isLeadManager,
} = require("../middlewares/userRights.middleware");
const { StaffSchema } = require("../model/leads/Staff.schema");
const multer = require("multer");
const path = require("path");
const leadinfoSchema = require("../model/leads/leadinfo.Schema");
const leadManger = require("../model/leads/LeadManger");

const { UserSchema } = require("../model/user/User.schema");

const router = express.Router();

//for attaching file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

//create company endpoint

router.post("/", userAuthorization, async (req, res) => {
  try {
    //receive new ticket data
    const {
      leadName,
      sender,
      subject,
      wealth,
      experience,
      currentBusinesses,
      mostPreferedBusinesses,
      source,
      assignedTo,
      message,
    } = req.body;

    const userId = req.userId;
    const assignedToId = mongoose.Types.ObjectId(assignedTo);

    const leadsObj = {
      clientId: userId,
      leadName,
      sender,
      subject,
      wealth,
      experience,
      currentBusinesses,
      mostPreferedBusinesses,
      assignedTo: assignedToId,
      message,
      source,
      conservation: [
        {
          sender,
          message,
        },
      ],
    };
    const result = await insertLeads(leadsObj);
    // console.log(result)
    //insert in mongodb

    if (result._id) {
      return res.json({
        status: "success",
        message: "new lead have been created",
      });
    }

    res.json({
      status: "error",
      message: "Unable to create ticket please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});



//customer info
router.post("/CustomerInfo", userAuthorization, async (req, res) => {
  try {
    //new customer info
    const {
      CompanyName,
      Telephone,
      email,
      website,
      contactPersonName,
      contactPersonMobileNumber,
      contactPersonEmail,
      otherDetails,
      country,
      State,
      city,
    } = req.body;

    const userId = req.userId;

    const custObj = {
      clientId: userId,
      CompanyName,
      Telephone,
      email,
      website,
      contactPersonName,
      contactPersonMobileNumber,
      contactPersonEmail,
      otherDetails,
      country,
      State,
      city,
    };
    const result = await insertCust(custObj);
    // console.log(result)
    //insert in mongodb

    if (result._id) {
      return res.json({
        status: "success",
        message: "new client have been created",
      });
    }

    res.json({
      status: "error",
      message: "Unable to create client please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});






// POST route to save lead category and status
router.post("/leadsCategory", async (req, res) => {
  try {
    const { category, status } = req.body;
    // Validate the required fields

    if (!category || !status) {
      res.status(400).json({ error: "Please provide all the required fields" });
      return;
    }

    // Create a new Lead instance
    const catOBJ = {
      category,
      status,
    };

    // Save the lead to the database
    await insertCat(catOBJ);

    res.status(201).json({ message: "Lead category saved successfully" });
  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ error: "Error saving lead" });
  }
});




//lead info route
// API route to save lead information
router.post("/leads-Info", upload.single("attachment"), async (req, res) => {
  const {
    companyName,
    leadTitle,
    leadSource,
    status,
    referralName,
    description,
    staffName,
    otherDetails,
    followUpDate,
    followUpTime,
    assignedManager,
    assignedTo,
    leadInfoId


  } = req.body;
  const validStatusOptions = [
    "Working",
    "Contacted",
    "Qualified",
    "Failed",
    "Closed",
  ];
  try {
    const assignedToId = mongoose.Types.ObjectId(assignedManager);
    // Create a new lead instance using the Lead schema
    const lead = new leadinfoSchema({
      companyName,
      leadTitle,
      leadSource,
      referralName,
      description,
      status,
      staffName,
      otherDetails,
      followUpDate,
      followUpTime,
      assignedManager: assignedToId,
      assignedTo, leadInfoId,
      attachment: req.file ? req.file.path : "",
    });
    if (status && !validStatusOptions.includes(status)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid status option. Please choose one of the valid options.that are 1-Working, 2-Contacted, 3-Qualified, 4-Failed, 5-Closed.",
        });
    }
    // Save the lead to the database
    await lead.save();

    res.status(201).json({ message: "Lead information saved successfully" });
  } catch (error) {
    console.error("Error saving lead information:", error);
    res.status(500).json({ error: "Error saving lead information" });
  }
});



//lead-assign 
// API route to add LeadInfo to LeadManager
router.post('/assign-lead', async (req, res) => {
  try {
    const { leadInfoIds , leadManagerId} = req.body;

    
    // Step 1: Get data of LeadInfo based on LeadInfoID
    const leadInfos = await leadinfoSchema.find({ leadInfoId:{ $in: leadInfoIds} });
    

    if (leadInfos) {
      res.status(200).json({ message: 'LeadInfos assigned to LeadManager successfully' });
    }

    if (!leadInfos) {
      return res.status(404).json({ message: 'LeadInfos not found' });
    }

    // Step 2: Search LeadManager based on LeadManagerID
    const leadManager = await leadManger.findOne({ leadManagerId: leadManagerId });

    if (!leadManager) {
      return res.status(404).json({ message: 'LeadManager not found' });
    }

    // Step 3: Push LeadInfo into leadInfo array in LeadManager Schema
  //   leadManager.leadInfo.push(leadInfo);
  //   await leadManager.save();

  //   res.status(200).json({ message: 'LeadInfo added to LeadManager successfully' });
  // } 
  // catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'Internal server error' });

  const missingLeadInfos = leadInfoIds.filter((leadInfoId) => !leadInfos.some((leadInfo) => leadInfo.leadInfoId === leadInfoId));
  if (missingLeadInfos.length > 0) {
    return res.status(404).json({ message: `LeadInfo with IDs ${missingLeadInfos.join(', ')} not found` });
  }

  // Step 4: Assign LeadInfo to LeadManager
  leadManager.leadInfo.push(...leadInfos);
  await leadManager.save();

  res.status(200).json({ message: 'Leads assigned to LeadManager successfully' });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
  }
});




// Add Lead Manager 
router.post('/addLeadManager', async (req, res) => {
  try {
    const {
      leadManagerId,
      leadManagerName,
    } = req.body;

    // Create a new LeadManager object
    const newLeadManager = new LeadMangar({
      leadManagerId,
      leadManagerName,
    });

    // Save the new LeadManager to the database
    const savedLeadManager = await newLeadManager.save();

    res.status(201).json(savedLeadManager);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// Update lead status
router.put("/:leadId/followup", async (req, res) => {
  const { leadId } = req.params;
  const { status } = req.body;

  const validStatusOptions = [
    "Working",
    "Contacted",
    "Qualified",
    "Failed",
    "Closed",
  ];

  try {
    // Find the lead by ID
    const lead = await leadinfoSchema.findById(leadId);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Check if the provided status is valid
    if (!validStatusOptions.includes(status)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid status option. Please choose one of the valid options.that are 1-Working, 2-Contacted, 3-Qualified, 4-Failed, 5-Closed",
        });
    }

    // Update the lead status
    lead.status = status;

    // Save the updated lead
    await lead.save();

    res
      .status(200)
      .json({ message: `Lead status updated successfully to ${lead.status}` });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ error: "Error updating lead status" });
  }
});






//Status-based filter
router.get("/status-based-filter", async (req, res) => {
  const { status } = req.query;

  const validStatusOptions = [
    "Working",
    "Contacted",
    "Qualified",
    "Failed",
    "Closed",
  ];

  try {
    // Check if the provided status is valid
    if (status && !validStatusOptions.includes(status)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid status option. Please choose one of the valid options.that are 1-Working, 2-Contacted, 3-Qualified, 4-Failed, 5-Closed.",
        });
    }

    // Define the filter object based on the provided status
    const filter = status ? { status: status } : {};

    // Retrieve the filtered leads from the database
    const filteredLeads = await leadinfoSchema.find(filter);

    res.status(200).json({ leads: filteredLeads });
  } catch (error) {
    console.error("Error filtering leads:", error);
    res.status(500).json({ error: "Error filtering leads" });
  }
});








router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getLeads(userId);
    console.log(result);
    //insert in mongodb

    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});







//get single lead by id
router.get("/:_id", userAuthorization, async (req, res) => {
  console.log(req.params);
  try {
    const clientId = req.userId;
    const { _id } = req.params;
    const result = await getLeadsById(_id, clientId);
    console.log(result);
    //insert in mongodb

    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});




//update the lead status after client reply
router.put("/:_id",replyLeadMessageValidation,userAuthorization,async (req, res) => {
    try {
      const { message, sender } = req.body;
      const clientId = req.userId;
      const { _id } = req.params;
      const result = await updateClientReply({ _id, message, sender });
      console.log(result);
      //insert in mongodb
      if (result._id) {
        return res.json({
          status: "success",
          message: "your message have been updated",
        });
      }
      return res.json({
        status: "success",
        message: "Unable to update your message please try again later ",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);




router.patch("/close-lead/:_id", userAuthorization, async (req, res) => {
  try {
    const clientId = req.userId;
    const { _id } = req.params;

    // Check if _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid _id parameter" });
    }

    // Find the lead by _id and clientId
    const lead = await LeadsSchema.findOne({ _id, clientId });

    // Check if the lead exists
    if (!lead) {
      return res
        .status(404)
        .json({ status: "error", message: "Lead not found" });
    }

    // Check if the lead is already closed
    if (lead.status === "closed") {
      return res.json({ status: "success", message: "Lead is already closed" });
    }

    // Update the lead status to closed
    lead.status = "closed";
    await lead.save();

    return res.json({ status: "success", message: "Lead has been closed" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});




//Delete  the lead which have been closed
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const clientId = req.userId;
    const { _id } = req.params;
    const result = await deleteLead({ _id, clientId });
    console.log(result);
    //insert in mongodb

    return res.json({
      status: "success",
      message: "your lead have been deleted from our system",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});




//fetch all the leads of status closed
router.get("/filtering/:status", userAuthorization, async (req, res) => {
  const { status } = req.params;
  const filter = {};
  if (status) {
    filter.status = status;
  }
  try {
    const leads = await LeadsSchema.find(filter);
    console.log(filter);
    res.send(leads);
  } catch (err) {
    res.status(500).send(err.message);
  }
});




const filterSchema = {
  type: "object",
  properties: {
    wealth_min: { type: "number" },
    wealth_max: { type: "number" },
    experience_min: { type: "number" },
    experience_max: { type: "number" },
    current_business: { type: "string" },
    preferred_businesses: { type: "string" },
  },
};

// Define the endpoint to filter the leads
router.post("/filter_leads", userAuthorization, async (req, res) => {
  try {
    // Validate the filter criteria against the schema
    const ajv = new (require("ajv"))();
    const validate = ajv.compile(filterSchema);
    if (!validate(req.body)) {
      return res.status(400).json({ error: "Invalid filter criteria" });
    }

    // Build the filter query
    const filter = {};
    if (req.body.wealth_min !== undefined) {
      filter.wealth = { $gte: req.body.wealth_min };
    }
    if (req.body.wealth_max !== undefined) {
      filter.wealth = { ...filter.wealth, $lte: req.body.wealth_max };
    }
    if (req.body.experience_min !== undefined) {
      filter.experience = { $gte: req.body.experience_min };
    }
    if (req.body.experience_max !== undefined) {
      filter.experience = {
        ...filter.experience,
        $lte: req.body.experience_max,
      };
    }
    if (req.body.current_business !== undefined) {
      filter.currentBusinesses = req.body.current_business;
    }
    if (req.body.preferred_businesses !== undefined) {
      filter.mostPreferedBusinesses = {
        $regex: new RegExp(req.body.preferred_businesses, "i"),
      };
    }

    // Find the leads matching the filter criteria
    const leads = await LeadsSchema.find(filter);
    if (leads) {
      return res.json(leads);
    }
    return res.json("no leads found");
    // Return the filtered leads
    // return res.json(leads);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// Define the endpoint to retrieve the filter options
router.get("/filter_options", async (req, res) => {
  try {
    // Retrieve the distinct values of the relevant fields from the leads collection
    const wealthOptions = await LeadsSchema.distinct("wealth");
    const experienceOptions = await LeadsSchema.distinct("experience");
    const currentBusinessOptions = await LeadsSchema.distinct(
      "current_business"
    );
    const preferredBusinessesOptions = await LeadsSchema.distinct(
      "preferred_businesses"
    );

    // Return the filter options

    return res.json({
      wealth_options: wealthOptions,
      experience_options: experienceOptions,
      current_business_options: currentBusinessOptions,
      preferred_businesses_options: preferredBusinessesOptions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});




router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


// Route for printing staff information(not working)
router.get("/staff-wise", userAuthorization, async (req, res) => {
  try {
    // Retrieve staff information from the database
    const staffList = await StaffSchema.find({});

    // Print staff information or perform any desired action
    console.log(staffList);

    res.status(200).json({ message: "Staff information printed" });
  } catch (error) {
    console.error("Error retrieving staff information:", error);
    res.status(500).json({ error: "Error retrieving staff information" });
  }
});

module.exports = router;
