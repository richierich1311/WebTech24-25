export const checkAuthAndRedirect = (navigate, message) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert(message || "Nicht eingeloggt.");
      navigate("/");
      return false;
    }
    return true;
  };
  