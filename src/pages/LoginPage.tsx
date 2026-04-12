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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
