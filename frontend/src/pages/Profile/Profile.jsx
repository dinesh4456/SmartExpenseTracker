import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import ProfileForm from "./ProfileForm";

import { getProfile } from "../../services/profileService";

function Profile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await getProfile();

            setProfile(data);

        } catch (error) {

            console.error(error);

            alert("Failed to load profile.");

        }

    };

    return (

        <MainLayout>

            <div className="container">

                <h2 className="mb-4">

                    User Profile

                </h2>

                <div className="card">

                    <div className="card-body">

                        {

                            profile && (

                                <>

                                    <div className="text-center mb-4">

                                        <img
                                            src={
                                                profile.profileImage ||
                                                "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.fullName || "User") + "&background=2563EB&color=fff&size=150"
                                            }
                                            alt="Profile"
                                            width="130"
                                            height="130"
                                            className="rounded-circle border shadow-sm object-fit-cover"
                                        />

                                        <h4 className="mt-3 mb-0 fw-bold">{profile.fullName}</h4>
                                        <span className="badge bg-secondary mt-1">{profile.role || "USER"}</span>

                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-2">
                                            <strong>Email:</strong> <span className="text-muted">{profile.email}</span>
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Phone:</strong> <span className="text-muted">{profile.phoneNumber || "Not provided"}</span>
                                        </div>
                                    </div>

                                    <hr />

                                    <h5 className="mb-3 fw-bold">Edit Profile Details</h5>

                                    <ProfileForm
                                        profile={profile}
                                        onSuccess={loadProfile}
                                    />

                                </>

                            )

                        }

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

export default Profile;