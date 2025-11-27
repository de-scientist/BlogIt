import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Info, KeyRound } from "lucide-react";

// Placeholder for data that might be fetched/available
interface ProfileData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  userName: string;
  bio?: string; // Bio is now optional/may come from the mock
}

// 💡 Define the specialties object outside the function for clean typing
const specialties = {
    'dev': 'software development and modern web architecture.',
    'admin': 'account management and operational excellence.',
    'manager': 'team leadership and strategic project planning.',
    'user': 'dedicated professional and valued member of the platform community.',
};

// 💡 Define a type alias for the literal keys of the specialties object
type SpecialtyKey = keyof typeof specialties;


// 💡 New function to generate a dynamic, professional bio based on username
const generateBio = (username: string): string => {
    if (!username) {
        return "Dedicated professional focusing on continuous improvement and excellence.";
    }
    
    // Find the key, ensuring the result is one of the literal keys (SpecialtyKey)
    const foundKey = Object.keys(specialties).find(k => username.toLowerCase().includes(k)) || 'user';

    // ✨ FIX: Assert the type of 'key' to be SpecialtyKey
    const key = foundKey as SpecialtyKey;
    
    return `Account holder @${username}, specializing in ${specialties[key]}`;
};


export default function ViewProfilePage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = (await api.get("/profile", { withCredentials: true })).data;
      // 💡 Mocking the new 'bio' field and ensuring required fields exist
      return {
          firstName: response.firstName || 'First',
          lastName: response.lastName || 'Last',
          emailAddress: response.emailAddress || 'N/A',
          userName: response.userName || 'unknown_user',
          bio: response.bio,
      };
    },
  });

  if (isLoading)
    return (
      <div className="pt-16 pl-64 flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  
  // FIX: Explicit check to satisfy TypeScript that data is definitely defined
  if (!data) {
    return (
        <div className="pt-16 pl-64 flex justify-center items-center min-h-screen">
            <p className="text-red-500 text-lg">Error: Could not load profile data.</p>
        </div>
    );
  }

  // --- Start using data safely from here ---

  // Generate initials
  const initials = `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`
    .toUpperCase()
    .trim();
  
  // Generate the bio using the new function
  const displayBio = data.bio || generateBio(data.userName);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-64 pb-10">

      {/* ---------------------------------- */}
      {/* HEADER AND CLEAR MESSAGE */}
      {/* ---------------------------------- */}
      <header className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
              <User className="w-8 h-8 mr-3 text-purple-600" /> Your Profile Overview
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              This is your public profile summary. Use the buttons below to manage your account settings.
          </p>
          <hr className="mt-4 border-gray-200 dark:border-gray-700" />
      </header>

      <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-0">
        
        {/* ---------------------------------- */}
        {/* PROFILE SUMMARY CARD (AVATAR & BIO) */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg dark:bg-slate-800 border-t-4 border-purple-600">
          <CardContent className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-6">
            
            {/* Avatar & Basic Info Column */}
            <div className="flex flex-col items-center min-w-[150px]">
                <Avatar className="w-24 h-24 border-4 border-purple-200 dark:border-purple-700 shadow-md">
                    <AvatarFallback className="text-3xl font-bold bg-purple-600 text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <h1 className="mt-4 text-xl font-bold">
                    {data.firstName} {data.lastName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{data.userName}</p>
            </div>

            {/* Bio/Description Column (New Feature) */}
            <div className="flex-1 border-l-0 md:border-l pl-0 md:pl-6 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-2">
                    <Info className="w-5 h-5 mr-2 text-purple-600" /> Quick Bio
                </h3>
                {/* Display the generated/mocked bio */}
                <p className="text-gray-600 dark:text-gray-400 italic">
                    {displayBio}
                </p>
            </div>
            
          </CardContent>
        </Card>


        {/* ---------------------------------- */}
        {/* CONTACT DETAILS CARD */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg dark:bg-slate-800 border-t-4 border-indigo-600">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
                <Mail className="w-6 h-6 mr-2 text-indigo-600" /> Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100 font-semibold">{data.emailAddress}</dd>
              </div>
              
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100 font-semibold">{data.userName}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* ---------------------------------- */}
        {/* ACTIONS CARD */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg dark:bg-slate-800 border-t-4 border-green-600">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                    <KeyRound className="w-6 h-6 mr-2 text-green-600" /> Account Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 pt-2">
                    <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center"
                        onClick={() => navigate("/profile/edit")}
                    >
                        <Lock className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>

                    <Button
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90 text-white transition-all flex items-center"
                        onClick={() => navigate("/auth/password")}
                    >
                        <Lock className="w-4 h-4 mr-2" /> Update Password
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}