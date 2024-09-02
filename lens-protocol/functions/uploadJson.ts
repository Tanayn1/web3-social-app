import { client } from "@/utils/apolloClient"
import { OnchainSetProfileMetadataRequest, SetProfileMetadataDocument, SetProfileMetadataMutationResult, SetProfileMetadataMutationVariables } from "../graphql/generated"


export async function uploadJson(request: OnchainSetProfileMetadataRequest) {
    try {
        const { data, errors } = await client.mutate({
            mutation: SetProfileMetadataDocument,
            variables: {
                request
            }
        });

        console.log("set metadata response", data);
        return data as SetProfileMetadataMutationResult
    } catch (error) {
        console.log(error)
    }
}