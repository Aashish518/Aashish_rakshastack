import { useState, useEffect } from "react";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1: form, 2: otp, 3: complete
    const navigate = useNavigate();

    useEffect(() => {
        // Add entrance animation class after component mounts
        const timer = setTimeout(() => {
            document.querySelector('.register-page')?.classList.add('loaded');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `register-${type}-notification`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, type === 'error' ? 4000 : 3000);
    };

    const sendOtp = async () => {
        if (!form.email) {
            showNotification("Please enter your email first.", "error");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACK_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email })
            });

            const data = await res.json();

            if (res.ok) {
                setOtpSent(true);
                setCurrentStep(2);
                showNotification(data.message || "OTP sent to your email! Check your inbox.", "success");
            } else {
                showNotification(data.message || "Failed to send OTP", "error");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            showNotification("Something went wrong while sending OTP.", "error");
        } finally {
            setOtpLoading(false);
        }
    };


    const verifyOtp = async () => {
        if (!form.email || !otp) {
            showNotification("Please enter both email and OTP.", "error");
            return;
        }

        setVerifyLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACK_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, otp })
            });

            const data = await res.json();

            if (res.ok) {
                setIsVerified(true);
                setCurrentStep(3);
                showNotification(data.message || "Email verified successfully! 🎉", "success");
            } else {
                showNotification(data.message || "Invalid or expired OTP.", "error");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showNotification("Something went wrong while verifying OTP.", "error");
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isVerified) {
            showNotification("Please verify your email first.", "error");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACK_URL}/register`,
                {
                    name: form.name,
                    email: form.email,
                    password: form.password
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            showNotification(res.data.message || "Registration successful! Welcome aboard! 🚀", "success");

            // Add exit animation before navigation
            document.querySelector('.register-page')?.classList.add('exiting');
            setTimeout(() => {
                navigate("/login");
            }, 300);

        } catch (error) {
            console.error("Error during registration:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong during registration.";
            showNotification(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="register-page">
            {/* Background Effects */}
            <div className="register-background">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
                <div className="floating-orb orb-4"></div>
                <div className="gradient-mesh"></div>
            </div>

            {/* Progress Indicator */}
            <div className="progress-indicator">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                </div>
                <div className="progress-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Details</span>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify</span>
                    </div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Complete</span>
                    </div>
                </div>
            </div>

            {/* Main Register Container */}
            <div className="register-container">
                {/* Header Section */}
                <div className="register-header">
                    <div className="register-icon">
                        <span className="icon-emoji">✨</span>
                    </div>
                    <h1 className="register-title">Join PG Finder</h1>
                    <p className="register-subtitle">Create your account to find the perfect PG</p>
                </div>

                {/* Registration Form */}
                <form className="register-form" onSubmit={handleSubmit}>
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="form-step active">
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">👤</span>
                                    Full Name
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    <div className="input-border"></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">📧</span>
                                    Email Address
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your email"
                                        required
                                        disabled={otpSent}
                                    />
                                    <div className="input-border"></div>
                                </div>
                                {!isVerified && (
                                    <button
                                        type="button"
                                        className={`otp-button ${otpLoading ? 'loading' : ''}`}
                                        onClick={sendOtp}
                                        disabled={otpLoading || !form.email}
                                    >
                                        <span className="button-content">
                                            {otpLoading ? (
                                                <>
                                                    <span className="loading-spinner"></span>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="button-icon">📨</span>
                                                    <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {currentStep === 2 && (
                        <div className="form-step otp-step active">
                            <div className="otp-header">
                                <div className="otp-icon">📱</div>
                                <h3>Verify Your Email</h3>
                                <p>We've sent a verification code to <strong>{form.email}</strong></p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">🔢</span>
                                    Verification Code
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="form-input otp-input"
                                        maxLength="6"
                                    />
                                    <div className="input-border"></div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`verify-button ${verifyLoading ? 'loading' : ''}`}
                                onClick={verifyOtp}
                                disabled={verifyLoading || !otp}
                            >
                                <span className="button-content">
                                    {verifyLoading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="button-icon">✅</span>
                                            <span>Verify Email</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Step 3: Password & Complete */}
                    {currentStep === 3 && (
                        <div className="form-step password-step active">
                            <div className="verification-success">
                                <div className="success-icon">✅</div>
                                <p>Email verified! Complete your registration</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">🔒</span>
                                    Password
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                    <div className="input-border"></div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`register-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                <span className="button-content">
                                    {isLoading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="button-icon">🚀</span>
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </span>
                                <div className="button-glow"></div>
                            </button>
                        </div>
                    )}
                </form>

                {/* Footer Links */}
                <div className="register-footer">
                    <div className="divider">
                        <span>Already have an account?</span>
                    </div>

                    <button
                        type="button"
                        className="login-link"
                        onClick={() => navigate("/login")}
                    >
                        <span className="link-text">Sign in to your account</span>
                        <span className="link-arrow">→</span>
                    </button>
                </div>
            </div>

            {/* Back to Home Button */}
            <button
                className="back-home-button"
                onClick={() => navigate("/")}
            >
                <span className="back-icon">←</span>
                <span>Back to Home</span>
            </button>
        </div>
    );
};

export default Register;
