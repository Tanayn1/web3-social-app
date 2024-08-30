import { client } from "../../utils/apolloClient";
import { HandleToProfileIdDocument, useHandleToProfileIdQuery } from "../graphql/generated";

export async function handleToProfileId(forHandle: string) {
   try {
    const { data, error, loading } = await client.query({
        query: HandleToProfileIdDocument,
        variables: {
            request: {
                forHandle: `lens/${forHandle}`
            }
        }
      });
      
        if (loading) {
            console.log("Loading...");
        }
        // Check if there was an error
        if (error) {
            console.error("Error fetching profile ID:", error);
            return null;
        }

        if (data) {
        console.log("Profile Id", data.profile.id);
        return data.profile.id;

        }


   } catch (error) {
    console.log(error)
   }
 
}
