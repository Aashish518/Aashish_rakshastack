import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "", show: false });

    // Helper function to show status messages
    const showStatusMessage = (text, type = "info") => {
        setStatusMessage({ text, type, show: true });
        setTimeout(() => {
            setStatusMessage(prev => ({ ...prev, show: false }));
        }, 4000);
    };

    const handleSendOtp = async () => {
        if (!forgotEmail) {
            showStatusMessage("Please enter your email address", "error");
            return;
        }
        setForgotLoading(true);
        setStatusMessage({ text: "", type: "", show: false }); // Clear previous messages

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACK_URL}/send-otp`, { email: forgotEmail });
            if (res.data) {
                setOtpSent(true);
                showStatusMessage("Verification code sent to your email! Check your inbox.", "success");
            } else {
                showStatusMessage(res.data.message || "Email not found. Please check and try again.", "error");
            }
        } catch {
            showStatusMessage("Failed to send verification code. Please try again.", "error");
        } finally {
            setForgotLoading(false);
        }
    };

    // 2. Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp) {
            showStatusMessage("Please enter the verification code", "error");
            return;
        }
        setForgotLoading(true);
        setStatusMessage({ text: "", type: "", show: false }); // Clear previous messages

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACK_URL}/verify-otp`, {
                email: forgotEmail,
                otp
            });
            if (res.data) {
                setIsOtpVerified(true);
                showStatusMessage("Code verified successfully! Now create your new password.", "success");
            } else {
                showStatusMessage(res.data.message || "Invalid verification code. Please try again.", "error");
            }
        } catch {
            showStatusMessage("Failed to verify code. Please check and try again.", "error");
        } finally {
            setForgotLoading(false);
        }
    };

    // 3. Reset Password
    const handleResetPassword = async () => {
        if (!newPassword) {
            showStatusMessage("Please enter your new password", "error");
            return;
        }
        if (newPassword.length < 6) {
            showStatusMessage("Password must be at least 6 characters long", "error");
            return;
        }
        setForgotLoading(true);
        setStatusMessage({ text: "", type: "", show: false }); // Clear previous messages

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACK_URL}/forgot-password`, {
                email: forgotEmail,
                otp: otp,
                newPassword
            });
            if (res.status === 200) {
                showStatusMessage("Password reset successful! You can now login with your new password.", "success");
                setTimeout(() => {
                    setShowForgotModal(false);
                    setForgotEmail("");
                    setOtp("");
                    setNewPassword("");
                    setOtpSent(false);
                    setIsOtpVerified(false);
                    setStatusMessage({ text: "", type: "", show: false });
                }, 2000);
            } else {
                showStatusMessage(res.data.message || "Password reset failed. Please try again.", "error");
            }
        } catch (error) {
            showStatusMessage(error.response?.data?.message || "Error resetting password. Please try again.", "error");
        } finally {
            setForgotLoading(false);
        }
    };

    useEffect(() => {
        // Add entrance animation class after component mounts
        const timer = setTimeout(() => {
            document.querySelector('.login-page')?.classList.add('loaded');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACK_URL}/login`,
                {
                    email: form.email,
                    password: form.password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = res.data;

            // Show success message with better UX
            const successMessage = data.message || "Welcome back! Login successful!";

            // Create a temporary success notification
            const notification = document.createElement('div');
            notification.className = 'login-success-notification';
            notification.textContent = successMessage;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);

            console.log("Login response:", data);

            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }

            // Add exit animation before navigation
            document.querySelector('.login-page')?.classList.add('exiting');
            setTimeout(() => {
                navigate("/");
            }, 300);

        } catch (error) {
            console.error("Error during login:", error);
            const errorMessage = error.response?.data?.message || "Invalid credentials. Please try again.";

            // Create a temporary error notification
            const notification = document.createElement('div');
            notification.className = 'login-error-notification';
            notification.textContent = errorMessage;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 4000);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background Effects */}
            <div className="login-background">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
                <div className="gradient-mesh"></div>
            </div>

            {/* Main Login Container */}
            <div className="login-container">
                {/* Header Section */}
                <div className="login-header">
                    <div className="login-icon">
                        <span className="icon-emoji">🏠</span>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to find your perfect PG</p>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleSubmit}>
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
                            />
                            <div className="input-border"></div>
                        </div>
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
                                placeholder="Enter your password"
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
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        <span className="button-content">
                            {isLoading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span className="button-icon">🚀</span>
                                    <span>Sign In</span>
                                </>
                            )}
                        </span>
                        <div className="button-glow"></div>
                    </button>
                </form>

                {/* Footer Links */}
                <div className="login-footer">
                    <button
                        type="button"
                        className="link-button forgot-password"
                        onClick={() => setShowForgotModal(true)}
                    >
                        <span className="link-icon">🔑</span>
                        Forgot Password?
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="link-button register-link"
                        onClick={() => navigate("/register")}
                    >
                        <span className="link-text">Don't have an account?</span>
                        <span className="link-highlight">Create Account</span>
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

            {/* Enhanced Forgot Password Modal */}
            {showForgotModal && (
                <div className="fp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForgotModal(false)}>
                    <div className="fp-modal">
                        <div className="fp-modal-content">
                            <h2 className="fp-modal-title">Forgot Password</h2>

                            {/* Progress Indicator */}
                            <div className="fp-progress-bar">
                                <div className={`fp-progress-fill ${
                                    !otpSent ? 'step-1' :
                                    !isOtpVerified ? 'step-2' : 'step-3'
                                }`}></div>
                            </div>

                            <div className="fp-step-indicator">
                                <div className={`fp-step ${!otpSent ? 'active' : 'completed'}`}></div>
                                <div className={`fp-step ${otpSent && !isOtpVerified ? 'active' : isOtpVerified ? 'completed' : ''}`}></div>
                                <div className={`fp-step ${isOtpVerified ? 'active' : ''}`}></div>
                            </div>

                            {/* Status Message */}
                            {statusMessage.show && (
                                <div className={`fp-status-message fp-status-${statusMessage.type}`}>
                                    <span>{statusMessage.type === 'success' ? '✅' : statusMessage.type === 'error' ? '❌' : 'ℹ️'}</span>
                                    {statusMessage.text}
                                </div>
                            )}

                            {!otpSent ? (
                                <div className="fp-input-group">
                                    <label className="fp-input-label">📧 Email Address</label>
                                    <div className="fp-input-wrapper">
                                        <input
                                            type="email"
                                            className="fp-input"
                                            placeholder="Enter your email address"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                        />
                                        <div className="fp-input-border"></div>
                                    </div>
                                </div>
                            ) : !isOtpVerified ? (
                                <div className="fp-input-group">
                                    <label className="fp-input-label">🔢 Verification Code</label>
                                    <div className="fp-input-wrapper">
                                        <input
                                            type="text"
                                            className="fp-input"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength="6"
                                        />
                                        <div className="fp-input-border"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="fp-input-group">
                                    <label className="fp-input-label">🔒 New Password</label>
                                    <div className="fp-input-wrapper">
                                        <input
                                            type="password"
                                            className="fp-input"
                                            placeholder="Enter your new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <div className="fp-input-border"></div>
                                    </div>
                                </div>
                            )}

                            <div className="fp-button-group">
                                {!otpSent ? (
                                    <button
                                        className={`fp-btn fp-verify-btn ${forgotLoading ? 'fp-btn-loading' : ''}`}
                                        onClick={handleSendOtp}
                                        disabled={forgotLoading || !forgotEmail}
                                    >
                                        <span>🚀</span>
                                        {forgotLoading ? "Sending OTP..." : "Send Verification Code"}
                                    </button>
                                ) : !isOtpVerified ? (
                                    <button
                                        className={`fp-btn fp-verify-btn ${forgotLoading ? 'fp-btn-loading' : ''}`}
                                        onClick={handleVerifyOtp}
                                        disabled={forgotLoading || !otp}
                                    >
                                        <span>✅</span>
                                        {forgotLoading ? "Verifying..." : "Verify Code"}
                                    </button>
                                ) : (
                                    <button
                                        className={`fp-btn fp-reset-btn ${forgotLoading ? 'fp-btn-loading' : ''}`}
                                        onClick={handleResetPassword}
                                        disabled={forgotLoading || !newPassword}
                                    >
                                        <span>🔄</span>
                                        {forgotLoading ? "Resetting..." : "Reset Password"}
                                    </button>
                                )}

                                <button
                                    className="fp-btn fp-close-btn"
                                    onClick={() => {
                                        setShowForgotModal(false);
                                        // Reset all states when closing
                                        setForgotEmail("");
                                        setOtp("");
                                        setNewPassword("");
                                        setOtpSent(false);
                                        setIsOtpVerified(false);
                                    }}
                                >
                                    <span>✕</span>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Login;
