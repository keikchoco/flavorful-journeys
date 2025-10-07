import { database } from "@/utils/firebase.browser";
import { ref, get, DataSnapshot } from "firebase/database";

export async function index(path: string = "users"): Promise<any[]> {
  const usersRef = ref(database, path);
  const snapshot: DataSnapshot = await get(usersRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    // Convert object to array with keys as IDs
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  
  return [];
}