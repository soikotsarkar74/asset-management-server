// import React, { useEffect } from 'react';
// import { AuthContext } from './AuthContext';
// import {createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
//   signOut} from 'firebase/auth';
// import {auth} from '../firebase/firebase.init';
// const provider = new GoogleAuthProvider();
// const AuthProvider = ({children}) => {
//     const registerUser = (email, password) => {
//     setLoading(true);
//     return createUserWithEmailAndPassword(auth, email, password);
     
//   };
//     const signIn = (email, password) => {
//     setLoading(true);
//     return signInWithEmailAndPassword(auth, email, password);
//   };
// const googleLogin = () => {
//     return signInWithPopup(auth, provider);
//   };
//   const logOut = ()=>{
//     setLoading(true);
//     return signOut(auth)
//   }
//   useEffect( ()=>{
//    const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
//   registerUser(currentUser);
//   setLoading(false)
//    })
//    return ()=>{
//     unSubscribe();
//    }
//   })
//   const authInfo = {
// registerUser,
// signIn,
// googleLogin,
// loading,
// logOut,

//   }
//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// }; 

// export default AuthProvider;




// import React, { useEffect, useState, useCallback } from 'react';
// import { AuthContext } from './AuthContext';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
//   signOut,
//   updateProfile
// } from 'firebase/auth';
// import { auth } from '../firebase/firebase.init';

// const googleProvider = new GoogleAuthProvider();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);


//   const handleToken = async (firebaseUser) => {
//     if (!firebaseUser) return null;
    
//     try {
//       const token = await firebaseUser.getIdToken();
//       localStorage.setItem('accessToken', token);
//       return token;
//     } catch (error) {
//       console.error('Token error:', error);
//       return null;
//     }
//   };


//   const prepareUserData = useCallback(async (firebaseUser) => {
//     if (!firebaseUser) return null;
    
//     const token = await handleToken(firebaseUser);
//     return {
//       ...firebaseUser,
//       accessToken: token,
//       email: firebaseUser.email,
//       displayName: firebaseUser.displayName,
//       photoURL: firebaseUser.photoURL,
//       uid: firebaseUser.uid
//     };
//   }, []);


//   const registerUser = useCallback(async (email, password) => {
//     setLoading(true);
//     try {
//       const result = await createUserWithEmailAndPassword(auth, email, password);
//       await handleToken(result.user);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   }, []);


//   const signIn = useCallback(async (email, password) => {
//     setLoading(true);
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       await handleToken(result.user);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   }, []);


//   const googleLogin = useCallback(async () => {
//     setLoading(true);
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       await handleToken(result.user);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logOut = useCallback(async () => {
//     setLoading(true);
//     try {
//       await signOut(auth);
//       localStorage.removeItem('accessToken');
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const updateUserProfile = useCallback((profile) => {
//     return updateProfile(auth.currentUser, profile);
//   }, []);


//   const refreshToken = useCallback(async () => {
//     if (!auth.currentUser) return null;
    
//     try {
//       const newToken = await auth.currentUser.getIdToken(true);
//       localStorage.setItem('accessToken', newToken);
      
//       setUser(prev => prev ? { ...prev, accessToken: newToken } : null);
//       return newToken;
//     } catch (error) {
//       console.error('Token refresh error:', error);
//       return null;
//     }
//   }, []);


//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const userData = await prepareUserData(currentUser);
//         setUser(userData);
//       } else {
//         localStorage.removeItem('accessToken');
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [prepareUserData]);


//   useEffect(() => {
//     if (!user) return;

//     const interval = setInterval(() => {
//       refreshToken();
//     }, 50 * 60 * 1000); 

//     return () => clearInterval(interval);
//   }, [user, refreshToken]);

//   const authInfo = {
//     user,
//     loading,
//     registerUser,
//     signIn,
//     googleLogin,
//     logOut,
//     updateUserProfile,
//     refreshToken
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// import React, { useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
//   signOut,
//   updateProfile,
// } from "firebase/auth";
// import { auth } from "../firebase/firebase.init";

// const googleProvider = new GoogleAuthProvider();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // TOKEN
//   const handleToken = async (firebaseUser) => {
//     if (!firebaseUser) return null;

//     const token = await firebaseUser.getIdToken();
//     localStorage.setItem("accessToken", token);
//     return token;
//   };

//   // LOGIN
//   const signIn = async (email, password) => {
//     setLoading(true);
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       await handleToken(result.user);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // REGISTER
//   const registerUser = async (email, password) => {
//     setLoading(true);
//     try {
//       const result = await createUserWithEmailAndPassword(auth, email, password);
//       await handleToken(result.user);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GOOGLE LOGIN
//   const googleLogin = async () => {
//     setLoading(true);
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       await handleToken(result.user);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // LOGOUT
//   const logOut = async () => {
//     setLoading(true);
//     try {
//       await signOut(auth);
//       localStorage.removeItem("accessToken");
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATE PROFILE (FIXED)
//   const updateUserProfile = (profile) => {
//     return updateProfile(auth.currentUser, profile);
//   };

//   // USER OBSERVER
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const token = await handleToken(currentUser);

//         setUser({
//           uid: currentUser.uid,
//           email: currentUser.email,
//           displayName: currentUser.displayName,
//           photoURL: currentUser.photoURL,
//           accessToken: token,
//         });
//       } else {
//         setUser(null);
//         localStorage.removeItem("accessToken");
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const authInfo = {
//     user,
//     loading,
//     signIn,
//     registerUser,
//     googleLogin,
//     logOut,
//     updateUserProfile, 
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // টোকেন হ্যান্ডেল করার ফাংশন
  const getToken = async (firebaseUser) => {
    if (!firebaseUser) return null;
    try {
      const token = await firebaseUser.getIdToken();
      console.log("✅ Token পাওয়া গেছে:", token.substring(0, 50) + "...");
      return token;
    } catch (error) {
      console.error("❌ Token পেতে সমস্যা:", error);
      return null;
    }
  };

  // লগইন
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await getToken(result.user);
      
      // ইউজার অবজেক্ট আপডেট
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        accessToken: token,
      });
      
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // রেজিস্টার
  const registerUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getToken(result.user);
      
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        accessToken: token,
      });
      
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // গুগল লগইন
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await getToken(result.user);
      
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        accessToken: token,
      });
      
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // লগআউট
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // প্রোফাইল আপডেট
  const updateUserProfile = async (profile) => {
    try {
      await updateProfile(auth.currentUser, profile);
      
      // ইউজার অবজেক্ট আপডেট
      setUser(prev => ({
        ...prev,
        displayName: profile.displayName || prev.displayName,
        photoURL: profile.photoURL || prev.photoURL,
      }));
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // ইউজার স্টেট মনিটর
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getToken(currentUser);
        
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          accessToken: token,
        });
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    signIn,
    registerUser,
    googleLogin,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;