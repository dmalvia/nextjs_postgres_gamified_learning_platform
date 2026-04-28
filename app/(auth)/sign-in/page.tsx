import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">B</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back to BuildSpace</h1>
        <p className="text-gray-500 mt-2">
          Sign in to continue your learning journey
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none p-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
            formButtonPrimary:
              "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
            footerActionLink: "text-purple-600 hover:text-purple-700",
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
