"use client"; //This is client component

//Component
import SignIn from "./SignIn";


const SignInMain = () => {
    return (
        <>
            <div className="min-h-screen bg-dark">
                <SignIn />
            </div>
        </>
    )
}

export default SignInMain;