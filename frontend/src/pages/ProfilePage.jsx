import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
      <h1 className="font-playfair text-3xl text-text-dark mb-6">My profile</h1>
      <div className="bg-white border border-border rounded-xl p-6 font-inter text-sm text-text-dark">
        <p>
          <span className="text-text-muted">Name:</span> {user?.name || "—"}
        </p>
        <p className="mt-2">
          <span className="text-text-muted">Email:</span> {user?.email || "—"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
