import { redirect } from "next/navigation";

// /vendre/onboarding → /vendeur/onboarding (canonical URL)
export default function VendreOnboardingRedirect() {
  redirect("/vendeur/onboarding");
}
