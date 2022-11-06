import React, {useRef} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {authRequest} from "../../services/api.service";

interface ConfirmEmailProps {
    redirectTo: string;
}

const ConfirmEmail = ({redirectTo}: ConfirmEmailProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const confirmEmail = () => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        authRequest.post('users/confirm-email', {token, email})
            .then(_ => {
                showToast('success', 'Email confirmed', 'Your email has been confirmed successfully');
                setTimeout(() => {
                    navigate(redirectTo);
                }, 3000);
            })
            .catch(e => {
                console.log(e);
                showToast('error', 'Error', 'An error occurred while confirming your email');
            })
    }

    const toast = useRef<Toast>(null);
    const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
        if (toast.current)
            (toast.current).show({severity: severity, summary: summary, detail: detail, life: 3000});
    }

    return (
        <div className="surface-card p-4 shadow-1 border-round w-full lg:w-6 mx-auto mt-8">
            <Toast ref={toast}/>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Email confirmation</div>
                <div className="text-600 font-medium line-height-3 mb-3">
                    Click button below to confirm your e-mail address
                </div>
                <Button label="Confirm" onClick={confirmEmail}></Button>
            </div>
        </div>
    );
};

export default ConfirmEmail;
