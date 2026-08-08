import { useEffect, useState } from "react";

import { updateProfile } from "../../services/profileService";

function ProfileForm({ profile, onSuccess }) {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        profileImage: ""
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        if (profile) {

            setFormData({
                fullName: profile.fullName || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                password: "",
                profileImage: profile.profileImage || ""
            });

        }

    }, [profile]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        if (!formData.fullName.trim()) {
            setError("Full Name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (formData.password && formData.password.trim().length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setSubmitting(true);

        try {

            const updatedData = await updateProfile(formData);

            if (updatedData.token) {
                localStorage.setItem("token", updatedData.token);
            }

            if (updatedData.fullName) {
                localStorage.setItem("userName", updatedData.fullName);
            }

            alert("Profile Updated Successfully");

            onSuccess();

        } catch (err) {

            console.error(err);

            const message = err.response?.data?.message || err.message || "Failed to update profile";
            setError(message);
            alert(message);

        } finally {

            setSubmitting(false);

        }

    };

    return (

        <form onSubmit={handleSubmit}>

            {error && (
                <div className="alert alert-danger py-2">
                    {error}
                </div>
            )}

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Full Name <span className="text-danger">*</span>

                </label>

                <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Email Address <span className="text-danger">*</span>

                </label>

                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Phone Number

                </label>

                <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />

            </div>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    New Password

                </label>

                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Leave blank to keep current password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <small className="text-muted">
                    Min 6 characters. Leave empty to retain existing password.
                </small>

            </div>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Profile Image URL

                </label>

                <input
                    type="text"
                    name="profileImage"
                    className="form-control"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.profileImage}
                    onChange={handleChange}
                />

            </div>

            <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={submitting}
            >

                {submitting ? "Updating..." : "Update Profile"}

            </button>

        </form>

    );

}

export default ProfileForm;