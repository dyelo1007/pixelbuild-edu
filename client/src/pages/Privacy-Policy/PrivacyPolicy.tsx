import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto bg-lightbg dark:bg-darkbg border border-neonblue/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-neonblue">
            Privacy Policy
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Introduction
            </h2>
            <p>
              Welcome to PixelBuild Edu. We are committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              application. Please read this policy carefully.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Information We Collect
            </h2>
            <p>
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your username and email address, that you
                voluntarily give to us when you register with the application.
              </li>
              <li>
                <strong>Saved Builds & Progress:</strong> We collect data you
                generate within the application, such as saved PC builds, quiz
                scores, and challenge attempts, to provide you with our services
                and track your learning progress.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. How We Use Your Information
            </h2>
            <p>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the application to:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Create and manage your account.</li>
              <li>Email you regarding your account or order.</li>
              <li>Enable user-to-user communications.</li>
              <li>
                Monitor and analyze usage and trends to improve your experience.
              </li>
              <li>
                Compile anonymous statistical data for research purposes (for
                this thesis project).
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. Contact Us
            </h2>
            <p>
              If you have questions or comments about this Privacy Policy,
              please contact us through the form on our About page.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
