// Import necessary modules and functions
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Establish database connection
connect();

// Define the POST function
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const reqBody = await request.json();
    const { token, newPassword } = reqBody;

    // Find the user by reset password token and check if token is still valid
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    // If user doesn't exist or token is expired, return error
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update user's password and clear reset password related fields
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    // Return success response
    return NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error: any) {
    // Return error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
