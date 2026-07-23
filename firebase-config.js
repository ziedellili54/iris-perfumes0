/**
 * 🔐 Firebase Configuration - SECURE SETUP
 * 
 * IMPORTANT: Replace these values with your actual Firebase project credentials
 * Get them from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general
 */

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

/**
 * 🔐 SECURE AUTHENTICATION FUNCTIONS
 * All passwords are automatically hashed by Firebase (bcrypt internally)
 */

// Admin Registration (run once to create admin account)
async function createAdminAccount(email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Set admin role in Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      role: 'admin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: 'Administrator'
    });
    
    console.log("✅ Admin account created successfully:", user.email);
    return user;
  } catch (error) {
    console.error("❌ Error creating admin account:", error.message);
    throw error;
  }
}

// Customer Registration with Google OAuth
async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Check if user document exists, if not create it
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        role: 'customer',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    }
    
    console.log("✅ User signed in with Google:", user.email);
    return user;
  } catch (error) {
    console.error("❌ Google sign-in error:", error.message);
    throw error;
  }
}

// Admin Login with Email/Password (password hashed automatically)
async function adminLogin(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Verify admin role
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      await auth.signOut();
      throw new Error("Access denied: Admin privileges required");
    }
    
    console.log("✅ Admin logged in:", user.email);
    return user;
  } catch (error) {
    console.error("❌ Admin login error:", error.message);
    throw error;
  }
}

// Logout
async function logout() {
  try {
    await auth.signOut();
    console.log("✅ User logged out");
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    throw error;
  }
}

// Check if user is admin
async function isAdmin(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    return userDoc.exists && userDoc.data().role === 'admin';
  } catch (error) {
    console.error("❌ Error checking admin status:", error);
    return false;
  }
}

// Get current user
function getCurrentUser() {
  return auth.currentUser;
}

// Listen to auth state changes
function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

/**
 * 🗄️ FIRESTORE DATABASE FUNCTIONS
 * Secure CRUD operations
 */

// Get all products (public)
async function getAllProducts() {
  try {
    const snapshot = await db.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

// Add/Update product (admin only)
async function saveProduct(productData, productId = null) {
  try {
    const user = getCurrentUser();
    if (!user || !(await isAdmin(user.uid))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    if (productId) {
      // Update existing product
      await db.collection('products').doc(productId).update({
        ...productData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ Product updated:", productId);
    } else {
      // Create new product
      const docRef = await db.collection('products').add({
        ...productData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ Product created:", docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error("❌ Error saving product:", error);
    throw error;
  }
}

// Delete product (admin only)
async function deleteProduct(productId) {
  try {
    const user = getCurrentUser();
    if (!user || !(await isAdmin(user.uid))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    await db.collection('products').doc(productId).delete();
    console.log("✅ Product deleted:", productId);
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    throw error;
  }
}

// Create order
async function createOrder(orderData) {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User must be logged in to create order");
    }
    
    const order = {
      userId: user.uid,
      userEmail: user.email,
      ...orderData,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('orders').add(order);
    console.log("✅ Order created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw error;
  }
}

// Get user orders
async function getUserOrders(userId = null) {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User must be logged in");
    }
    
    const targetUserId = userId || user.uid;
    
    // Check if admin or own orders
    if (targetUserId !== user.uid && !(await isAdmin(user.uid))) {
      throw new Error("Unauthorized: Cannot view other users' orders");
    }
    
    const snapshot = await db.collection('orders')
      .where('userId', '==', targetUserId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return [];
  }
}

// Get all orders (admin only)
async function getAllOrders() {
  try {
    const user = getCurrentUser();
    if (!user || !(await isAdmin(user.uid))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    const snapshot = await db.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    return [];
  }
}

/**
 * 🔄 DATA MIGRATION FUNCTION
 * Migrate existing data.json to Firestore
 */
async function migrateDataToFirestore(jsonData) {
  try {
    const user = getCurrentUser();
    if (!user || !(await isAdmin(user.uid))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    console.log("🔄 Starting data migration...");
    
    // Migrate products
    const batch = db.batch();
    let count = 0;
    
    for (const product of jsonData.perfs) {
      const productRef = db.collection('products').doc(product.id.toString());
      batch.set(productRef, {
        ...product,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      count++;
    }
    
    await batch.commit();
    console.log(`✅ Migrated ${count} products to Firestore`);
    
    return { success: true, count };
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  }
}

// Export functions for global use
if (typeof window !== 'undefined') {
  window.FirebaseAuth = {
    createAdminAccount,
    signInWithGoogle,
    adminLogin,
    logout,
    isAdmin,
    getCurrentUser,
    onAuthStateChanged
  };
  
  window.FirestoreDB = {
    getAllProducts,
    saveProduct,
    deleteProduct,
    createOrder,
    getUserOrders,
    getAllOrders,
    migrateDataToFirestore
  };
}

console.log("🔐 Secure Firebase configuration loaded");
