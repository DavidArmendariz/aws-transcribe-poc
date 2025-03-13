import { fetchAuthSession } from "@aws-amplify/auth";

export async function getAWSCredentials() {
  try {
    // Retrieves temporary credentials for the unauthenticated user
    const session = await fetchAuthSession();
    console.log("Temporary AWS session:", session);
    return {
      accessKeyId: session.credentials?.accessKeyId || "",
      secretAccessKey: session.credentials?.secretAccessKey || "",
    };
  } catch (error) {
    console.error("Error fetching credentials", error);
  }
}
