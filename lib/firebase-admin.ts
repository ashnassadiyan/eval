import path from "path";
import fs from "fs";

export function getFirebaseServiceAccount() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH;
  if (serviceAccountPath) {
    const jsonPath = path.resolve(process.cwd(), serviceAccountPath);
    if (fs.existsSync(jsonPath)) {
      try {
        const content = fs.readFileSync(jsonPath, "utf-8");
        return JSON.parse(content);
      } catch (e) {
        console.warn("Could not read service account file at:", jsonPath);
      }
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || "",
  };
}
