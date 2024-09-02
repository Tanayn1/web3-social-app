import { client } from "@/utils/apolloClient"
import { MetadataDocument, MetadataQuery, MetadataQueryResult, MetadataQueryVariables, ProfileRequest} from "../graphql/generated"


export async function handleToProfileMetadata(request: ProfileRequest ) {
    try {
        const { data, loading , error, errors } = await client.query({
            query: MetadataDocument,
            variables: {
                request
            }
        });
    
        return data as MetadataQuery
    } catch (error) {
        console.log(error)
    }
}