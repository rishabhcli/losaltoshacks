import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Auth callback — simplified for local mode (no Palantir OAuth).
 * Just redirects to home.
 */
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return <div>Redirecting…</div>;
}

export default AuthCallback;
