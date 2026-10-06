import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

import { auth, db } from "../../config/firebase";

function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AUTH USER:", user);

      if (!user) {
        console.log("No authenticated user found.");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log("Checking admin document for UID:", user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        console.log("User document exists:", userSnapshot.exists());

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          console.log("User Firestore data:", userData);
          console.log("User role:", userData.role);

          if (userData.role === "admin") {
            console.log("ADMIN VERIFIED ✅");
            setIsAdmin(true);
          } else {
            console.log("User is NOT an admin.");
            setIsAdmin(false);
          }
        } else {
          console.log("Admin user document does not exist.");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-mark">Z</div>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;