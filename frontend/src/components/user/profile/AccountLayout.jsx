
import AccountSidebar from "./AccountSidebar";

const AccountLayout = ({
    breadcrumb,
    heading,
    description,
    children,
}) => {
    return (
        <div className="min-h-screen bg-[#f8f8f8]">

            {/* Account Header */}
            <section className="border-b border-gray-200 bg-white px-6 py-8 lg:px-10">
                <div className="mx-auto max-w-7xl">

                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        <span>Home</span>
                        <span>/</span>
                        <span>My Account</span>
                        {breadcrumb && (
                            <>
                                <span>/</span>
                                <span className="text-black">{breadcrumb}</span>
                            </>
                        )}
                    </div>

                    <h1 className="font-heading text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        My Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Manage your personal information and account settings.
                    </p>
                </div>
            </section>

            {/* Account Content */}
            <section className="px-6 py-12 lg:px-10 lg:py-14">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">

                    <AccountSidebar />

                    {/* Main Content */}
                    <main className="min-w-0 border border-gray-200 bg-white p-6 md:p-8">

                        {/* Section Header */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
                                {heading}
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                {description}
                            </p>
                        </div>

                        {children}

                    </main>
                </div>
            </section>
        </div>
    );
};

export default AccountLayout;
