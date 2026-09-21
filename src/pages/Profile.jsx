
import { useState } from "react";

import {
    getCurrentUser,
    updateProfile
} from "../services/authService";

import "../styles/profile.css";


function Profile() {

    const [profile, setProfile] = useState(
        getCurrentUser()
    );

    const [editMode, setEditMode] = useState(false);


    function handleChange(e) {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    }


    function cancelEdit() {

        setProfile(
            getCurrentUser()
        );

        setEditMode(false);

    }

    async function saveProfile() {

    try {

        const updatedUser = await updateProfile(
            profile.id,
            profile
        );

        setProfile(updatedUser);

        setEditMode(false);

        alert("Profile updated successfully.");

    } catch (error) {

        alert(error.message);

    }

}

    if (!profile) {

        return (
            <p>
                Loading profile...
            </p>
        );

    }


    const initials =
        `${profile.first_name?.charAt(0) || ""}${profile.surname?.charAt(0) || ""}`;


    return (

        <div className="profile-page">

            <div className="profile-card">


                {/* ==========================================
                    PROFILE HEADER
                ========================================== */}

                <div className="profile-header">

                    <div className="profile-avatar">

                        {initials}

                    </div>


                    <div>

                        <h1>

                            {profile.first_name} {profile.surname}

                        </h1>


                        <p>

                            {profile.position}

                        </p>

                    </div>

                </div>



                {/* ==========================================
                    PROFILE ACTIONS
                ========================================== */}

                <div className="profile-actions">

                    <button
                        onClick={() =>
                            editMode
                                ? cancelEdit()
                                : setEditMode(true)
                        }
                    >

                        {editMode
                            ? "Cancel"
                            : "Edit Profile"}

                    </button>

                </div>



                {/* ==========================================
                    PROFILE INFORMATION
                ========================================== */}

                <div className="profile-info">


                    <ProfileField
                        label="First Name"
                        name="first_name"
                        value={profile.first_name}
                        editMode={editMode}
                        onChange={handleChange}
                    />


                    <ProfileField
                        label="Surname"
                        name="surname"
                        value={profile.surname}
                        editMode={editMode}
                        onChange={handleChange}
                    />


                    <ProfileField
                        label="Employee ID"
                        name="employee_id"
                        value={profile.employee_id}
                        editMode={false}
                        onChange={handleChange}
                    />


                    <ProfileField
                        label="Programme"
                        name="programme"
                        value={profile.programme}
                        editMode={editMode}
                        onChange={handleChange}
                    />


                    <ProfileField
                        label="Subprogramme"
                        name="subprogramme"
                        value={profile.subprogramme}
                        editMode={editMode}
                        onChange={handleChange}
                    />


                    <ProfileField
                        label="Position"
                        name="position"
                        value={profile.position}
                        editMode={editMode}
                        onChange={handleChange}
                    />



                    {/* Email */}

                    <div className="profile-row">

                        <strong>
                            Email
                        </strong>

                        <span>
                            {profile.email}
                        </span>

                    </div>



                    {/* Role */}

                    <div className="profile-row">

                        <strong>
                            Role
                        </strong>

                        <span>
                            {profile.role}
                        </span>

                    </div>



                    {/* Account Created */}

                    <div className="profile-row">

                        <strong>
                            Account Created
                        </strong>

                        <span>
                            {profile.created_date
                                ? new Date(
                                    profile.created_date
                                ).toLocaleDateString()
                                : "N/A"}
                        </span>

                    </div>


                </div>



                {/* ==========================================
                    SAVE BUTTON
                ========================================== */}

              {editMode && (

    <button
        className="save-button"
        onClick={saveProfile}
    >
        Save Changes
    </button>

)}


            </div>

        </div>

    );

}



/* ==========================================
   PROFILE FIELD
========================================== */

function ProfileField({
    label,
    name,
    value,
    editMode,
    onChange
}) {

    return (

        <div className="profile-row">

            <strong>
                {label}
            </strong>


            {editMode ? (

                <input
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                />

            ) : (

                <span>
                    {value || "N/A"}
                </span>

            )}

        </div>

    );

}


export default Profile;

