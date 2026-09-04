import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';

const Login = () => (
    <section className='flex justify-center items-center h-[90vh] w-full'>
        <Formik
        initialValues={{ email: '', password: '' }}
        validate={values => {
            const errors = {};
            if (!values.email) {
            errors.email = '*required'
            } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
            errors.email = '*invalid email address'
            }
            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            localStorage.setItem('email', JSON.stringify(values))
            window.location.href = "/"
        }}
        >
        {({ isSubmitting }) => (
            <Form
                className='flex flex-col justify-center items-center shadow-lg rounded-lg w-[30%] h-[50%]'
            >
                <ErrorMessage className='text-red-600' name="email" component="div" />
                <Field placeholder="email" className="p-1 m-2 w-[15rem] rounded-sm h-[2rem]" type="email" name="email" />

                <ErrorMessage name="password" component="div" />
                <Field placeholder="password" className="p-1 m-2 w-[15rem] rounded-sm h-[2rem]" type="password" name="password" />
                <button
                    type="submit" 
                    disabled={isSubmitting}
                    className='bg-black w-[40%] h-[2rem] rounded-xl text-white font-bold'
                >
                    Submit
                </button>
                <Link
                    className='mt-3 w-[40%] h-[2rem] text-black/80 underline'
                    to="/"
                >
                    continue as guest
                </Link>
            </Form>
        )}
        </Formik>
    </section>
);

export default Login