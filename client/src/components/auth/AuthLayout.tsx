type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="min-h-screen flex justify-center items-center bg-lightbg dark:bg-darkbg rounded-2xl">
    <div className="border-3 border-neonblue rounded-xl px-10 py-8 w-full max-w-md backdrop-blur-md bg-lightbgfill dark:bg-darkbg/70 shadow-md">
      <div className="flex justify-center mb-4">
        <img src="/wala-pa-logo" alt="logo" className="w-10 h-10" />
      </div>
      <h2 className="dark:text-white text-neonblue text-2xl font-bold text-center">
        {title}
      </h2>
      <p className="dark:text-gray-300 text-neonblue/70 text-center mb-6">
        {subtitle}
      </p>
      {children}
    </div>
  </div>
);

export default AuthLayout;
