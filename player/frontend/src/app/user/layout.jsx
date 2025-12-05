import ProfileMainSection from "@/components/Account/ProfileMainSection";
import ProfileSidebar from "@/components/Account/ProfileSidebar";
import ProfileTopSection from "@/components/Account/ProfileTopSection";
export const dynamic = "force-dynamic";
export default function UserLayout({ children }) {
  return (
    <div className="relative">
      <div className="max-w-[1288px] max-sm:px-0 px-4 relative z-[1] w-full mx-auto">
        <ProfileTopSection />

        <div className="flex items-start gap-6 flex-wrap">
          <ProfileSidebar className="" />
          <ProfileMainSection>
            {children}
          </ProfileMainSection>
        </div>
      </div>
    </div>
  );
}
