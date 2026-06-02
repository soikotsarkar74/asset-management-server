

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const crypto = require("crypto");
const admin = require("firebase-admin");


const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);

const app = express();
const port = process.env.PORT || 5000;

// ================= FIREBASE =================

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ================= MIDDLEWARE =================


app.use(cors({
  origin: ["https://asset-management-server-flax.vercel.app"],
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
     const assetTypesCollection = db.collection('assetTypes');
    const employeesCollection = db.collection('employees')

    const requestsCollection = db.collection("requests");
    const assetRequestsCollection = db.collection("assetRequests");
    const assignedAssetsCollection = db.collection("assignedAssets");
    const employeeRequestsCollection = db.collection("employeeRequests");
    const employeeAffiliationsCollection = db.collection("employeeAffiliations");
    const companyCollection = db.collection("my-companies");
    const paymentsCollection = db.collection("payments");
    const noticesCollection = db.collection('notices')

    const packagesCollection = db.collection("packages");


    // ================= VERIFY HR =================

 
 
const verifyHR = async (req, res, next) => {
  try {
    const email = req.email;

    const user = await usersCollection.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden Access" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// company
app.post("/companies",verifyFBToken, async (req, res) => {
  try {
    const company = req.body;

    const result = await companyCollection.insertOne(company);

    res.send({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
//employee request api


app.post(
  "/asset-request",
 
  async (req, res) => {

    const { companyId, assetId } = req.body;

    const asset = await assetsCollection.findOne({
      _id: new ObjectId(assetId)
    });

    const requestData = {

      employeeEmail: req.user.email,

      companyId,
      assetId,

      assetName: asset.productName,

      assetType: asset.productType,

      status: "pending",

      requestDate: new Date()
    };

    const result =
      await assetRequestsCollection.insertOne(requestData);

    res.send(result);
  }
);


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
app.post("/employee-requests", 
  verifyFBToken, 
  async (req, res) => {
  try {
    const request = req.body;

    request.status = "pending";
    request.createdAt = new Date();

    const result = await employeeRequestsCollection.insertOne(request);

    res.send({
      success: true,
      insertedId: result.insertedId
    });
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

      // 1. find request first
      const request = await employeeRequestsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!request) {
        return res.status(404).send({ message: "Request not found" });
      }

      // 2. update request status
      await employeeRequestsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "approved" } }
      );

      // 3. update company safely
      await companiesCollection.updateOne(
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

      // 4. update user correctly
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

app.get("/users/profile",  async (req, res) => {
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

      companies: user.companies || [],

      activeCompany: user.activeCompany || null,

      status: "active",

      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.send({
      success: true,
      insertedId: result.insertedId,
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

app.get("/employees", 
verifyFBToken, 
async (req, res) => {
  try {

    const hrEmail = req.email;

    if (!hrEmail) {
      return res.status(400).send({
        message: "Email not found in token",
      });
    }

    const result = await employeeAffiliationsCollection
      .find({
        hrEmail,
        status: "active",
      })
      .toArray();

    res.send(result);

  } catch (error) {


    res.status(500).send({
      message: "Failed to load employees",
    });
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


// ================= EMPLOYEE MANAGEMENT =================

// GET ALL ACTIVE AFFILIATED EMPLOYEES
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
      console.log(error);

      res.status(500).send({
        message: "Failed to fetch employees",
      });
    }
  }
);

// ================= AUTO AFFILIATION =================
app.patch(
  "/asset-requests/:id/approve",
  verifyFBToken,
  verifyHR,
  async (req, res) => {
    try {
      const id = req.params.id;

      // ================= FIND REQUEST =================
      const request = await assetRequestsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!request) {
        return res.status(404).send({
          message: "Request not found",
        });
      }

      // ================= FIND HR =================
      const hr = await usersCollection.findOne({
        email: req.email,
      });

      // ================= PACKAGE LIMIT CHECK =================
      const totalEmployees =
        await employeeAffiliationsCollection.countDocuments({
          hrEmail: req.email,
          status: "active",
        });

      if (totalEmployees >= hr.packageLimit) {
        return res.status(403).send({
          message: "Package limit exceeded",
        });
      }

      // ================= UPDATE REQUEST STATUS =================
      await assetRequestsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            status: "approved",
            approvedAt: new Date(),
          },
        }
      );

      // ================= CHECK EXISTING AFFILIATION =================
      const alreadyExists =
        await employeeAffiliationsCollection.findOne({
          employeeEmail: request.employeeEmail,
          companyId: request.companyId,
          status: "active",
        });

      // ================= AUTO AFFILIATION =================
      if (!alreadyExists) {
        await employeeAffiliationsCollection.insertOne({
          employeeName: request.employeeName,
          employeeEmail: request.employeeEmail,

          companyId: request.companyId,
          companyName: request.companyName,

          hrEmail: req.email,

          status: "active",

          affiliatedAt: new Date(),
        });
      }

      res.send({
        success: true,
        message: "Request approved & employee affiliated",
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message: "Failed to approve request",
      });
    }
  }
);

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
        packageLimit: hr.packageLimit || 5,
        totalEmployees,
        remaining:
          (hr.packageLimit || 5) - totalEmployees,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message: "Failed to fetch package info",
      });
    }
  }
);
    // =========================================================
    // ASSETS API
    // =========================================================


app.get("/assets", 
verifyFBToken,
 async (req, res) => {
  try {

    const {
      search,
      type,
      page = 1,
      limit = 10,
    } = req.query;

    // ================= PAGINATION =================

    const currentPage = parseInt(page);

    const perPage = parseInt(limit);

    const skip = (currentPage - 1) * perPage;

    // ================= CURRENT USER =================

    const email = req.email;

    const currentUser = await usersCollection.findOne({
      email,
    });

    if (!currentUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // ================= QUERY =================

    let query = {};

    if (currentUser.role === "admin") {

      query.hrEmail = email;
    }
  

    if (currentUser.role === "employee") {

      query.availableQuantity = {
        $gt: 0,
      };
    }

    // ================= SEARCH =================

    if (search) {

      query.productName = {
        $regex: search,
        $options: "i",
      };
    }

    // ================= FILTER =================

    if (type) {

      query.productType = type;
    }

    // ================= TOTAL =================

    const total =
      await assetsCollection.countDocuments(query);

    // ================= RESULT =================

    const result = await assetsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .toArray();

    // ================= RESPONSE =================

    res.send({
      success: true,
      total,
      currentPage,
      totalPages: Math.ceil(total / perPage),
      data: result,
    });

  } catch (error) {

   

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
app.patch(
  "/assets/:id",
  verifyFBToken,
  verifyHR,
  async (req, res) => {

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

      res.status(500).send({
        message: error.message,
      });
    }
  }
);
app.delete(
  "/assets/:id",
  verifyFBToken,
  verifyHR,
  async (req, res) => {

    try {

      const id = req.params.id;

      const result = await assetsCollection.deleteOne({
        _id: new ObjectId(id),
        hrEmail: req.email,
      });

      res.send(result);

    } catch (error) {

      res.status(500).send({
        message: error.message,
      });
    }
  }
);
app.post(
  "/assets",
  verifyFBToken,
  verifyHR,
  async (req, res) => {

    try {

      const user = await usersCollection.findOne({
        email: req.email,
      });

      const asset = req.body;

      const newAsset = {

        productName: asset.productName,

        productImage: asset.productImage,

        productType: asset.productType,

        productQuantity: Number(asset.productQuantity),

        availableQuantity: Number(asset.productQuantity),

        companyName: user.companyName,

        hrEmail: req.email,

        createdAt: new Date(),
      };

      const result =
        await assetsCollection.insertOne(newAsset);

      res.send(result);

    } catch (error) {

      res.status(500).send({
        message: error.message,
      });
    }
  }
);

  // =========================================================
    // asset-types API
    // 

    
    app.post('/asset-types', async (req, res) => {
      try {
        const assetType = req.body;

        // basic validation
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
    // REQUESTS API
    // =========================================================


app.post("/requests",
 verifyFBToken,
  async (req, res) => {
  try {


    const requestData = req.body;

    requestData.requesterEmail = req.email;


    requestData.requestStatus = "pending";


    requestData.requestDate = new Date();

    const alreadyRequested = await requestsCollection.findOne({
      assetId: requestData.assetId,
      requesterEmail: req.email,
      requestStatus: "pending",
    });

    if (alreadyRequested) {
      return res.status(400).send({
        message: "Already Requested",
      });
    }

    // ✅ save
    const result = await requestsCollection.insertOne(
      requestData
    );

    res.send(result);

  } catch (error) {

    res.status(500).send({
      message: error.message,
    });

  }
});

// =========================================================
// GET REQUESTS
// =========================================================


app.get("/requests",
verifyFBToken,
 async (req, res) => {
  try {
    const { status, email } = req.query;

    let query = {};

    if (req.role === "admin") {
      query.hrEmail = req.email;
    }

    if (req.role === "employee") {
      query.requesterEmail = req.email;
    }

    if (status) {
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
    res.status(500).send({ message: error.message });
  }
});

// =========================================================
// APPROVE REQUEST
// =========================================================


app.patch(
  "/requests/approve/:id",
  verifyFBToken,
  verifyHR,
  async (req, res) => {
    try {
      const id = req.params.id;

      const request = await requestsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!request) {
        return res.status(404).send({ message: "Request Not Found" });
      }

      if (request.requestStatus === "approved") {
        return res.status(400).send({ message: "Already Approved" });
      }

      const asset = await assetsCollection.findOne({
        assetId: request.assetId,
      });

      if (!asset) {
        return res.status(404).send({ message: "Asset Not Found" });
      }

      if (asset.availableQuantity <= 0) {
        return res.status(400).send({ message: "Asset Out Of Stock" });
      }

      const hr = await usersCollection.findOne({
        email: request.hrEmail,
      });

      if (!hr) {
        return res.status(404).send({ message: "HR Not Found" });
      }

      const affiliationExists =
        await employeeAffiliationsCollection.findOne({
          employeeEmail: request.requesterEmail,
          hrEmail: request.hrEmail,
        });

      if (
        !affiliationExists &&
        hr.currentEmployees >= hr.packageLimit
      ) {
        return res
          .status(400)
          .send({ message: "Package Employee Limit Reached" });
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

      await assignedAssetsCollection.insertOne({
        assetId: request.assetId,
        assetName: request.assetName,
        assetType: request.assetType,
        assetImage: request.assetImage,
        employeeName: request.requesterName,
        employeeEmail: request.requesterEmail,
        hrEmail: request.hrEmail,
        companyName: request.companyName,
        assignmentDate: new Date(),
        status: "assigned",
      });

      await assetsCollection.updateOne(
        { assetId: request.assetId },
        {
          $inc: { availableQuantity: -1 },
        }
      );

      if (!affiliationExists) {
        await employeeAffiliationsCollection.insertOne({
          employeeEmail: request.requesterEmail,
          employeeName: request.requesterName,
          hrEmail: request.hrEmail,
          companyName: request.companyName,
          affiliationDate: new Date(),
          status: "active",
        });

        await usersCollection.updateOne(
          { email: request.hrEmail },
          {
            $inc: { currentEmployees: 1 },
          }
        );
      }

      return res.send({
        success: true,
        message: "Request Approved",
      });
    } catch (error) {
      console.error("APPROVE ERROR:", error);

      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);

// =========================================================
// REJECT REQUEST
// =========================================================

app.patch(
  "/requests/reject/:id",
  verifyFBToken,
  verifyHR,
  async (req, res) => {

    try {

      const id = req.params.id;

      const result = await requestsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            requestStatus: "rejected",
          },
        }
      );

      res.send(result);

    } catch (error) {

      res.status(500).send({
        message: error.message,
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
      return res.status(404).send({ message: "Asset Not Found" });
    }

    // ❌ prevent double return
    if (assignedAsset.returnStatus === "Returned") {
      return res.status(400).send({ message: "Already Returned" });
    }

    // ❌ only assigned assets can be returned


    if (!assignedAsset.returnStatus || assignedAsset.returnStatus !== "Assigned") {
  return res.status(400).send({ message: "Invalid status" });
}

    // 1. update assigned asset
    await assignedAssetsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          returnStatus: "Returned",
          returnDate: new Date(),
        },
      }
    );

    // 2. increase inventory
    await assetsCollection.updateOne(
      { _id: new ObjectId(assignedAsset.assetId) },
      {
        $inc: { availableQuantity: 1 },
      }
    );

    res.send({
      success: true,
      message: "Asset Returned Successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.post("/assign-direct", verifyFBToken, async (req, res) => {
  try {
    const { assetId, employeeEmail } = req.body;

    // check asset
    const asset = await assetsCollection.findOne({
      _id: new ObjectId(assetId),
    });

    if (!asset || asset.availableQuantity <= 0) {
      return res.status(400).send({ message: "Not available" });
    }

    // 1. create affiliation if first time
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
app.post("/asset-request", 
verifyFBToken, 
async (req, res) => {
  try {
    const { assetId } = req.body;
    //const email = req.user.email;
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

    // 1. ensure affiliation
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

    // 2. assign asset
    await assignedAssetsCollection.insertOne({
      assetId: request.assetId,
      employeeEmail: request.employeeEmail,
      assignmentType: "request",
      returnStatus: "Assigned",
      assignmentDate: new Date(),
    });

    // 3. update stock
    await assetsCollection.updateOne(
      { _id: new ObjectId(request.assetId) },
      {
        $inc: { availableQuantity: -1 },
      }
    );

    // 4. update request
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

    app.post(
      "/create-checkout-session",
      verifyFBToken,
      async (req, res) => {
        try {
          const { packageName, price, employeeLimit, hrEmail } = req.body;
          const clientURL = process.env.CLIENT_URL || "asset-management-server-flax.vercel.app";

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

            // success_url: `${clientURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            // cancel_url: `${clientURL}/payment-cancel`,
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

            metadata: {
              packageName,
              employeeLimit: String(employeeLimit),
              hrEmail,
            },
          });

          res.send({ url: session.url });

        } catch (error) {
          console.log("Stripe Error:", error.message);

          res.status(500).send({
            message: error.message,
          });
        }
      }
    );

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

        // update hr package

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

// ================= GET MY AFFILIATED COMPANIES =================


app.get("/my-companies", 
verifyFBToken,
 async (req, res) => {
  try {
    const result = await employeeAffiliationsCollection
      .find({
        status: "active"
      })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ================= TEAM MEMBERS =================

app.get("/team-members", 
verifyFBToken,
 async (req, res) => {
  try {
    const { companyName } = req.query;

    if (!companyName) {
      return res.status(400).send({
        message: "companyName required",
      });
    }


    const affiliations = await employeeAffiliationsCollection
      .find({
        companyName,
        status: "active",
      })
      .toArray();

    const emails = affiliations.map(
      (employee) => employee.employeeEmail
    );

    const users = await usersCollection
      .find({
        email: { $in: emails },
      })
      .toArray();

    const result = users.map((user) => ({
      _id: user._id,
      name: user.name || "No Name",
      email: user.email,
      profileImage: user.profileImage || "",
      role: user.role || "employee",
    }));

    res.send(result);
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

    // 1. get company employees
    const affiliations = await employeeAffiliationsCollection
      .find({ companyName, status: "active" })
      .toArray();

    const emails = affiliations.map(emp => emp.employeeEmail);

    // 2. get users
    const users = await usersCollection
      .find({ email: { $in: emails } })
      .toArray();

    // 3. filter birthdays
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

// hr dashboard

app.get("/dashboard/stats", 
verifyFBToken, 
verifyHR, async (req, res) => {
  try {
    const hrEmail = req.email;

    // Total Assets
    const totalAssets = await assetsCollection.countDocuments({
      hrEmail,
    });

    // Employees
    const employees = await employeeAffiliationsCollection.countDocuments({
      hrEmail,
    });

    // Pending Requests
    const pendingRequests = await requestsCollection.countDocuments({
      hrEmail,
      requestStatus: "pending",
    });

    // Approved Assets
    const approvedAssets = await requestsCollection.countDocuments({
      hrEmail,
      requestStatus: "approved",
    });

    // Returnable / Non-returnable
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


