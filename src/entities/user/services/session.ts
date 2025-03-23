import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionEntity } from "../domain";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserId } from "@/kernel/ids";
import { routes } from "@/kernel/routes";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionEntity) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

async function decrypt(session: string = "") {
  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionEntity;
  } catch (error) {
    console.log("Failed to verify: ", error);
  }
}

async function createSession(userId: UserId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
  });
}

async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect(routes.signIn());
}

const getSessionCookies = () => cookies().then((c) => c.get("session")?.value);

const verifySession = async (getCookies = getSessionCookies) => {
  const cookie = await getCookies();
  const session = (await decrypt(cookie)) as SessionEntity;

  if (!session.userId) {
    redirect(routes.signIn());
  }

  return { userId: session.userId };
};

export const sessionService = {
  createSession,
  deleteSession,
  verifySession,
  decrypt,
};
