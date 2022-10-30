import {FC} from 'react';

interface Forbidden403Props {
}

const Forbidden403: FC<Forbidden403Props> = () => {
    return (
        <div className="flex mt-5">
            <div className="mx-auto p-card shadow-1 px-6 pt-1 pb-3">
                <h1 className="">403 Forbidden</h1>
                <p>You don't have permission to access this resource.</p>
            </div>
        </div>
    );
};

export default Forbidden403;