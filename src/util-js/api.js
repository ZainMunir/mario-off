export async function loginUser(creds) {
    const valid = {
        email: "1@mario.com",
        password: "p123"
    }

    if (creds.email != valid.email || creds.password != valid.password) {
        throw {
            message: "Wrong email or password",
            statusText: "Error",
            status: 401
        }
    }

    return {
        userId: 0
    }
}