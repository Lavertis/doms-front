import React from 'react';
import {Panel} from "primereact/panel";
import {observer} from "mobx-react-lite";
import userStore from "../../store/user-store";

const Home = () => {
    return (
        <div className="w-11 sm:w-10 md:w-9 lg:w-8 xl:w-6 mx-auto my-5">
            <Panel header="Welcome to the Doctor's Office Management System" className="text-center line-height-3">
                <p>
                    Thank you for choosing our system to manage your office. <br/>
                    We hope it will make your job easier and more efficient.<br/>
                    Feel free to contact us if you have any questions or suggestions.
                </p>
                <p className="font-italic font-bold">
                    {
                        userStore.user != null ?
                            `You are currently logged in as ${userStore.user?.role}.` :
                            "You are currently not logged in."
                    }
                </p>
            </Panel>
        </div>
    );
};

export default observer(Home);
