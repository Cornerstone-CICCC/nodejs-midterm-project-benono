import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { logout } = useAuthStore();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <button
        onClick={logout}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
