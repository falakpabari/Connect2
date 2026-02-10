import Link from "next/link";
import { ProfessionalProfile } from "@/lib/types";
import { formatPriceWithSession } from "@/lib/utils";

interface ProfessionalCardProps {
  profile: ProfessionalProfile;
}

export default function ProfessionalCard({ profile }: ProfessionalCardProps) {
  return (
    <Link
      href={`/professionals/${profile.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {profile.role_title} at {profile.company}
          </p>
          <p className="text-sm text-gray-500 mt-1">{profile.industry}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatPriceWithSession(profile.price_cents)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 line-clamp-3">{profile.bio}</p>
    </Link>
  );
}
