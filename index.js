
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const crypto = require("crypto");
const admin = require("firebase-admin");


const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);

const app = express();
const port = process.env.PORT || 5000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({
  origin: [
   "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// ================= TRACKING ID =================

const generateTrackingId = () => {
  const prefix = "TRK";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(4).toString("hex");

  return `${prefix}-${date}-${random}`;
};

// ================= VERIFY TOKEN =================



const verifyFBToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access token" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    req.email = decoded.email;

    next();
  } catch (error) {

    return res.status(403).send({ message: "Forbidden access" });
  }
};

// ================= MONGODB =================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6lmq5wd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ================= RUN SERVER =================

async function run() {
  try {
    await client.connect();

    const db = client.db("asset-management_db");

    // ================= COLLECTIONS =================

    const usersCollection = db.collection("users");

    const assetsCollection = db.collection("assets");
    const myAssetsCollection = db.collection("my-assets");
    const assetTypesCollection = db.collection('assetTypes');
    const employeesCollection = db.collection('employees')
    const requestsCollection = db.collection("requests");
    const assetRequestsCollection = db.collection("assetRequests");
    const assignedAssetsCollection = db.collection("assignedAssets");
    const employeeRequestsCollection = db.collection("employeeRequests");
    const employeeAffiliationsCollection = db.collection("employeeAffiliations");
    const companyCollection = db.collection("my-companies");
    const paymentsCollection = db.collection("payments");
    const noticesCollection = db.collection('notices');
    const purchasedAssetsCollection = db.collection("purchasedAssets");
    const packagesCollection = db.collection("packages");

    // ================= VERIFY HR =================

    const verifyHR = async (req, res, next) => {
      try {
        const email = req.email;
        console.log("Verifying HR for email:", email);


        const user = await usersCollection.findOne({ email });

        if (!user || user.role !== "admin") {
          return res.status(403).send({ message: "Forbidden Access" });
        }

        next();
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    };


    app.get("/my-assets", verifyFBToken, async (req, res) => {
      try {
        const email = req.user.email;

        const assets = await assignedAssetsCollection
          .find({ employeeEmail: email })
          .sort({ assignmentDate: -1 })
          .toArray();

        res.send({
          success: true,
          data: assets,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });
    app.post("/my-assets", verifyFBToken, async (req, res) => {
      const asset = req.body;

      const newAsset = {
        ...asset,
        employeeEmail: req.email,
        createdAt: new Date(),
      };

      const result = await myAssetsCollection.insertOne(newAsset);

      res.send(result);
    });


app.get("/asset-requests/hr", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    const { search, status, type, startDate, endDate } = req.query;
    
    let query = { hrEmail: hrEmail };
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (type && type !== "all") {
      query.assetType = type;
    }
    
    if (startDate || endDate) {
      query.requestDate = {};
      if (startDate) {
        query.requestDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.requestDate.$lte = new Date(endDate + "T23:59:59");
      }
    }
    
    let requests = await assetRequestsCollection
      .find(query)
      .sort({ requestDate: -1 })
      .toArray();
    
    if (search) {
      requests = requests.filter(req => 
        req.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        req.employeeEmail?.toLowerCase().includes(search.toLowerCase()) ||
        req.assetName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const requestsWithDetails = await Promise.all(
      requests.map(async (req) => {
        const employee = await usersCollection.findOne({ 
          email: req.employeeEmail 
        });
        
        return {
          ...req,
          name: employee?.name || req.employeeName,
          photoURL: employee?.photoURL
        };
      })
    );
    
    res.send(requestsWithDetails);
  } catch (error) {
    console.error("HR requests error:", error);
    res.status(500).send({ message: error.message });
  }
});

// Get requests stats
app.get("/asset-requests/stats", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    
    const totalRequests = await assetRequestsCollection.countDocuments({ hrEmail });
    const pendingRequests = await assetRequestsCollection.countDocuments({ 
      hrEmail, 
      status: "pending" 
    });
    const approvedRequests = await assetRequestsCollection.countDocuments({ 
      hrEmail, 
      status: "approved" 
    });
    const rejectedRequests = await assetRequestsCollection.countDocuments({ 
      hrEmail, 
      status: "rejected" 
    });
    
    res.send({
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.patch("/asset-requests/:id/approve", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const id = req.params.id;
    
    const request = await assetRequestsCollection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!request) {
      return res.status(404).send({ success: false, message: "Request not found" });
    }
    
    if (request.status !== "pending") {
      return res.status(400).send({ success: false, message: "Request already processed" });
    }
    

    const asset = await assetsCollection.findOne({
      _id: new ObjectId(request.assetId)
    });
    
    if (!asset || asset.availableQuantity <= 0) {
      return res.status(400).send({ success: false, message: "Asset not available" });
    }
    
    await assetRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "approved",
          approvedAt: new Date()
        } 
      }
    );
    
    await assignedAssetsCollection.insertOne({
      assetId: request.assetId,
      assetName: request.assetName,
      assetType: request.assetType,
      employeeEmail: request.employeeEmail,
      employeeName: request.employeeName,
      hrEmail: request.hrEmail,
      companyId: request.companyId,
      assignmentDate: new Date(),
      status: "assigned",
      returnStatus: "Assigned"
    });

    await assetsCollection.updateOne(
      { _id: new ObjectId(request.assetId) },
      { $inc: { availableQuantity: -1 } }
    );

    const existingAffiliation = await employeeAffiliationsCollection.findOne({
      employeeEmail: request.employeeEmail,
      hrEmail: request.hrEmail
    });
    
    if (!existingAffiliation) {
      await employeeAffiliationsCollection.insertOne({
        employeeEmail: request.employeeEmail,
        employeeName: request.employeeName,
        hrEmail: request.hrEmail,
        companyId: request.companyId,
        companyName: request.companyName,
        status: "active",
        affiliatedAt: new Date()
      });
    }
    
    res.send({ success: true, message: "Request approved successfully" });
  } catch (error) {
    console.error("Approve error:", error);
    res.status(500).send({ success: false, message: error.message });
  }
});

app.patch("/asset-requests/:id/reject", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    
    const result = await assetRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "rejected",
          rejectionReason: reason || "No reason provided",
          rejectedAt: new Date()
        } 
      }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).send({ success: false, message: "Request not found" });
    }
    
    res.send({ success: true, message: "Request rejected" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


app.post("/asset-requests/bulk-approve", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const { requestIds } = req.body;
    
    let approvedCount = 0;
    
    for (const id of requestIds) {
      try {
        const request = await assetRequestsCollection.findOne({
          _id: new ObjectId(id)
        });
        
        if (request && request.status === "pending") {
          const asset = await assetsCollection.findOne({
            _id: new ObjectId(request.assetId)
          });
          
          if (asset && asset.availableQuantity > 0) {
            await assetRequestsCollection.updateOne(
              { _id: new ObjectId(id) },
              { 
                $set: { 
                  status: "approved",
                  approvedAt: new Date()
                } 
              }
            );
            
            await assignedAssetsCollection.insertOne({
              assetId: request.assetId,
              assetName: request.assetName,
              employeeEmail: request.employeeEmail,
              employeeName: request.employeeName,
              hrEmail: request.hrEmail,
              assignmentDate: new Date(),
              status: "assigned"
            });
            
            await assetsCollection.updateOne(
              { _id: new ObjectId(request.assetId) },
              { $inc: { availableQuantity: -1 } }
            );
            
            approvedCount++;
          }
        }
      } catch (err) {
        console.error(`Failed to approve request ${id}:`, err);
      }
    }
    
    res.send({ success: true, approvedCount });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

app.post("/register-hr", async (req, res) => {
  try {
    const { name, email, companyName, companyLogo } = req.body;

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists"
      });
    }

    const newHR = {
      name: name,
      email: email,
      role: "admin",
      companyName: companyName,
      companyLogo: companyLogo,
      packageLimit: 5,
      currentEmployees: 0,
      subscription: "basic",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newHR);

    res.send({
      success: true,
      message: "HR registered successfully",
      data: {
        _id: result.insertedId,
        ...newHR
      }
    });

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


app.get("/company-users/:companyId", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const companyId = req.params.companyId;
    
    const users = await usersCollection.find({ 
      companyId: companyId 
    }).toArray();
    
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get(
  "/employee-management",
  verifyFBToken,
  verifyHR,
  async (req, res) => {
    try {
      const hrEmail = req.email;

      const result = await employeeAffiliationsCollection
        .find({
          hrEmail,
          status: "active",
        })
        .sort({
          affiliatedAt: -1,
        })
        .toArray();

      res.send(result);  
    } catch (error) {
      res.status(500).send({
        message: "Failed to fetch employees",
      });
    }
  }
);

app.patch("/users/:id/role", async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  );

  res.send(result);
});
app.post("/companies", verifyFBToken, async (req, res) => {
  try {
    const { companyName, companyLogo } = req.body;
    const hrEmail = req.email;

    if (!companyName || !companyLogo) {
      return res.status(400).send({
        success: false,
        message: "Company name and logo are required"
      });
    }

    const existingUser = await usersCollection.findOne({ email: hrEmail });

    if (existingUser) {
      if (existingUser.role !== "admin") {
        await usersCollection.updateOne(
          { email: hrEmail },
          { 
            $set: { 
              role: "admin",
              companyName: companyName,
              companyLogo: companyLogo,
              packageLimit: existingUser.packageLimit || 5,
              currentEmployees: existingUser.currentEmployees || 0,
              updatedAt: new Date()
            } 
          }
        );
      } else {
        await usersCollection.updateOne(
          { email: hrEmail },
          { 
            $set: { 
              companyName: companyName,
              companyLogo: companyLogo,
              updatedAt: new Date()
            } 
          }
        );
      }
      
      const updatedUser = await usersCollection.findOne({ email: hrEmail });
      
      return res.send({
        success: true,
        message: "Company updated successfully",
        data: updatedUser
      });
    }

    const newCompanyHR = {
      name: req.body.name || "HR Manager",
      email: hrEmail,
      role: "admin",
      companyName: companyName,
      companyLogo: companyLogo,
      packageLimit: 5,
      currentEmployees: 0,
      subscription: "basic",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newCompanyHR);

    res.send({
      success: true,
      insertedId: result.insertedId,
      message: "Company created successfully",
      data: newCompanyHR
    });

  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

app.get("/companies", verifyFBToken, async (req, res) => {
  try {
    const hrEmail = req.email;
    const company = await usersCollection.findOne(
      { 
        email: hrEmail,
        role: "admin"
      },
      {
        projection: {
          name: 1,
          email: 1,
          companyName: 1,
          companyLogo: 1,
          packageLimit: 1,
          currentEmployees: 1,
          subscription: 1,
          createdAt: 1
        }
      }
    );

    if (!company || !company.companyName) {
      return res.send([]);
    }

    const employees = await employeeAffiliationsCollection
      .find({ 
        hrEmail: hrEmail,
        status: "active" 
      })
      .toArray();

    const companyWithEmployees = {
      ...company,
      employees: employees,
      employeeCount: employees.length
    };

    res.send([companyWithEmployees]);

  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

app.get("/companies/:companyName", verifyFBToken, async (req, res) => {
  try {
    const { companyName } = req.params;
    
    const company = await usersCollection.findOne(
      { 
        companyName: companyName,
        role: "admin"
      },
      {
        projection: {
          password: 0 
        }
      }
    );

    if (!company) {
      return res.status(404).send({
        success: false,
        message: "Company not found"
      });
    }

  
    const employees = await employeeAffiliationsCollection
      .find({ 
        companyName: companyName,
        status: "active" 
      })
      .toArray();

    res.send({
      success: true,
      data: {
        ...company,
        employees: employees,
        totalEmployees: employees.length
      }
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/companies/:companyName", verifyFBToken, async (req, res) => {
  try {
    const { companyName } = req.params;
    const { companyLogo, packageLimit, subscription } = req.body;
    const hrEmail = req.email;

    const updateData = {
      updatedAt: new Date()
    };

    if (companyLogo) updateData.companyLogo = companyLogo;
    if (packageLimit) updateData.packageLimit = packageLimit;
    if (subscription) updateData.subscription = subscription;

    const result = await usersCollection.updateOne(
      { 
        email: hrEmail,
        companyName: companyName,
        role: "admin"
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Company not found or you don't have permission"
      });
    }

    res.send({
      success: true,
      message: "Company updated successfully"
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

    app.post("/asset-request", verifyFBToken, async (req, res) => {
      try {
        const { assetId } = req.body;

        const email = req.email;

        const request = await assetRequestsCollection.insertOne({
          assetId,
          employeeEmail: email,
          status: "pending",
          createdAt: new Date(),
        });

        res.send(request);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    app.get(
      "/my-requests",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.email;

          const result = await assetRequestsCollection
            .find({
              employeeEmail: email,
            })
            .sort({ requestDate: -1 })
            .toArray();

          res.send(result);
        } catch (error) {
          res.status(500).send({
            message: error.message,
          });
        }
      }
    );
    app.patch(
      "/return-asset/:id",
      verifyFBToken,

      async (req, res) => {

        const id = req.params.id;

        const result =
          await assetRequestsCollection.updateOne(
            {
              _id: new ObjectId(id)
            },
            {
              $set: {
                returned: true,
                returnDate: new Date()
              }
            }
          );

        res.send(result);
      }
    );
    app.get(
      "/company-team/:companyId",
      verifyFBToken,

      async (req, res) => {

        const companyId = req.params.companyId;

        const result =
          await usersCollection
            .find({
              companyId
            })
            .project({
              name: 1,
              email: 1,
              designation: 1,
              photoURL: 1
            })
            .toArray();

        res.send(result);
      }
    );
    app.get(
      "/my-profile",
      verifyFBToken,
      async (req, res) => {

        const email = req.user.email;

        const result =
          await usersCollection.findOne({
            email
          });

        res.send(result);
      }
    );
    app.patch(
      "/update-profile",
      verifyFBToken,
      async (req, res) => {

        const email = req.user.email;

        const result =
          await usersCollection.updateOne(
            { email },
            {
              $set: req.body
            }
          );

        res.send(result);
      }
    );

    
app.get("/employees/list", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    const { search, department, status } = req.query;
    
    let query = { hrEmail: hrEmail };
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (department && department !== "all") {
      query.department = department;
    }
    
    let employees = await employeeAffiliationsCollection
      .find(query)
      .sort({ affiliatedAt: -1 })
      .toArray();
    

    const employeesWithDetails = await Promise.all(
      employees.map(async (emp) => {
        const userDetails = await usersCollection.findOne({ 
          email: emp.employeeEmail 
        });
        
        const assets = await assignedAssetsCollection
          .find({ employeeEmail: emp.employeeEmail })
          .toArray();
        
        return {
          ...emp,
          ...userDetails,
          assets: assets,
          status: userDetails?.status || "active"
        };
      })
    );

    let filteredEmployees = employeesWithDetails;
    if (search) {
      filteredEmployees = employeesWithDetails.filter(emp => 
        emp.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeEmail?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.send(filteredEmployees);
  } catch (error) {
    console.error("Employee list error:", error);
    res.status(500).send({ message: error.message });
  }
});


app.get("/employees/stats", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    
    const totalEmployees = await employeeAffiliationsCollection.countDocuments({ 
      hrEmail: hrEmail 
    });
    
    const activeEmployees = await employeeAffiliationsCollection.countDocuments({ 
      hrEmail: hrEmail,
      status: "active"
    });
    
    const departments = await employeeAffiliationsCollection.distinct("department", {
      hrEmail: hrEmail
    });
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newThisMonth = await employeeAffiliationsCollection.countDocuments({
      hrEmail: hrEmail,
      affiliatedAt: { $gte: startOfMonth }
    });
    
    res.send({
      totalEmployees,
      activeEmployees,
      departments: departments.length,
      newThisMonth
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.patch("/employees/:id/remove", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const id = req.params.id;
    
    const result = await employeeAffiliationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "inactive",
          removedAt: new Date()
        } 
      }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).send({ success: false, message: "Employee not found" });
    }
    
    res.send({ success: true, message: "Employee removed successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

app.get("/departments", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    
    const departments = await employeeAffiliationsCollection.distinct("department", {
      hrEmail: hrEmail
    });
    
    const departmentList = departments.map(dept => ({
      _id: dept,
      name: dept
    }));
    
    res.send(departmentList);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

    app.get("/employee-requests",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const companyId = req.query.companyId;

          const query = companyId ? { companyId } : {};

          const result = await employeeRequestsCollection.find(query).toArray();

          res.send(result);
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });

    app.patch(
      "/employee-requests/:id/approve",
      verifyFBToken,
      verifyHR,
      async (req, res) => {
        try {
          const id = req.params.id;

          const request = await employeeRequestsCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!request) {
            return res.status(404).send({ message: "Request not found" });
          }

          await employeeRequestsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "approved" } }
          );

          await companyCollection.updateOne(
            { _id: new ObjectId(request.companyId) },
            {
              $inc: { currentEmployees: 1 },
              $addToSet: {
                employees: {
                  employeeId: request.employeeId,
                  email: request.employeeEmail,
                  name: request.employeeName,
                },
              },
            }
          );

     
          await usersCollection.updateOne(
            { email: request.employeeEmail },
            {
              $set: {
                companyId: request.companyId,
                activeCompany: request.companyId,
              },
            }
          );

          res.send({ success: true });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      }
    );


    app.patch("/employee-requests/:id/reject",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          await employeeRequestsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: "rejected" } }
          );

          res.send({ success: true });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });

    // =========================================================
    //profile

    app.get("/users/profile", verifyFBToken, async (req, res) => {
      try {
        const email = req.email;

        const user = await usersCollection.findOne(
          { email },
          {
            projection: {
              password: 0,
              token: 0,
            },
          }
        );

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send(user);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });
    app.patch("/users/profile",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.email;

          const { name, dateOfBirth, profileImage } = req.body;

          const updateDoc = {
            ...(name && { name }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(profileImage && { profileImage }),
            updatedAt: new Date(),
          };

          const result = await usersCollection.updateOne(
            { email },
            { $set: updateDoc },
            { upsert: false }
          );

          res.send({
            success: true,
            message: "Profile updated successfully",
            result,
          });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });
    //
    // =========================================================
    // USERS API

    app.get("/users/:email", verifyFBToken, async (req, res) => {
      try {
        const email = req.params.email;

        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({
            success: false,
            message: "User not found",
          });
        }

        res.send(user);
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });


  
app.post("/users", async (req, res) => {
  try {
    const user = req.body;

    const exists = await usersCollection.findOne({
      email: user.email,
    });

    if (exists) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = {
      ...user,
      role: user.role || "employee",
      status: user.status || "active",
      createdAt: user.createdAt || new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    res.send({
      success: true,
      insertedId: result.insertedId,
      data: newUser
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

    app.get("/users/:email/role",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.params.email;

          const user = await usersCollection.findOne({ email });

          res.send({
            role: user?.role || "employee",
          });
        } catch (error) {
          res.status(500).send({
            message: error.message,
          });
        }
      });

    app.get("/users", verifyFBToken, async (req, res) => {
      try {
        const search = req.query.search || "";

        const query = {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        };

        const result = await usersCollection
          .find(query)
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: error.message,
        });
      }
    });


    app.patch("/users/:id",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const id = req.params.id;

          const updateData = req.body;

          const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
          );

          res.send(result);
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });

    app.delete("/users/:id",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const id = req.params.id;

          const result = await usersCollection.deleteOne({
            _id: new ObjectId(id),
          });

          res.send(result);
        } catch (error) {
          res.status(500).send({
            message: error.message,
          });
        }
      });

    // =========================================================
    // Employees API

app.get("/employees", verifyFBToken, async (req, res) => {

  const result = await employeeAffiliationsCollection
    .find({
      hrEmail: req.email,
      status: "active",
    })
    .toArray();

  console.log(result);

  res.send(result);
});

app.post("/employees", verifyFBToken, async (req, res) => {
  try {

    console.log("POST req.email =", req.email);

    const employeeData = req.body;

    const newEmployee = {
      employeeName: employeeData.name,
      employeeEmail: employeeData.email,
      profileImage: employeeData.photo,
      designation: employeeData.designation,
      phone: employeeData.phone,
      gender: employeeData.gender,

      hrEmail: req.email,

      companyName: employeeData.companyName || null,

      status: "active",
      affiliationDate: new Date(),
    };

    console.log(newEmployee);

    const result = await employeeAffiliationsCollection.insertOne(newEmployee);

    res.send({
      insertedId: result.insertedId,
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

    app.patch("/employees/:id",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const id = req.params.id;

          const result = await employeeAffiliationsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
          );

          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Update failed" });
        }
      });
// ================= EMPLOYEE MANAGEMENT  =================
app.get("/employee-management", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    
    const hr = await usersCollection.findOne({ email: hrEmail });
    
    if (!hr) {
      return res.status(404).send({ 
        success: false, 
        message: "HR not found" 
      });
    }
    
    let query = {
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ],
      status: "active"
    };
    

    let employees = await employeeAffiliationsCollection
      .find(query)
      .sort({ affiliatedAt: -1 })
      .toArray();

    const employeesWithDetails = await Promise.all(
      employees.map(async (emp) => {
        const userDetails = await usersCollection.findOne({ 
          email: emp.employeeEmail 
        });
        
        const assignedAssets = await assignedAssetsCollection
          .find({ employeeEmail: emp.employeeEmail })
          .toArray();
        
        return {
          ...emp,
          name: userDetails?.name || emp.employeeName,
          email: emp.employeeEmail,
          photoURL: userDetails?.photoURL,
          assignedAssetsCount: assignedAssets.length,
          assets: assignedAssets
        };
      })
    );
    
    console.log(`✅ Found ${employeesWithDetails.length} employees`);
    
    res.send({
      success: true,
      data: employeesWithDetails,
      count: employeesWithDetails.length
    });
    
  } catch (error) {
    console.error("❌ Employee management error:", error);
    res.status(500).send({ 
      success: false, 
      message: error.message 
    });
  }
});


// ================= EMPLOYEES LIST (FIXED) =================
app.get("/employees/list", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    const { search, department, status } = req.query;

    const hr = await usersCollection.findOne({ email: hrEmail });
    
    if (!hr) {
      return res.status(404).send({ 
        success: false, 
        message: "HR not found" 
      });
    }
    
    let query = {
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ]
    };
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (department && department !== "all") {
      query.department = department;
    }
    
    let employees = await employeeAffiliationsCollection
      .find(query)
      .sort({ affiliatedAt: -1 })
      .toArray();
    
    const employeesWithDetails = await Promise.all(
      employees.map(async (emp) => {
        const userDetails = await usersCollection.findOne({ 
          email: emp.employeeEmail 
        });
        
        const assets = await assignedAssetsCollection
          .find({ employeeEmail: emp.employeeEmail })
          .toArray();
        
        return {
          _id: emp._id,
          name: userDetails?.name || emp.employeeName,
          email: emp.employeeEmail,
          photoURL: userDetails?.photoURL,
          designation: emp.designation || userDetails?.designation,
          department: emp.department,
          phone: emp.phone,
          gender: emp.gender,
          status: emp.status,
          affiliatedAt: emp.affiliatedAt,
          assets: assets,
          assetsCount: assets.length
        };
      })
    );
    

    let filteredEmployees = employeesWithDetails;
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      filteredEmployees = employeesWithDetails.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm) ||
        emp.email?.toLowerCase().includes(searchTerm) ||
        emp.designation?.toLowerCase().includes(searchTerm)
      );
    }
    
    res.send({
      success: true,
      data: filteredEmployees,
      count: filteredEmployees.length
    });
    
  } catch (error) {
    console.error("❌ Employees list error:", error);
    res.status(500).send({ 
      success: false, 
      message: error.message 
    });
  }
});

// ================= EMPLOYEE STATS (FIXED) =================
app.get("/employees/stats", verifyFBToken, verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;
    
    const hr = await usersCollection.findOne({ email: hrEmail });
    
    if (!hr) {
      return res.status(404).send({ 
        success: false, 
        message: "HR not found" 
      });
    }
    

    const totalEmployees = await employeeAffiliationsCollection.countDocuments({
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ]
    });
    

    const activeEmployees = await employeeAffiliationsCollection.countDocuments({
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ],
      status: "active"
    });

    const departments = await employeeAffiliationsCollection.distinct("department", {
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ]
    });
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newThisMonth = await employeeAffiliationsCollection.countDocuments({
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ],
      affiliatedAt: { $gte: startOfMonth }
    });
    
    const pendingRequests = await requestsCollection.countDocuments({
      $or: [
        { hrEmail: hrEmail },
        { companyName: hr.companyName }
      ],
      requestStatus: "pending"
    });
    
    res.send({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        departments: departments.length,
        departmentList: departments,
        newThisMonth,
        pendingRequests
      }
    });
    
  } catch (error) {
    console.error("❌ Employee stats error:", error);
    res.status(500).send({ 
      success: false, 
      message: error.message 
    });
  }
});
    // ================= REMOVE AFFILIATION =================

    app.patch(
      "/employee-management/:id/remove",
      verifyFBToken,
      verifyHR,
      async (req, res) => {
        try {
          const id = req.params.id;

          // ================= FIND AFFILIATION =================
          const affiliation =
            await employeeAffiliationsCollection.findOne({
              _id: new ObjectId(id),
            });

          if (!affiliation) {
            return res.status(404).send({
              message: "Affiliation not found",
            });
          }

          // ================= SECURITY CHECK =================
          if (affiliation.hrEmail !== req.email) {
            return res.status(403).send({
              message: "Unauthorized access",
            });
          }

          // ================= REMOVE =================
          const result =
            await employeeAffiliationsCollection.updateOne(
              {
                _id: new ObjectId(id),
              },
              {
                $set: {
                  status: "inactive",
                  removedAt: new Date(),
                },
              }
            );

          res.send(result);
        } catch (error) {
          console.log(error);

          res.status(500).send({
            message: "Failed to remove affiliation",
          });
        }
      }
    );

    // ================= GET MY AFFILIATED COMPANIES =================
    app.get(
      "/my-affiliations",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.email;

          const result =
            await employeeAffiliationsCollection
              .find({
                employeeEmail: email,
                status: "active",
              })
              .toArray();

          res.send(result);
        } catch (error) {
          console.log(error);

          res.status(500).send({
            message: "Failed to fetch affiliations",
          });
        }
      }
    );

    // ================= HR PACKAGE INFO =================
    app.get(
      "/hr-package-info",
      verifyFBToken,
      verifyHR,
      async (req, res) => {
        try {
          const hr = await usersCollection.findOne({
            email: req.email,
          });

          const totalEmployees =
            await employeeAffiliationsCollection.countDocuments({
              hrEmail: req.email,
              status: "active",
            });

          res.send({
            packageLimit: hr?.packageLimit || 5,
            totalEmployees,
            remaining:
              (hr?.packageLimit || 5) - totalEmployees,
          });
        } catch (error) {
          console.error(error);

          res.status(500).send({
            message: "Failed to fetch package info",
          });
        }
      }
    );


    // =========================================================
    // ASSETS API
    // =========================================================

    app.post("/assets", verifyFBToken, verifyHR, async (req, res) => {
      try {

        const user = await usersCollection.findOne({ email: req.email });

        console.log("User:", user);
        console.log("Request body:", req.body);

        const asset = req.body;


        const companyName =
          asset.companyName?.trim() ||
          user?.companyName ||
          user?.company ||
          "Unknown Company";


        const newAsset = {
          productName: asset.productName,
          productImage: asset.productImage,
          productType: asset.productType,
          productQuantity: Number(asset.productQuantity),
          availableQuantity: Number(asset.productQuantity),
          companyName,
          hrEmail: req.email,
          createdAt: new Date(),
        };

        const result = await assetsCollection.insertOne(newAsset);

        res.send({
          success: true,
          message: "Asset created successfully",
          data: result,
        });
      } catch (error) {
        console.error("CREATE ASSET ERROR:", error);
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/assets", verifyFBToken, async (req, res) => {
      try {
        const email = req.email;

        let currentUser = await usersCollection.findOne({ email });

        if (!currentUser) {
          const newUser = {
            email,
            name: req.user?.name || email.split("@")[0],
            role: "employee",
            status: "active",
            createdAt: new Date(),
          };

          const result = await usersCollection.insertOne(newUser);

          currentUser = {
            ...newUser,
            _id: result.insertedId,
          };

          console.log("Created user:", result.insertedId);
        }

        let query = {};

        const role = currentUser.role?.toLowerCase();

        if (role === "hr" || role === "admin") {

          query = { hrEmail: email };
        } else {

          if (currentUser.companyName) {
            query = { companyName: currentUser.companyName };
          } else {
            query = { productType: { $exists: true } };
          }
        }

        const result = await assetsCollection.find(query).toArray();

        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        console.error("Assets GET Error:", error);
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });


    app.post("/sync-hr-data", verifyFBToken, async (req, res) => {
      try {
        const email = req.email;
        const { companyName, role } = req.body;


        let user = await usersCollection.findOne({ email });

        if (!user) {

          const newHR = {
            email: email,
            name: req.user?.name || email.split('@')[0],
            role: role || "admin",
            companyName: companyName || null,
            status: "active",
            packageLimit: 5,
            currentEmployees: 0,
            createdAt: new Date()
          };

          const result = await usersCollection.insertOne(newHR);
          user = newHR;
        
        } else if (user.role !== "admin" && user.role !== "hr") {

          await usersCollection.updateOne(
            { email: email },
            { $set: { role: "admin", companyName: companyName } }
          );
          user.role = "admin";
          
        }

        res.send({
          success: true,
          message: "admin data synced successfully",
          user: user
        });

      } catch (error) {
        console.error("Sync HR error:", error);
        res.status(500).send({ message: error.message });
      }
    });

    app.patch("/assets/:id", verifyFBToken, verifyHR, async (req, res) => {
      try {
        const id = req.params.id;

        const result = await assetsCollection.updateOne(
          {
            _id: new ObjectId(id),
            hrEmail: req.email,
          },
          {
            $set: {
              ...req.body,
              updatedAt: new Date(),
            },
          }
        );

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });
    app.delete("/assets/:id", verifyFBToken, verifyHR, async (req, res) => {
      try {
        const id = req.params.id;

        const result = await assetsCollection.deleteOne({
          _id: new ObjectId(id),
          hrEmail: req.email,
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // =========================================================
    // asset-types API
    // 


    app.post('/asset-types', async (req, res) => {
      try {
        const assetType = req.body;

        if (!assetType.name || !assetType.price) {
          return res.status(400).send({ message: "name and price required" });
        }

        const newAssetType = {
          name: assetType.name,
          price: Number(assetType.price),
          createdAt: new Date(),
        };

        const result = await assetTypesCollection.insertOne(newAssetType);

        res.send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to create asset type" });
      }
    });

    app.get('/asset-types', async (req, res) => {
      try {
        const result = await assetTypesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch asset types" });
      }
    });


// =========================================================
// GET REQUESTS (Fixed for HR)
// =========================================================

app.get("/requests", verifyFBToken, async (req, res) => {
  try {
    const { status, email } = req.query;
    
    const user = await usersCollection.findOne({ email: req.email });
    const userRole = user?.role || "employee";
    
    console.log("User email:", req.email);
    console.log("User role:", userRole);
    
    let query = {};

    if (userRole === "admin" || userRole === "hr") {
      query.hrEmail = req.email;
   
    } 

    else {
      query.requesterEmail = req.email;
    
    }

    if (status && status !== "all") {
      query.requestStatus = status;
    }

    if (email) {
      query.requesterEmail = email;
    }

    const result = await requestsCollection
      .find(query)
      .sort({ requestDate: -1 })
      .toArray();

    
    res.send(result);

  } catch (error) {
    console.error("GET REQUESTS ERROR:", error);
    res.status(500).send({ message: error.message });
  }
});

// ================= GET ALL REQUESTS (FIXED) =================

app.post("/requests", verifyFBToken, async (req, res) => {
  try {
    const data = req.body;
    const user = await usersCollection.findOne({ email: req.email });
    const assetId = data.assetId.toString(); 
    
    const existingRequest = await requestsCollection.findOne({
      assetId: assetId,  
      requesterEmail: req.email,
      requestStatus: "pending"
    });
    
    if (existingRequest) {
      return res.status(400).send({
        success: false,
        message: "You already have a pending request for this asset"
      });
    }

    const request = {
      assetId: assetId,  
      assetName: data.assetName,
      assetType: data.assetType,
      assetImage: data.assetImage,
      hrEmail: data.hrEmail,
      companyName: data.companyName,
      companyId: data.companyId,
      requesterEmail: req.email,
      requesterName: user?.name || req.user?.name || "Unknown",
      requestStatus: "pending",
      requestDate: new Date(),
      quantity: data.quantity || 1,
      description: data.description || ""
    };

    const result = await requestsCollection.insertOne(request);
    
    console.log("✅ New request created:", result.insertedId);

    res.send({
      success: true,
      message: "Request submitted successfully",
      insertedId: result.insertedId,
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});



// =========================================================
// APPROVE REQUEST (Complete Version)
// =========================================================

app.patch(
  "/requests/approve/:id",
  verifyFBToken,
  verifyHR,
  async (req, res) => {
    try {
      const id = req.params.id;
      console.log("🟢 Approving request:", id);

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ 
          success: false, 
          message: "Invalid request ID format" 
        });
      }

      const request = await requestsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!request) {
        return res.status(404).send({ 
          success: false, 
          message: "Request Not Found" 
        });
      }

      if (request.requestStatus !== "pending") {
        return res.status(400).send({ 
          success: false, 
          message: `Request is already ${request.requestStatus}` 
        });
      }

      if (!request.assetId) {
        return res.status(400).send({ 
          success: false, 
          message: "Asset ID is missing in the request" 
        });
      }

      let asset = null;
      let assetQuery = {};
      
      
      if (typeof request.assetId === 'string') {
        
        asset = await assetsCollection.findOne({ _id: request.assetId });
        
        if (!asset && ObjectId.isValid(request.assetId)) {
          asset = await assetsCollection.findOne({ _id: new ObjectId(request.assetId) });
        }
      } 
   
      else if (request.assetId instanceof ObjectId) {
        asset = await assetsCollection.findOne({ _id: request.assetId });
      }
     
      else if (request.assetId && request.assetId._id) {
        const idStr = request.assetId._id.toString();
        if (ObjectId.isValid(idStr)) {
          asset = await assetsCollection.findOne({ _id: new ObjectId(idStr) });
        } else {
          asset = await assetsCollection.findOne({ _id: idStr });
        }
      }

      if (!asset) {
        console.log("Asset not found for ID:", request.assetId);
        return res.status(404).send({ 
          success: false, 
          message: "Asset Not Found. The asset may have been deleted." 
        });
      }

      if (asset.availableQuantity <= 0) {
        return res.status(400).send({ 
          success: false, 
          message: "Asset Out Of Stock" 
        });
      }

      await requestsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            requestStatus: "approved",
            approvalDate: new Date(),
          },
        }
      );

  
      const assetIdToStore = asset._id.toString(); 
      
      await assignedAssetsCollection.insertOne({
        assetId: assetIdToStore,
        assetName: asset.productName || request.assetName,
        assetType: asset.productType || request.assetType,
        assetImage: asset.productImage,
        companyName: request.companyName,
        employeeName: request.requesterName,
        employeeEmail: request.requesterEmail,
        hrEmail: request.hrEmail,
        status: "Assigned",
        returnStatus: "Assigned",
        assignmentDate: new Date(),
      });

      await assetsCollection.updateOne(
        { _id: asset._id },
        {
          $inc: { availableQuantity: -1 },
        }
      );

      return res.send({
        success: true,
        message: "Request Approved Successfully",
      });
      
    } catch (error) {
      console.error("❌ APPROVE ERROR:", error);
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);

// =========================================================
// REJECT REQUEST (Complete working version)
// =========================================================
app.patch(
  "/requests/reject/:id",
  verifyFBToken,
  verifyHR,
  async (req, res) => {
    try {
      const id = req.params.id;
      const { reason } = req.body;

  
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ 
          success: false, 
          message: "Invalid request ID format" 
        });
      }

      const request = await requestsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!request) {
        return res.status(404).send({ 
          success: false, 
          message: "Request Not Found" 
        });
      }

      if (request.requestStatus !== "pending") {
        return res.status(400).send({ 
          success: false, 
          message: `Request is already ${request.requestStatus}` 
        });
      }


      const result = await requestsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            requestStatus: "rejected", 
            rejectionReason: reason || "No reason provided",
            rejectedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update request status");
      }

      console.log("✅ Request rejected successfully:", id);

      res.send({ 
        success: true, 
        modifiedCount: result.modifiedCount,
        message: "Request Rejected Successfully" 
      });
      
    } catch (error) {
      console.error("❌ REJECT ERROR:", error);
      console.error("Error stack:", error.stack);
      res.status(500).send({ 
        success: false, 
        message: error.message,
        details: error.stack
      });
    }
  }
);


    app.get("/assigned-assets",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.email;

          if (!email) {
            return res.status(401).send({ message: "Unauthorized user" });
          }

          const result = await assignedAssetsCollection
            .find({ employeeEmail: email })
            .sort({ assignmentDate: -1 })
            .toArray();

          res.send(result);
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });

    app.patch("/assigned-assets/return/:id", verifyFBToken, async (req, res) => {
      try {
        const id = req.params.id;

        const assignedAsset = await assignedAssetsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!assignedAsset) {
          return res.status(404).send({
            success: false,
            message: "Asset Not Found",
          });
        }


        if (assignedAsset.status === "Returned") {
          return res.status(400).send({
            success: false,
            message: "Already Returned",
          });
        }


        if (assignedAsset.status !== "Assigned") {
          return res.status(400).send({
            success: false,
            message: "Invalid Status",
          });
        }


        await assignedAssetsCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "Returned",
              returnDate: new Date(),
            },
          }
        );

        await assetsCollection.updateOne(
          { assetId: assignedAsset.assetId },
          {
            $inc: { availableQuantity: 1 },
          }
        );

        res.send({
          success: true,
          message: "Asset Returned Successfully",
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });
    app.post("/assign-direct", verifyFBToken, async (req, res) => {
      try {
        const { assetId, employeeEmail } = req.body;


        const asset = await assetsCollection.findOne({
          _id: new ObjectId(assetId),
        });

        if (!asset || asset.availableQuantity <= 0) {
          return res.status(400).send({ message: "Not available" });
        }


        await employeesCollection.updateOne(
          { email: employeeEmail },
          {
            $setOnInsert: {
              email: employeeEmail,
              isAffiliated: true,
            },
          },
          { upsert: true }
        );

        await assignedAssetsCollection.insertOne({
          assetId,
          employeeEmail,
          assignmentType: "direct",
          returnStatus: "Assigned",
          assignmentDate: new Date(),
        });

        await assetsCollection.updateOne(
          { _id: new ObjectId(assetId) },
          {
            $inc: { availableQuantity: -1 },
          }
        );

        res.send({ success: true, message: "Asset Assigned" });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    app.patch("/asset-request/approve/:id",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const id = req.params.id;

          const request = await assetRequestsCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!request) {
            return res.status(404).send({ message: "Request not found" });
          }

          const asset = await assetsCollection.findOne({
            _id: new ObjectId(request.assetId),
          });

          if (!asset || asset.availableQuantity <= 0) {
            return res.status(400).send({ message: "Asset not available" });
          }

          await employeesCollection.updateOne(
            { email: request.employeeEmail },
            {
              $setOnInsert: {
                email: request.employeeEmail,
                isAffiliated: true,
              },
            },
            { upsert: true }
          );


          await assignedAssetsCollection.insertOne({
            assetId: request.assetId,
            employeeEmail: request.employeeEmail,
            assignmentType: "request",
            returnStatus: "Assigned",
            assignmentDate: new Date(),
          });

          await assetsCollection.updateOne(
            { _id: new ObjectId(request.assetId) },
            {
              $inc: { availableQuantity: -1 },
            }
          );


          await assetRequestsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: { status: "approved" },
            }
          );

          res.send({ success: true, message: "Request Approved" });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });
    // =========================================================
    // AFFILIATIONS API
    // =========================================================

    app.get(
      "/employee-affiliations",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.query.email;

          const result =
            await employeeAffiliationsCollection
              .find({
                employeeEmail: email,
              })
              .toArray();

          res.send(result);
        } catch (error) {
          res.status(500).send({
            message: error.message,
          });
        }
      }
    );

    // =========================================================
    // PACKAGES API
    // =========================================================

    app.get("/packages", async (req, res) => {
      try {
        const result = await packagesCollection.find().sort({ price: 1 }).toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: error.message,
        });
      }
    });

    app.post("/packages",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const packageData = req.body;

          // ================= VALIDATION =================
          if (!packageData.name || !packageData.price) {
            return res.status(400).send({
              success: false,
              message: "Name and price are required",
            });
          }

          const nameExists = await packagesCollection.findOne({
            name: packageData.name,
          });

          if (nameExists) {
            return res.status(409).send({
              success: false,
              message: "Package already exists",
            });
          }

          // ================= CREATE PACKAGE =================
          const newPackage = {
            name: packageData.name,
            price: Number(packageData.price),
            employeeLimit: Number(packageData.employeeLimit || 0),
            features: Array.isArray(packageData.features)
              ? packageData.features
              : [],
            createdAt: new Date(),
          };

          const result = await packagesCollection.insertOne(newPackage);

          res.send({
            success: true,
            message: "Package created successfully",
            insertedId: result.insertedId,
          });
        } catch (error) {
          res.status(500).send({
            success: false,
            message: error.message,
          });
        }
      });

    app.patch("/packages/:id",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const id = req.params.id;
          const data = req.body;

          // ================= VALIDATION =================
          if (!data.name || !data.price) {
            return res.status(400).send({
              success: false,
              message: "Name and price are required",
            });
          }

          const updateData = {
            name: data.name,
            price: Number(data.price),
            employeeLimit: Number(data.employeeLimit || 0),
            features: Array.isArray(data.features) ? data.features : [],
            updatedAt: new Date(),
          };

          const result = await packagesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({
              success: false,
              message: "Package not found",
            });
          }

          res.send({
            success: true,
            message: "Package updated successfully",
            result,
          });
        } catch (error) {
          res.status(500).send({
            success: false,
            message: error.message,
          });
        }
      });

    // =========================================================
    // PAYMENT API
    // =========================================================

    app.post(
      "/create-payment-intent",
      verifyFBToken,
      async (req, res) => {
        try {
          const { price } = req.body;

          const amount = parseInt(price * 100);

          const paymentIntent =
            await stripe.paymentIntents.create({
              amount,
              currency: "usd",
              payment_method_types: ["card"],
            });

          res.send({
            clientSecret: paymentIntent.client_secret,
          });
        } catch (error) {
          res.status(500).send({
            message: error.message,
          });
        }
      }
    );


    app.post("/create-checkout-session", verifyFBToken, async (req, res) => {
      try {
        const { packageName, price, employeeLimit, hrEmail } = req.body;

        const clientURL =process.env.CLIENT_URL ;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",

          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: packageName,
                },
                unit_amount: Math.round(Number(price) * 100),
              },
              quantity: 1,
            },
          ],

          success_url: `${clientURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${clientURL}/payment-cancel`,

          metadata: {
            packageName,
            employeeLimit: String(employeeLimit),
            hrEmail,
          },
        });

        res.send({ url: session.url });

      } catch (error) {
        console.log("Stripe Error:", error.message);
        res.status(500).send({ message: error.message });
      }
    });

    app.patch("/payment-success", async (req, res) => {
      try {

        const { session_id } = req.query;


        const session = await stripe.checkout.sessions.retrieve(session_id);


        const payment = {
          hrEmail: session.metadata.hrEmail,
          packageName: session.metadata.packageName,
          employeeLimit: Number(session.metadata.employeeLimit),
          transactionId: session.id,
          amount: session.amount_total / 100,
          currency: session.currency,
          paymentDate: new Date(),
        };

        const result = await paymentsCollection.insertOne(payment);



        res.send({ success: true, ...payment });

      } catch (error) {

        res.status(500).send({ message: error.message });
      }
    });
    app.post("/payments",
      verifyFBToken,
      async (req, res) => {
        try {
          const payment = req.body;

          payment.paymentDate = new Date();

          payment.trackingId = generateTrackingId();

          const result =
            await paymentsCollection.insertOne(payment);

          await usersCollection.updateOne(
            {
              email: payment.hrEmail,
            },
            {
              $set: {
                packageLimit: payment.employeeLimit,
                subscription: payment.packageName,
              },
            }
          );

          res.send(result);
        } catch (error) {
          res.status(500).send({
            message: error.message,
          });
        }
      });


    app.get("/payments",
      verifyFBToken,
      async (req, res) => {
        try {


          const result = await paymentsCollection
            .find({ hrEmail: req.query.email })
            .toArray();


          res.send(result);

        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
      });




    app.post("/save-purchase", async (req, res) => {
      const purchase = req.body;

      await purchasedAssetsCollection.insertOne(purchase);

      res.send({ success: true });
    });


    // ================= GET MY AFFILIATED COMPANIES =================

    app.get("/my-companies", verifyFBToken, async (req, res) => {
      try {
        const result = await employeeAffiliationsCollection.find({ status: "active" }).toArray(); res.send(result);
      }
      catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // ================= TEAM MEMBERS =================



    app.get("/team-members", verifyFBToken, async (req, res) => {
  try {
    const { companyName } = req.query;

    console.log("companyName =", companyName);

    const affiliations = await employeeAffiliationsCollection
      .find({
        companyName,
        status: "active",
      })
      .toArray();

    console.log("affiliations =", affiliations);

    const emails = affiliations.map(
      (item) => item.employeeEmail
    );

    const users = await usersCollection
      .find({
        email: { $in: emails },
      })
      .toArray();

    console.log("users =", users);

    res.send(users);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
    // ================= UPCOMING BIRTHDAYS (CURRENT MONTH) =================


    app.get("/upcoming-birthdays",
      verifyFBToken,
      async (req, res) => {
        try {
          const { companyName } = req.query;

          if (!companyName) {
            return res.status(400).send({ message: "companyName required" });
          }

          const currentMonth = new Date().getMonth();

    
          const affiliations = await employeeAffiliationsCollection
            .find({ companyName, status: "active" })
            .toArray();

          const emails = affiliations.map(emp => emp.employeeEmail);


          const users = await usersCollection
            .find({ email: { $in: emails } })
            .toArray();


          const birthdays = users.filter(user => {
            if (!user.dateOfBirth) return false;

            return new Date(user.dateOfBirth).getMonth() === currentMonth;
          });

          res.send(birthdays);

        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });
    //Employee dashboard
    app.get(
      "/employee/dashboard",
      verifyFBToken,
      async (req, res) => {
        try {
          const email = req.email;

          const assignedAssets = await assignedAssetsCollection.countDocuments({
            employeeEmail: email,
          });


          const pendingRequests = await requestsCollection.countDocuments({
            requesterEmail: email,
            requestStatus: "pending",
          });

          const approvedAssets = await requestsCollection.countDocuments({
            requesterEmail: email,
            requestStatus: "approved",
          });

          const recentAssets = await assignedAssetsCollection
            .find({ employeeEmail: email })
            .sort({ assignmentDate: -1 })
            .limit(5)
            .toArray();

          res.send({
            stats: {
              assignedAssets,
              pendingRequests,
              approvedAssets,
            },
            recentAssets,
          });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      }
    );

    app.get("/dashboard/stats",
      verifyFBToken,
      verifyHR, async (req, res) => {
        try {
          const hrEmail = req.email;

  
          const totalAssets = await assetsCollection.countDocuments({
            hrEmail,
          });

          const employees = await employeeAffiliationsCollection.countDocuments({
            hrEmail,
          });

    
          const pendingRequests = await requestsCollection.countDocuments({
            hrEmail,
            requestStatus: "pending",
          });

          const approvedAssets = await requestsCollection.countDocuments({
            hrEmail,
            requestStatus: "approved",
          });

  
          const returnable = await assetsCollection.countDocuments({
            hrEmail,
            productType: "Returnable",
          });

          const nonReturnable = await assetsCollection.countDocuments({
            hrEmail,
            productType: "Non-returnable",
          });

          res.send({
            stats: {
              totalAssets,
              employees,
              pendingRequests,
              approvedAssets,
            },
            pieData: [
              { name: "Returnable", value: returnable },
              { name: "Non-returnable", value: nonReturnable },
            ],
          });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });


    console.log("MongoDB Connected");
  } finally {
  }
}


run().catch(console.dir);

// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("AssetVerse Server Running");
});

// ================= SERVER =================

app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});