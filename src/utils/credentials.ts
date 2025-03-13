import { fetchAuthSession } from "@aws-amplify/auth";

export async function getAWSCredentials() {
  try {
    // Retrieves temporary credentials for the unauthenticated user
    const session = await fetchAuthSession();
    return {
      accessKeyId: session.credentials?.accessKeyId || "",
      secretAccessKey: session.credentials?.secretAccessKey || "",
      sessionToken: session.credentials?.sessionToken || "",
    };
  } catch (error) {
    console.error("Error fetching credentials", error);
  }
}
