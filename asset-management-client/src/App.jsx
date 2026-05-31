
import './App.css'

function App() {


  return (
    <>
   
    </>
  )
}

export default App

// app.post('/users', async (req, res) => { const user = req.body; user.role = 'user'; user.createdAt = new Date(); 
//   const userExists = await userCollection.findOne({ email: user.email }); 
//   if (userExists) { return res.send({ message: 'user exists' }); } c
//   const result = await userCollection.insertOne(user); res.send(result); });
//    //middle admin before allowing admin activity with database 
//    //const 
//    const email = req.email;
//     console.log("Admin Check Email:", email); 
//    const query = { email }; 
//    const user = await userCollection.findOne(query); 
//    if (!user || user.role !== 'admin') { return res.status(403).send({ message: 'forbidden access' }) } 
//    next(); 