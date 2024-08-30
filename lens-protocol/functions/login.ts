import { Wallet } from "ethers";
import { authenticate, challenge } from "./authentication";
import * as SecureStorage from "expo-secure-store"

export async function signIn(wallet: Wallet) {
    try {
        console.log("Wallet Address", wallet.address)
        const { id, text } = await challenge({signedBy: wallet.address});
        console.log("challenge", id, text)
        const signature = await wallet.signMessage(text);
        console.log("Signature", signature, id)
        const { accessToken, refreshToken, identityToken } = await authenticate({signature, id});
        console.log(accessToken, refreshToken, identityToken);
        await SecureStorage.setItemAsync('access_token', accessToken);
        await SecureStorage.setItemAsync('refresh_token', refreshToken);
        await SecureStorage.setItemAsync('identity_token', identityToken);
    } catch (error) {
        console.log(error);
    }


}