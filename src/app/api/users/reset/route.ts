// Import necessary modules and functions
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();


export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json();
    const { email, emailType } = reqBody;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user doesn't exist, return error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a hashed token for the reset password
    const hashedToken = await bcryptjs.hash(user._id.toString(), 10);

    // Update user's forgotPasswordToken and forgotPasswordTokenExpiry
    await User.findByIdAndUpdate(user._id, {
      $set: {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // Expiry in 1 hour
      },
    });

    // Send reset password email
    await sendEmail({ email, emailType, userId: user._id });

    // Return success response
    return NextResponse.json({
      message: "Reset password email sent successfully",
      success: true,
    });
  } catch (error: any) {
    // Return error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
