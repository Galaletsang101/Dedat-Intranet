import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebase";

import "../styles/profile.css";


function Profile(){


    const [profile, setProfile] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const [userId, setUserId] = useState(null);



    useEffect(()=>{


        const unsubscribe = onAuthStateChanged(
            auth,
            async(user)=>{


                if(user){


                    setUserId(user.uid);


                    const userRef = doc(
                        db,
                        "users",
                        user.uid
                    );


                    const userSnap = await getDoc(userRef);



                    if(userSnap.exists()){


                        setProfile(
                            userSnap.data()
                        );


                    }

                }


            }
        );


        return unsubscribe;


    },[]);




    function handleChange(e){


        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });


    }





    async function saveProfile(){


        const userRef = doc(
            db,
            "users",
            userId
        );


        await updateDoc(
            userRef,
            {

                firstName: profile.firstName,

                surname: profile.surname,

                employeeNumber: profile.employeeNumber,

                programme: profile.programme,

                position: profile.position

            }
        );


        setEditMode(false);


    }




    if(!profile){

        return <p>Loading profile...</p>;

    }




    return (

        <div className="profile-page">


            <div className="profile-card">



                <div className="profile-header">


                   <div className="profile-avatar">

    {profile.firstName.charAt(0)}
    {profile.surname.charAt(0)}

</div>



                    <div>

                        <h1>

                            {profile.firstName} {profile.surname}

                        </h1>


                        <p>

                            {profile.position}

                        </p>


                    </div>


                </div>




                <div className="profile-actions">


                    <button
                        onClick={()=>setEditMode(!editMode)}
                    >

                        {editMode ? "Cancel" : "Edit Profile"}

                    </button>


                </div>





                <div className="profile-info">


                    <ProfileField
                        label="First Name"
                        name="firstName"
                        value={profile.firstName}
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
                        label="Employee Number"
                        name="employeeNumber"
                        value={profile.employeeNumber}
                        editMode={editMode}
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
                        label="Position"
                        name="position"
                        value={profile.position}
                        editMode={editMode}
                        onChange={handleChange}
                    />




                    <div className="profile-row">

                        <strong>
                            Email
                        </strong>

                        <span>
                            {profile.email}
                        </span>

                    </div>



                    <div className="profile-row">

                        <strong>
                            Role
                        </strong>

                        <span>
                            {profile.role}
                        </span>

                    </div>


                </div>





                {

                    editMode &&

                    <button
                        className="save-button"
                        onClick={saveProfile}
                    >

                        Save Changes

                    </button>

                }



            </div>


        </div>

    );

}





function ProfileField({
    label,
    name,
    value,
    editMode,
    onChange
}){


return (

<div className="profile-row">


<strong>
    {label}
</strong>



{

editMode ?

<input

name={name}

value={value || ""}

onChange={onChange}

/>

:

<span>
    {value}
</span>

}


</div>

);


}



export default Profile;