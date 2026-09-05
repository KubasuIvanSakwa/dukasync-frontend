import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useAddToCart, useAuthStore } from "../../zustand/store";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useAddToCart();
  const { user, token } = useAuthStore();
  
  // State to control the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const grandTotal = subtotal + shipping;

  // Format totals
  const formattedSubtotal = Number(subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedGrandTotal = Number(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm";
  const errorClass = "text-red-500 text-xs font-bold mt-1 px-1";

  // Handle modal close
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-white font-sans flex flex-col relative">
      
      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <style>
            {`
              @keyframes animateScale {
                from { transform: scale(1); }
                to { transform: scale(1.15); }
              }
              .animate-scale {
                animation: animateScale .6s linear alternate-reverse infinite;
              }
            `}
          </style>
          
          <div className="overflow-hidden relative text-left w-full max-w-[500px] rounded-xl shadow-2xl bg-white flex flex-col">
            <button
              className="absolute right-3 top-3 z-10 flex items-center justify-center bg-white text-black border-2 border-gray-300 w-8 h-8 rounded-lg transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white pb-0.5 text-xl"
              type="button"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <div className="bg-[#47c9a2] p-10 flex justify-center">
              <div className="flex bg-[#e2feee] shrink-0 justify-center items-center w-16 h-16 rounded-full animate-scale shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <path d="M20 7L9.00004 18L3.99994 13" stroke="#0afa2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>

            <div className="p-8 text-center">
              <span className="text-[#066e29] text-xl font-bold leading-6">Order validated</span>
              <p className="mt-3 text-[#595b5f] text-sm leading-5 font-medium">
                Thank you for your purchase. Your package will be delivered within 2 days of your purchase.
              </p>
              <button 
                onClick={handleCloseModal}
                className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 p-4 sm:p-8">
        {/* Left Column: Shipping Form */}
        <div className="lg:col-span-7 flex flex-col pt-4">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
            Delivery Details
          </h2>

          <Formik
            initialValues={{
              email: user?.email || "",
              firstName: user?.first_name || "",
              lastName: user?.last_name || "",
              address: "",
              city: "Nairobi",
              phone: user?.phone || "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) errors.email = "Required";
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              )
                errors.email = "Invalid email address";
              if (!values.firstName) errors.firstName = "Required";
              if (!values.lastName) errors.lastName = "Required";
              if (!values.address) errors.address = "Required";
              if (!values.phone) errors.phone = "Required";
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              if (!user || !token) {
                alert("Session expired. Please log in again.");
                navigate("/auth");
                return;
              }

              const mappedItems = cart.map((item) => ({
                productId: item.id || item._id,
                quantity: item.quantity.toString(),
              }));

              const orderPayload = {
                user: user._id,
                items: mappedItems,
              };

              try {
                const response = await fetch(
                  "https://dukasync-backend-fvw3.onrender.com/api/v1/order",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderPayload),
                  },
                );

                const result = await response.json();

                if (response.ok) {
                  // Trigger the modal and clear the cart behind it
                  clearCart();
                  setShowSuccessModal(true);
                } else {
                  alert(result.message || "Failed to process order.");
                }
              } catch (error) {
                console.error("Order creation failed:", error);
                alert("Network error. Please verify your connection.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Contact Information
                  </h3>
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
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Field
                        placeholder="First Name"
                        className={inputClass}
                        name="firstName"
                      />
                      <ErrorMessage
                        className={errorClass}
                        name="firstName"
                        component="div"
                      />
                    </div>
                    <div>
                      <Field
                        placeholder="Last Name"
                        className={inputClass}
                        name="lastName"
                      />
                      <ErrorMessage
                        className={errorClass}
                        name="lastName"
                        component="div"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Field
                      placeholder="Street Address"
                      className={inputClass}
                      name="address"
                    />
                    <ErrorMessage
                      className={errorClass}
                      name="address"
                      component="div"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Field
                        placeholder="City"
                        className={inputClass}
                        name="city"
                      />
                      <ErrorMessage
                        className={errorClass}
                        name="city"
                        component="div"
                      />
                    </div>
                    <div>
                      <Field
                        placeholder="Phone Number"
                        className={inputClass}
                        name="phone"
                      />
                      <ErrorMessage
                        className={errorClass}
                        name="phone"
                        component="div"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 mt-6 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting
                    ? "Processing..."
                    : `Pay Ksh. ${formattedGrandTotal}`}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-gray-50 rounded-[2rem] p-6 sm:p-10 border border-gray-100 flex flex-col h-fit">
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-10 font-medium">
              Your cart is empty.
            </div>
          ) : (
            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-none">
              {cart.map((item) => {
                const itemTotal = Number(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                return (
                  <div
                    key={item.id || item.name}
                    className="flex items-start gap-4 p-2"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-gray-200 bg-white"
                      />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full inline-flex items-center justify-center shadow-sm z-[99]">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <div className="flex flex-col pr-2">
                        <span className="font-bold text-gray-900 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                      <div className="font-bold text-gray-900 mt-1 sm:mt-0">
                        Ksh. {itemTotal}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 flex flex-col gap-3">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>Ksh. {formattedSubtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Shipping</span>
              <span className="text-green-500 font-bold">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-end">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter">
                Ksh. {formattedGrandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;