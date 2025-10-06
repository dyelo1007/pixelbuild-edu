import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto bg-lightbg dark:bg-darkbg border border-neonblue/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-neonblue">
            Terms and Conditions
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
              1. Agreement to Terms
            </h2>
            <p>
              By creating an account and using the PixelBuild Edu application
              ("the Service"), you agree to be bound by these Terms and
              Conditions. If you disagree with any part of the terms, then you
              may not access the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. User Accounts
            </h2>
            <p>
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. Failure to
              do so constitutes a breach of the Terms, which may result in
              immediate termination of your account on our Service. You are
              responsible for safeguarding the password that you use to access
              the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. User-Generated Content
            </h2>
            <p>
              Our Service allows you to create, save, and manage content,
              including PC builds, quiz attempts, and review sets ("User
              Content"). You retain any and all of your rights to any User
              Content you submit. By creating User Content, you grant us a
              non-exclusive license to use, store, and display that content for
              the purpose of operating and providing the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. Intellectual Property
            </h2>
            <p>
              The Service and its original content (excluding User Content),
              features, and functionality are and will remain the exclusive
              property of PixelBuild Edu. This project is for educational
              purposes as part of a thesis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please{" "}
              <Link to="/about" className="text-neonblue hover:underline">
                contact us
              </Link>
              .
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
