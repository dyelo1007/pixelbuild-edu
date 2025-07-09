type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="min-h-screen flex justify-center items-center bg-darkbg">
    <div className="border-2 border-primary rounded-xl px-10 py-8 w-full max-w-md backdrop-blur-md bg-darkbg/70 shadow-md">
      <div className="flex justify-center mb-4">
        <img src="/wala-pa-logo" alt="logo" className="w-10 h-10" />
      </div>
      <h2 className="text-white text-2xl font-bold text-center">{title}</h2>
      <p className="text-gray-300 text-center mb-6">{subtitle}</p>
      {children}
    </div>
  </div>
);

export default AuthLayout;
