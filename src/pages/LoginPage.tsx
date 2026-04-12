import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundBubbles } from "@/components/market/BackgroundBubbles";
import { usePreferences } from "@/hooks/usePreferences";
import { getAuthErrorMessage, toCurrentUser, validateEmail } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { clearSplashShown } from "@/lib/splash";
import { toast } from "sonner";

type Mode = "signin" | "create";
type Step = "form" | "verify";

export function LoginPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthReady, login } = usePreferences();
  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeInput, setCodeInput] = useState<string[]>(Array(6).fill(""));
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthReady && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, isAuthReady, navigate]);

  useEffect(() => {
    if (step === "verify") {
      digitRefs.current[0]?.focus();
    }
  }, [step]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!emailTouched && value.includes("@")) {
      setEmailTouched(true);
    }
    if (emailTouched || value.includes("@")) {
      const result = validateEmail(value);
      setEmailError(result.valid ? "" : (result.error ?? "Please enter a valid email address"));
    }
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      setEmailTouched(true);
      const result = validateEmail(email);
      setEmailError(result.valid ? "" : (result.error ?? "Please enter a valid email address"));
    }
  };

  const isEmailInvalid = emailTouched && emailError !== "";

  const normalizedEmail = email.trim().toLowerCase();

  const handleSignIn = async () => {
    setError("");
    if (!normalizedEmail || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Basic email format validation for sign in
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error ?? "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    const { data, error: authError } = await insforge.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setIsSubmitting(false);

    if (authError) {
      setError(getAuthErrorMessage(authError, "Unable to sign in"));
      return;
    }

    if (!data?.user) {
      setError("Unable to sign in");
      return;
    }

    clearSplashShown();
    login(toCurrentUser(data.user));
    navigate("/");
  };

  const handleCreateAccount = async () => {
    setError("");
    if (!displayName.trim() || !normalizedEmail || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Email validation
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error ?? "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    const { data, error: authError } = await insforge.auth.signUp({
      email: normalizedEmail,
      password,
      name: displayName.trim(),
    });

    setIsSubmitting(false);

    if (authError) {
      setError(getAuthErrorMessage(authError, "Unable to create your account"));
      return;
    }

    if (data?.requireEmailVerification) {
      setCodeInput(Array(6).fill(""));
      setStep("verify");
      toast.success("We sent a 6-digit verification code to your email.");
      return;
    }

    if (!data?.user) {
      setError("Unable to create your account");
      return;
    }

    clearSplashShown();
    login(toCurrentUser(data.user, displayName.trim()));
    navigate("/");
  };

  const handleVerify = async () => {
    setError("");
    const enteredCode = codeInput.join("");
    if (enteredCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setIsSubmitting(true);

    const { data, error: authError } = await insforge.auth.verifyEmail({
      email: normalizedEmail,
      otp: enteredCode,
    });

    setIsSubmitting(false);

    if (authError) {
      setError(getAuthErrorMessage(authError, "Unable to verify your email"));
      return;
    }

    if (!data?.user) {
      setError("Unable to verify your email");
      return;
    }

    clearSplashShown();
    login(toCurrentUser(data.user, displayName.trim()));
    navigate("/");
  };

  const handleResendCode = async () => {
    setError("");
    setIsSubmitting(true);

    const { error: authError } = await insforge.auth.resendVerificationEmail({
      email: normalizedEmail,
    });

    setIsSubmitting(false);

    if (authError) {
      setError(getAuthErrorMessage(authError, "Unable to resend verification code"));
      return;
    }

    setCodeInput(Array(6).fill(""));
    toast.success("Verification code sent.");
    setTimeout(() => digitRefs.current[0]?.focus(), 50);
  };

  const handleBackToForm = () => {
    setStep("form");
    setError("");
    setCodeInput(Array(6).fill(""));
  };

  const handleDigitChange = useCallback((index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    setCodeInput(prev => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // Auto-advance to next input
    if (digit && index < codeInput.length - 1) {
      digitRefs.current[index + 1]?.focus();
    }
  }, [codeInput.length]);

  const handleDigitKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !codeInput[index] && index > 0) {
        // Move focus to previous input on backspace when current is empty
        digitRefs.current[index - 1]?.focus();
      }
    },
    [codeInput],
  );

  const handleDigitPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, codeInput.length);
    if (!pasted) return;
    const newCode = Array(codeInput.length).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCodeInput(newCode);
    const focusIndex = Math.min(pasted.length, codeInput.length - 1);
    setTimeout(() => digitRefs.current[focusIndex]?.focus(), 0);
  }, [codeInput.length]);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setError("");
    setIsSubmitting(true);

    const { error: authError } = await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: window.location.origin + "/",
    });

    if (authError) {
      setIsSubmitting(false);
      setError(getAuthErrorMessage(authError, `Unable to continue with ${provider === "google" ? "Google" : "GitHub"}`));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (mode === "signin") {
      void handleSignIn();
      return;
    }
    void handleCreateAccount();
  };

  if (!isAuthReady) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundBubbles />

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
          {step === "verify" ? (
            /* Verification Code Screen */
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Check your email</h1>
                <p className="text-sm text-slate-500 mt-2">
                  We sent a 6-digit code to <span className="font-medium text-slate-700">{normalizedEmail}</span>
                </p>
              </div>

              {/* 6 digit inputs */}
              <div className="flex gap-2 justify-center mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    ref={el => {
                      digitRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={codeInput[i]}
                    onChange={e => handleDigitChange(i, e.target.value)}
                    onKeyDown={e => handleDigitKeyDown(i, e)}
                    onPaste={handleDigitPaste}
                    aria-label={`Digit ${i + 1}`}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <Button
                type="button"
                onClick={() => void handleVerify()}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all h-11"
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>

              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  Resend code
                </button>
              </div>
            </div>
          ) : (
            /* Normal Login/Create Form */
            <>
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4">
                  <Activity className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">MarketPulse</h1>
                <p className="text-sm text-slate-500 mt-1">AI-powered market intelligence</p>
              </div>

              {/* Mode toggle */}
              <div className="flex bg-slate-100/80 rounded-lg p-1 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setEmailError("");
                    setEmailTouched(false);
                  }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("create");
                    setError("");
                    setEmailError("");
                    setEmailTouched(false);
                  }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    mode === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Create account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "create" && (
                  <div>
                    <Label htmlFor="login-display-name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                      Display name
                    </Label>
                    <Input
                      id="login-display-name"
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-lg"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="login-email" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    onBlur={handleEmailBlur}
                    className={`bg-white text-slate-800 placeholder:text-slate-300 rounded-lg transition-colors ${
                      isEmailInvalid ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200"
                    }`}
                    autoComplete="email"
                  />
                  {isEmailInvalid && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-lg pr-10"
                      autoComplete={mode === "create" ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all h-11 mt-2"
                >
                  {isSubmitting ? (mode === "signin" ? "Signing in..." : "Creating account...") : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  onClick={() => void handleOAuthSignIn("google")}
                  disabled={isSubmitting}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  onClick={() => void handleOAuthSignIn("github")}
                  disabled={isSubmitting}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                    <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                  </svg>
                  GitHub
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
