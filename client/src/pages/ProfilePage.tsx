import { useState, useRef } from "react";
//import axiosInstance from "../utils/axiosInstance";

import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [name, setName] = useState(authUser?.name || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [age, setAge] = useState(authUser?.age || "");
  const [gender, setGender] = useState(authUser?.gender || "");
  const [genderPreference, setGenderPreference] = useState(
    authUser?.genderPreference || ""
  );
  const [image, setImage] = useState(authUser?.image || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfile, deleteAccount, loading } = useUserStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile({
      name,
      bio,
      age: Number(age),
      gender,
      genderPreference,
      image,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-grow flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Your Profile
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300
										 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
										sm:text-sm"
                  />
                </div>
              </div>

              {/* AGE */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* GENDER */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </span>
                <div className="flex space-x-4">
                  {["Male", "Female"].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="gender"
                        value={option.toLowerCase()}
                        checked={gender === option.toLowerCase()}
                        onChange={() => setGender(option.toLowerCase())}
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GENDER PREFERENCE */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference
                </span>
                <div className="flex space-x-4">
                  {["Male", "Female", "Both"].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600"
                        checked={
                          genderPreference.toLowerCase() ===
                          option.toLowerCase()
                        }
                        onChange={() =>
                          setGenderPreference(option.toLowerCase())
                        }
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BIO */}

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <div className="mt-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="User Image"
                    className="w-48 h-full object-cover rounded-md"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
								focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 
								focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </form>
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4">Delete Account?</h4>
                  <p className="mb-4">This action cannot be undone.</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="bg-gray-200 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteAccount}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
