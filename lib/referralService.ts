import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import Firestore database instance

// Function to save a referral for a user
export async function saveReferral(userId: string, referrerId: string) {
  try {
    const referralRef = doc(db, 'referrals', userId); // Reference to the referral document using userId as the document ID
    const referralDoc = await getDoc(referralRef); // Fetch the document from Firestore

    if (referralDoc.exists()) {
      // If the document already exists, update it
      const existingData = referralDoc.data(); // Get existing referral data
      const referrals = existingData.referrals || []; // Ensure referrals is an array, default to empty if missing

      if (!referrals.includes(referrerId)) { // Avoid adding duplicate referrerId
        referrals.push(referrerId); // Add new referrerId to the array
        await setDoc(referralRef, { ...existingData, referrals }, { merge: true }); // Update the document with the new referral list
      }
    } else {
      // If the document does not exist, create a new one
      const newReferral = {
        userId, // Store userId for reference
        referrals: [referrerId], // Start the referrals list with the first referrer
        createdAt: new Date().toISOString(), // Store timestamp of creation
      };
      await setDoc(referralRef, newReferral); // Save the new referral document in Firestore
    }
  } catch (error) {
    console.error('Error saving referral:', error); // Log any errors that occur
  }
}

// Function to retrieve a list of referrals for a given userId
export async function getReferrals(userId: string): Promise<string[]> {
  try {
    const referralRef = doc(db, 'referrals', userId); // Reference to the user's referral document
    const referralDoc = await getDoc(referralRef); // Fetch the document from Firestore

    if (!referralDoc.exists()) {
      return []; // Return an empty array if the document does not exist
    }

    const data = referralDoc.data(); // Extract data from the document
    return data.referrals || []; // Return the referrals array or an empty array if not found
  } catch (error) {
    console.error('Error getting referrals:', error); // Log any errors that occur
    return []; // Return an empty array in case of an error
  }
}

// Function to find the referrer for a specific userId
export async function getReferrer(userId: string): Promise<string | null> {
  try {
    const referralsQuery = query(
      collection(db, 'referrals'), // Reference to the referrals collection
      where('referrals', 'array-contains', userId) // Query for documents where referrals array contains userId
    );
    const referrerSnapshot = await getDocs(referralsQuery); // Execute the query and get matching documents

    return referrerSnapshot.empty
      ? null // Return null if no documents are found
      : referrerSnapshot.docs[0].id; // Return the first matching document ID as referrerId
  } catch (error) {
    console.error('Error getting referrer:', error); // Log any errors that occur
    return null; // Return null in case of an error
  }
}
