import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/database.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export async function googleLogin(
  req: Request,
  res: Response
) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    const email = payload.email;
    const name = payload.name ?? null;
    const picture = payload.picture ?? null;

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        picture,
      },
      create: {
        email,
        name,
        picture,
      },
    });

    return res.json({
      success: true,
      message: "Google login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid Google credential",
    });
  }
}