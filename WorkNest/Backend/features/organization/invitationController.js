const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Invitation = require("../../models/Invitation");
const User = require("../../models/User");
const Organization = require("../../models/Organization");

// ================= EMAIL TRANSPORTER =================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= CREATE INVITATION =================

const createInvitation = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Check current user
    if (!currentUser || !currentUser.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only Owner and Manager can invite
    if (!["owner", "manager"].includes(currentUser.role)) {
      return res.status(403).json({
        message: "Only owner or manager can invite members",
      });
    }

    const { email, role } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Member email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate role
    const invitationRole = role || "employee";

    if (!["manager", "employee"].includes(invitationRole)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser && existingUser.organization) {
      return res.status(400).json({
        message: "User already belongs to an organization",
      });
    }

    // Check existing active invitation
    const existingInvitation = await Invitation.findOne({
      email: normalizedEmail,
      organization: currentUser.organization,
      acceptedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvitation) {
      return res.status(400).json({
        message: "An active invitation already exists for this email",
      });
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString("hex");

    // Invitation expires after 24 hours
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // Create invitation
    const invitation = await Invitation.create({
      email: normalizedEmail,
      organization: currentUser.organization,
      invitedBy: currentUser._id,
      role: invitationRole,
      token: invitationToken,
      expiresAt,
    });

    // Invitation URL
    const invitationUrl =
      `http://localhost:5173/accept-invitation?token=${invitationToken}`;

    // Get organization
    const organization = await Organization.findById(
      currentUser.organization
    );

    // Send invitation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "You're invited to join WorkNest",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>You're invited to join WorkNest</h2>

          <p>
            <strong>${currentUser.name}</strong> has invited you to join
            <strong>${organization?.name || "their organization"}</strong>
            as a <strong>${invitationRole}</strong>.
          </p>

          <p>
            Click the button below to accept your invitation:
          </p>

          <a
            href="${invitationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Accept Invitation
          </a>

          <p style="margin-top: 20px;">
            This invitation will expire in 24 hours.
          </p>

          <p>
            If you did not expect this invitation, you can safely ignore
            this email.
          </p>
        </div>
      `,
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ACCEPT INVITATION =================

const acceptInvitation = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    // Check token
    if (!token) {
      return res.status(400).json({
        message: "Invitation token is required",
      });
    }

    // Find valid invitation
    const invitation = await Invitation.findOne({
      token,
      acceptedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(400).json({
        message: "Invitation is invalid or has expired",
      });
    }

    // Check organization
    const organization = await Organization.findById(
      invitation.organization
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      email: invitation.email,
    });

    // ================= EXISTING USER =================

    if (user) {
      // User already belongs to an organization
      if (user.organization) {
        return res.status(400).json({
          message: "This user already belongs to an organization",
        });
      }

      user.organization = invitation.organization;
      user.role = invitation.role;

      // Invitation confirms ownership of this email
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpires = null;

      await user.save();
    }

    // ================= NEW USER =================

    else {
      // Name and password required for new account
      if (!name || !password) {
        return res.status(400).json({
          message: "Name and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        name,
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
        organization: invitation.organization,

        // Invitation link verifies the email
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });
    }

    // Mark invitation as accepted
    invitation.acceptedAt = new Date();
    await invitation.save();

    res.status(200).json({
      message: "Invitation accepted successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= EXPORT =================

module.exports = {
  createInvitation,
  acceptInvitation,
};

