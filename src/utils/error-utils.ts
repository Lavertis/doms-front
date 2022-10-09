interface FormError {
    errors: Map<string, string[]>;
}

interface FormikErorrs {
    [k: string]: string;
}

export const formatErrorsForFormik = (formError: FormError) => {
    const formikErrors: FormikErorrs = {};
    formError.errors.forEach((value, fieldName) => {
        const fieldNameLowerCased = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
        formikErrors[fieldNameLowerCased] = value[0];
    });
    return formikErrors;
}