import { client } from "@/utils/apolloClient"
import { FollowersDocument, FollowersQuery, FollowersRequest } from "../graphql/generated"


export async function getProfileFollowers(request : FollowersRequest) {
    try {
        const { data, loading, error } = await client.query({
            query: FollowersDocument,
            variables: {
                request
            }
        });

        return data as FollowersQuery
    } catch (error) {
        console.log(error)
    }
}