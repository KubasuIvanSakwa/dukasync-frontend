import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../zustand/store";

const AuthPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Reusable minimalist input styling
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm";
  const errorClass = "text-red-500 text-xs font-bold mt-1 px-1";

  return (
    <section className="min-h-screen w-full flex justify-center items-center bg-gray-50 p-4 font-sans">
      <div className="bg-white w-full max-w-[420px] rounded-[1.5rem] shadow-sm border border-gray-100 p-8 flex flex-col">
        {/* Minimalist Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          {error && (
            <div className="w-full text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center mb-4">
              *{error}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex w-full mb-8 bg-gray-50 p-1 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              isLogin
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              !isLogin
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {isLogin ? (
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) errors.email = "Required";
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              )
                errors.email = "Invalid email address";
              if (!values.password) errors.password = "Required";
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setError("");

              try {
                const response = await fetch(
                  "https://dukasync-backend-fvw3.onrender.com/api/v1/auth/sign-in",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  },
                );

                const result = await response.json();

                if (response.ok && result.success) {
                  const { token, user } = result.data;
                  login(user, token);
                  navigate("/");
                } else {
                  setError(
                    result.message || "Invalid credentials. Please try again.",
                  );
                }
              } catch (err) {
                console.error("Network/Auth error:", err);
                setError(
                  err.message ||
                    "Network error: Could not connect to the server.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setFieldValue, submitForm }) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <Field
                    placeholder="Email address"
                    className={inputClass}
                    type="email"
                    name="email"
                  />
                  <ErrorMessage
                    className={errorClass}
                    name="email"
                    component="div"
                  />
                </div>
                <div>
                  <div className="relative">
                    <Field
                      placeholder="Password"
                      className={`${inputClass} pr-16`}
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black focus:outline-none"
                    >
                      {showLoginPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    className={errorClass}
                    name="password"
                    component="div"
                  />
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
                  >
                    {isSubmitting ? "loading..." : "Log In"}
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      // Instantly prefill the form and trigger submission
                      setFieldValue("email", "ivansakwa@gmail.com");
                      setFieldValue("password", "123123");
                      setTimeout(() => submitForm(), 10);
                    }}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold py-3.5 rounded-xl transition-all active:scale-95"
                  >
                    Mock Admin Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              country: "",
              role: "customer",
              phone: "",
              password: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) errors.email = "Required";
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              )
                errors.email = "Invalid email address";
              
              if (!values.first_name) {
                errors.first_name = "Required";
              } else if (values.first_name.length < 2) {
                errors.first_name = "Must be at least 2 characters";
              }

              if (!values.last_name) {
                errors.last_name = "Required";
              } else if (values.last_name.length < 2) {
                errors.last_name = "Must be at least 2 characters";
              }

              if (!values.password) errors.password = "Required";
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setError("");

              try {
                const response = await fetch(
                  "https://dukasync-backend-fvw3.onrender.com/api/v1/auth/sign-up",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  },
                );

                const result = await response.json();

                if (response.ok && result.success) {
                  const { token, user } = result.data;
                  await login(user, token);
                  navigate("/");
                } else {
                  setError(
                    result.message ||
                      "Failed to create account. Please try again.",
                  );
                }
              } catch (err) {
                console.error("Sign up error:", err);
                setError(
                  err.message ||
                    "Network error: Could not connect to the server.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      placeholder="First Name (e.g. Ivan)"
                      className={inputClass}
                      name="first_name"
                    />
                    <ErrorMessage
                      className={errorClass}
                      name="first_name"
                      component="div"
                    />
                  </div>
                  <div>
                    <Field
                      placeholder="Last Name (e.g. Sakwa)"
                      className={inputClass}
                      name="last_name"
                    />
                    <ErrorMessage
                      className={errorClass}
                      name="last_name"
                      component="div"
                    />
                  </div>
                </div>

                <div>
                  <Field
                    placeholder="Email address"
                    className={inputClass}
                    type="email"
                    name="email"
                  />
                  <ErrorMessage
                    className={errorClass}
                    name="email"
                    component="div"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      placeholder="Phone (e.g. 0114872974)"
                      className={inputClass}
                      name="phone"
                    />
                  </div>
                  <div>
                    <Field
                      placeholder="Country (e.g. Kenya)"
                      className={inputClass}
                      name="country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      as="select"
                      className={`${inputClass} text-gray-500 appearance-none`}
                      name="role"
                    >
                      <option value="customer">customer</option>
                    </Field>
                  </div>
                  <div>
                    <div className="relative">
                      <Field
                        placeholder="Password"
                        className={`${inputClass} pr-16`}
                        type={showSignUpPassword ? "text" : "password"}
                        name="password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black focus:outline-none"
                      >
                        {showSignUpPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <ErrorMessage
                      className={errorClass}
                      name="password"
                      component="div"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 mt-2"
                >
                  {isSubmitting ? 'Creating Account...' :'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Footer Action */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
          >
            Continue as guest &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;