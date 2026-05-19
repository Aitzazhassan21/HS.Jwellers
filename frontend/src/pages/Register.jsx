import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="max-w-md mx-auto px-4 pt-28 pb-16">
      <h1 className="font-playfair text-3xl text-text-dark mb-2">Create account</h1>
      <p className="text-text-muted text-sm font-inter mb-6">
        Registration form will connect to your auth API here.
      </p>
      <Link to="/login" className="text-primary text-sm font-inter hover:underline">
        Already have an account? Sign in
      </Link>
    </div>
  );
};

export default Register;
