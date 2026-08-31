import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  deleteAccount,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../services/userApi";

const Settings = () => {
  const navigate = useNavigate();

  // ================= USER =================

  const storedUser = localStorage.getItem("user");

  const user = (() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const userName = user?.name || "Ahmed Hassan";
  const userEmail = user?.email || "No email";
  const userRole = user?.role || "Owner";

  // ================= STATES =================

  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto || null
  );

  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ================= PROFILE PHOTO URL =================

  const getProfilePhotoUrl = () => {
    if (!profilePhoto) return null;

    if (profilePhoto.startsWith("http")) {
      return profilePhoto;
    }

    return `http://localhost:5000${profilePhoto}`;
  };

  // ================= UPLOAD PROFILE PHOTO =================

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPhotoError("");
    setPhotoSuccess("");

    // Check file type

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image.");
      return;
    }

    // Check file size - 5MB

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 5MB.");
      return;
    }

    try {
      setPhotoLoading(true);

      const response = await uploadProfilePhoto(file);

      const updatedUser = response.user;

      setProfilePhoto(updatedUser.profilePhoto || null);

      // Update localStorage user

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          profilePhoto: updatedUser.profilePhoto || null,
        })
      );

      setPhotoSuccess(
        response.message || "Profile photo uploaded successfully."
      );
    } catch (error) {
      setPhotoError(
        error.message || "Failed to upload profile photo."
      );
    } finally {
      setPhotoLoading(false);

      // Allow selecting the same image again

      e.target.value = "";
    }
  };

  // ================= DELETE PROFILE PHOTO =================

  const handleDeletePhoto = async () => {
    setPhotoError("");
    setPhotoSuccess("");

    try {
      setPhotoLoading(true);

      const response = await deleteProfilePhoto();

      setProfilePhoto(null);

      // Update localStorage user

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          profilePhoto: null,
        })
      );

      setPhotoSuccess(
        response.message || "Profile photo deleted successfully."
      );
    } catch (error) {
      setPhotoError(
        error.message || "Failed to delete profile photo."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  // ================= CHANGE PASSWORD =================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    // Check empty fields

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    // Check password length

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    // Check password match

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      const response = await changePassword(
        currentPassword,
        newPassword
      );

      setPasswordSuccess(
        response.message || "Password changed successfully."
      );

      // Clear fields

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error.message || "Failed to change password."
      );
    }
  };

  // ================= DELETE ACCOUNT =================

  const handleDeleteAccount = async () => {
    setDeleteError("");

    try {
      const response = await deleteAccount();

      alert(
        response.message || "Account deleted successfully."
      );

      // Remove logged-in user data

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Go back to login

      navigate("/login");
    } catch (error) {
      setDeleteError(
        error.message || "Failed to delete account."
      );
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center px-5 md:px-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            ←
          </button>

          <div>

            <h1 className="text-xl font-semibold">
              Account Settings
            </h1>

            <p className="text-sm text-slate-500">
              Manage your WorkNest account
            </p>

          </div>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-4xl mx-auto p-5 md:p-8">

        {/* ================= ACCOUNT INFORMATION ================= */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-lg font-semibold">
              Account Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your basic WorkNest account information.
            </p>

          </div>

          <div className="p-6 space-y-6">

            {/* ================= PROFILE PHOTO ================= */}

            <div>

              <label className="block text-sm text-slate-400 mb-3">
                Profile Photo
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                      
                {/* Avatar */}

                <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-2xl font-bold shrink-0">

                  {profilePhoto ? (
                    <img
                      src={getProfilePhotoUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}

                </div>

                {/* Photo Controls */}

                <div className="flex flex-col gap-3">

                  <div className="flex flex-wrap gap-3">

                    {/* Add / Change Photo */}

                    <label
                      className={`px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer ${
                        photoLoading
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >

                      {photoLoading
                        ? "Uploading..."
                        : profilePhoto
                        ? "Change Photo"
                        : "Add Photo"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={photoLoading}
                      />

                    </label>

                    {/* Delete Photo */}

                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        disabled={photoLoading}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-medium disabled:opacity-50"
                      >
                        Delete Photo
                      </button>
                    )}

                  </div>

                  <p className="text-xs text-slate-600">
                    JPG, PNG or other image formats. Maximum size
                    5MB.
                  </p>

                </div>

              </div>

              {/* Photo Error */}

              {photoError && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {photoError}
                </div>
              )}

              {/* Photo Success */}

              {photoSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  {photoSuccess}
                </div>
              )}

            </div>

            {/* ================= NAME ================= */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Name
              </label>

              <input
                type="text"
                value={userName}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 outline-none"
              />

            </div>

            {/* ================= EMAIL ================= */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Email
              </label>

              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 outline-none"
              />

            </div>

            {/* ================= ROLE ================= */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Role
              </label>

              <input
                type="text"
                value={userRole}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 outline-none capitalize"
              />

            </div>

          </div>

        </section>

        {/* ================= CHANGE PASSWORD ================= */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-lg font-semibold">
              Change Password
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your account password.
            </p>

          </div>

          <div className="p-6">

            {!showPasswordForm ? (

              <button
                onClick={() => {
                  setShowPasswordForm(true);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                Change Password
              </button>

            ) : (

              <form
                onSubmit={handleChangePassword}
                className="space-y-5"
              >

                {/* Current Password */}

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  />

                </div>

                {/* New Password */}

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  />

                  <p className="text-xs text-slate-600 mt-2">
                    Password must contain at least 6 characters.
                  </p>

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  />

                </div>

                {/* Error */}

                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {passwordError}
                  </div>
                )}

                {/* Success */}

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                {/* Buttons */}

                <div className="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                  >
                    Update Password
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            )}

          </div>

        </section>

        {/* ================= DANGER ZONE ================= */}

        <section className="bg-slate-900 border border-red-500/20 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-red-500/10">

            <h2 className="text-lg font-semibold text-red-400">
              Danger Zone
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Permanently delete your WorkNest account.
            </p>

          </div>

          <div className="p-6">

            {!showDeleteConfirm ? (

              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setDeleteError("");
                }}
                className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-medium"
              >
                Delete Account
              </button>

            ) : (

              <div className="space-y-4">

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">

                  <h3 className="font-semibold text-red-400">
                    Are you sure?
                  </h3>

                  <p className="text-sm text-slate-400 mt-2">
                    This action will permanently delete your
                    WorkNest account. This cannot be undone.
                  </p>

                </div>

                {/* Delete Error */}

                {deleteError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {deleteError}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={handleDeleteAccount}
                    className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
                  >
                    Yes, Delete Account
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteError("");
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
};

export default Settings;
