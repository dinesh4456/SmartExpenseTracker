import { useEffect, useState, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProfileForm from "./ProfileForm";
import { getProfile, getProfileImageUrl, uploadProfileImageFile } from "../../services/profileService";
import { FaCamera, FaImage, FaSpinner, FaCheckCircle } from "react-icons/fa";
import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setProfile(data);
        } catch (error) {
            console.error("Failed to load profile:", error);
            alert("Failed to load profile details.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("Image size exceeds 10MB limit. Please choose a smaller photo.");
            return;
        }

        try {
            setUploadingImage(true);
            setStatusMessage("Uploading photo...");

            await uploadProfileImageFile(file);

            setStatusMessage("Profile photo updated successfully!");
            setTimeout(() => setStatusMessage(""), 4000);

            await loadProfile();
        } catch (err) {
            console.error("Profile photo upload failed:", err);
            alert(err.response?.data?.message || err.message || "Failed to upload photo. Please try again.");
            setStatusMessage("");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const fallbackAvatar = profile
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || "User")}&background=2563EB&color=fff&size=150`
        : "";

    return (
        <MainLayout>
            <div className="container-fluid px-0" style={{ maxWidth: "860px", margin: "0 auto" }}>
                <h2 className="mb-4 fw-bold text-dark">User Profile</h2>

                {loading ? (
                    <div className="card profile-card p-5 text-center">
                        <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
                        <p className="text-muted mb-0">Loading your profile details...</p>
                    </div>
                ) : profile ? (
                    <div className="card profile-card">
                        <div className="profile-header-banner"></div>

                        <div className="card-body px-4 px-md-5 pb-5">
                            {/* Hidden gallery / camera file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />

                            {/* Avatar Section */}
                            <div className="text-center mb-4">
                                <div
                                    className="profile-avatar-container"
                                    onClick={handleAvatarClick}
                                    title="Click to choose a photo from your gallery / files"
                                >
                                    <img
                                        src={getProfileImageUrl(profile.profileImage, profile.fullName)}
                                        alt={profile.fullName || "User Profile"}
                                        className="profile-avatar-img"
                                        onError={(e) => {
                                            if (e.target.src !== fallbackAvatar) {
                                                e.target.src = fallbackAvatar;
                                            }
                                        }}
                                    />
                                    <div className="profile-avatar-badge">
                                        {uploadingImage ? <FaSpinner className="fa-spin" /> : <FaCamera />}
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <button
                                        type="button"
                                        className="profile-gallery-btn"
                                        onClick={handleAvatarClick}
                                        disabled={uploadingImage}
                                    >
                                        <FaImage className="text-primary" />
                                        {uploadingImage ? "Uploading Photo..." : "Choose from Gallery / Photos"}
                                    </button>
                                </div>

                                {statusMessage && (
                                    <div className="alert alert-success d-inline-flex align-items-center gap-2 py-2 px-3 mt-3 mb-0">
                                        <FaCheckCircle /> {statusMessage}
                                    </div>
                                )}

                                <h3 className="mt-3 mb-1 fw-bold text-dark">{profile.fullName}</h3>
                                <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
                                    {profile.role || "USER"}
                                </span>
                            </div>

                            {/* Account Details Pills */}
                            <div className="row g-3 mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="profile-info-pill">
                                        <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: "11px" }}>Email Address</small>
                                        <span className="fw-semibold text-dark text-break">{profile.email}</span>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="profile-info-pill">
                                        <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: "11px" }}>Phone Number</small>
                                        <span className="fw-semibold text-dark">{profile.phoneNumber || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="mb-4 fw-bold text-dark">Edit Profile Details</h4>

                            <ProfileForm
                                profile={profile}
                                onSuccess={loadProfile}
                                onOpenGallery={handleAvatarClick}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </MainLayout>
    );
}

export default Profile;