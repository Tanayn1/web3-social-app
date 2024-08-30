import { client } from "../../utils/apolloClient";
import { AuthenticateDocument, ChallengeDocument, ChallengeRequest, RefreshDocument, RefreshMutation, RefreshRequest, RevokeAuthenticationDocument, RevokeAuthenticationRequest, SignedAuthChallenge, useChallengeQuery } from "../graphql/generated";


export async function challenge(request: ChallengeRequest) {
    const { data, error, loading } = await client.query({
        query: ChallengeDocument,
        variables: {
          request
        }
    });
    
   return data.challenge;

}

export async function authenticate(request: SignedAuthChallenge) {
    const response = await client.mutate({
        mutation: AuthenticateDocument,
        variables: {
            request
        }
    });
    return response.data.authenticate;
}

export async function refresh(request: RefreshRequest) {
    const { data }  = await client.mutate({
        mutation: RefreshDocument,
        variables: {
            request
        }
    });


    return data.refresh
}

export async function logout(request: RevokeAuthenticationRequest) {
    const { data } = await client.mutate({
        mutation: RevokeAuthenticationDocument,
        variables: {
            request
        }
    });

    return data
}